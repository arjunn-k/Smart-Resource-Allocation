import { Float, Line, OrbitControls, Sphere, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";

const points = [
  [-1.8, 1.2, 0.3],
  [-0.7, -0.4, 1.5],
  [0.2, 1.5, -0.8],
  [1.4, -0.2, 1.2],
  [1.8, 1.0, -0.4],
  [-1.1, -1.4, -0.7],
  [0.8, -1.6, 0.1],
];

function NetworkNodes() {
  return (
    <>
      {points.map((position, index) => (
        <Float key={index} speed={2 + index * 0.1} rotationIntensity={0.45} floatIntensity={0.8}>
          <Sphere args={[0.08, 32, 32]} position={position}>
            <meshStandardMaterial
              color={index % 2 === 0 ? "#22d3ee" : "#22c55e"}
              emissive={index % 3 === 0 ? "#ef4444" : "#22d3ee"}
              emissiveIntensity={1.2}
              roughness={0.2}
            />
          </Sphere>
        </Float>
      ))}

      <Line points={[points[0], points[2], points[4], points[1], points[5], points[0]]} color="#22d3ee" lineWidth={1.2} transparent opacity={0.6} />
      <Line points={[points[3], points[2], points[6], points[5], points[3]]} color="#ef4444" lineWidth={1.2} transparent opacity={0.4} />
    </>
  );
}

export default function SceneHero() {
  return (
    <div className="h-[320px] w-full overflow-hidden rounded-[28px] border border-black/10 dark:border-white/10 bg-slate-950/70 lg:h-[420px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#020617"]} />
        <ambientLight intensity={1.2} />
        <pointLight position={[3, 3, 3]} intensity={25} color="#22d3ee" />
        <pointLight position={[-3, -2, 2]} intensity={18} color="#ef4444" />
        <Stars radius={70} depth={40} count={1400} factor={3} saturation={0} fade speed={0.5} />
        <NetworkNodes />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.9} enablePan={false} />
      </Canvas>
    </div>
  );
}
