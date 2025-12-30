export default function SectionCard({ title, children, className = "" }) {
  return (
    <div className={`bg-white rounded-xl shadow p-5 ${className}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      {children}
    </div>
  );
}