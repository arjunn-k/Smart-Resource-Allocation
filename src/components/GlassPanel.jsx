export default function GlassPanel({ className = "", children }) {
  return <div className={`glass-panel rounded-[28px] ${className}`}>{children}</div>;
}
