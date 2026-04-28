import { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/api";

const DispatchContext = createContext(null);

export function DispatchProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentLoggedInVolunteer, setCurrentLoggedInVolunteer] = useState(null);

  const fetchData = async () => {
    try {
      const [tasksRes, volunteersRes] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks`),
        fetch(`${API_BASE_URL}/volunteers`)
      ]);

      const [tasksData, volunteersData] = await Promise.all([
        tasksRes.json(),
        volunteersRes.json()
      ]);

      // Map Mongo _id to id for frontend compatibility
      const mappedTasks = tasksData.map(t => ({ ...t, id: t._id }));
      const mappedVolunteers = volunteersData.map(v => ({ ...v, id: v._id }));

      setTasks(mappedTasks);
      setVolunteers(mappedVolunteers);
      
      // Default to Sarah Jenkins (first volunteer in seed)
      if (mappedVolunteers.length > 0) {
        setCurrentLoggedInVolunteer(mappedVolunteers[0]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const assignTask = async (taskId, volunteerId) => {
    try {
      // 1. Update task in DB
      const taskRes = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ volunteerId })
      });

      if (!taskRes.ok) throw new Error("Failed to assign task");

      // 2. Update volunteer stats in DB
      const impact = Math.floor(Math.random() * 5) + 1;
      const volRes = await fetch(`${API_BASE_URL}/volunteers/${volunteerId}/stats`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hours: 3, completed: 1, impact })
      });

      if (!volRes.ok) throw new Error("Failed to update volunteer stats");

      // 3. Refresh local state
      await fetchData();

    } catch (err) {
      console.error("Error in assignTask:", err);
    }
  };

  return (
    <DispatchContext.Provider
      value={{
        tasks,
        volunteers,
        currentLoggedInVolunteer,
        assignTask,
        loading,
        refreshData: fetchData,
      }}
    >
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatchState() {
  const context = useContext(DispatchContext);
  if (!context) {
    throw new Error("useDispatchState must be used within a DispatchProvider");
  }
  return context;
}
