export default function TabNav({ tabs, activa, onChange }) {
  return (
    <nav className="tab-nav">
      {tabs.map((t) => (
        <button
          key={t.id}
          className={`tab-nav__item ${activa === t.id ? "is-active" : ""}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </nav>
  );
}
