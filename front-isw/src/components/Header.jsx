// src/components/Header.jsx

export default function Header({ usuario, onCerrarSesion }) {
    return (
        <header className="app-header">
            <div className="app-header__title">
                <span className="app-header__badge">MD's</span>
                <div>
                    <h1>MateDocs</h1>
                    <p>Portafolio único, evaluación digital y planificaciones con retroalimentación</p>
                </div>
            </div>

            <div
                className="user-badge"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.4rem"
                }}
            >
                {/* Texto alineado a la derecha */}
                <div style={{ textAlign: "right" }}>
                    <strong style={{ display: "block", color: "#ffffff", fontSize: "0.95rem" }}>
                        {usuario?.nombre || usuario?.email}
                    </strong>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px" }}>
            <span className="user-badge__rol" style={{ opacity: 0.9 }}>
              {usuario?.rol}
            </span>
                        {usuario?.colegio && (
                            <span
                                className="user-badge__colegio"
                                style={{
                                    fontSize: "0.75rem",
                                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                                    padding: "2px 6px",
                                    borderRadius: "4px",
                                    color: "#ffffff"
                                }}
                            >
                🏫 {usuario.colegio}
              </span>
                        )}
                    </div>
                </div>

                {/* Botón alineado a la derecha */}
                <button
                    className="btn"
                    onClick={onCerrarSesion}
                    style={{
                        backgroundColor: "#dc2626",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.3rem 0.8rem",
                        fontSize: "0.8rem",
                        fontWeight: "600",
                        cursor: "pointer",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        transition: "background-color 0.2s ease"
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#b91c1c")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "#dc2626")}
                >
                    Cerrar sesión
                </button>
            </div>
        </header>
    );
}