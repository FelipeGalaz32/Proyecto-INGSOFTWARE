import { useState, useEffect } from "react";
import "./App.css";
import { TABS } from "./constants";
import RegistroUsuario from "./components/RegistroUsuario";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import TabPortafolio from "./components/TabPortafolio";
import TabEvaluacion from "./components/TabEvaluacion";
import TabChatbot from "./components/TabChatbot";
import TabDashboard from "./components/TabDashboard";

export default function App() {
    const [usuario, setUsuario] = useState(null);
    const [tabActiva, setTabActiva] = useState(TABS[0].id);

    // Determinar si el usuario logueado es estudiante
    const esEstudiante = usuario?.rol === "ESTUDIANTE" || usuario?.rol === "Estudiante";

    // Filtrar las pestañas según el rol
    const tabsDisponibles = TABS.filter((tab) => {
        if (esEstudiante) {
            // El estudiante NO puede ver "evaluacion" ni "dashboard"
            return tab.id !== "evaluacion" && tab.id !== "dashboard";
        }
        return true; // Otros roles (profesor, coordinador, etc.) ven todas
    });

    // Si el usuario cambia o se loguea, asegurar que la pestaña activa sea válida
    useEffect(() => {
        if (usuario && tabsDisponibles.length > 0) {
            const tabEsValida = tabsDisponibles.some((t) => t.id === tabActiva);
            if (!tabEsValida) {
                setTabActiva(tabsDisponibles[0].id);
            }
        }
    }, [usuario, tabActiva, tabsDisponibles]);

    if (!usuario) {
        return <RegistroUsuario onIngresar={setUsuario} />;
    }

    return (
        <div className="app-shell">
            <Header usuario={usuario} onCerrarSesion={() => setUsuario(null)} />
            <TabNav tabs={tabsDisponibles} activa={tabActiva} onChange={setTabActiva} />

            <main className="app-content">
                {tabActiva === "portafolio" && <TabPortafolio usuario={usuario} />}
                {tabActiva === "chatbot" && <TabChatbot rol={usuario.rol} usuario={usuario} />}
                {!esEstudiante && tabActiva === "evaluacion" && <TabEvaluacion rol={usuario.rol} />}
                {!esEstudiante && tabActiva === "dashboard" && <TabDashboard rol={usuario.rol} />}
            </main>
        </div>
    );
}