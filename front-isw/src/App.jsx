// src/App.jsx

import { useState, useEffect, useMemo } from "react";
import "./App.css";
import { TABS } from "./constants";
import RegistroUsuario from "./components/RegistroUsuario";
import Header from "./components/Header";
import TabNav from "./components/TabNav";
import TabPortafolio from "./components/TabPortafolio";
import TabEvaluacion from "./components/TabEvaluacion";
import TabChatbot from "./components/TabChatbot";
import TabDashboard from "./components/TabDashboard";

// Homologación estricta según entidades JPA de Backend
function normalizarRol(rolRaw) {
    if (!rolRaw) return "";
    const r = String(rolRaw).trim().toUpperCase();

    if (r.includes("COORDINADOR")) return "COORDINADOR_PRACTICA";
    if (r.includes("TUTOR")) return "TUTOR_UNIVERSIDAD";
    if (r.includes("COLABORADOR")) return "COLABORADOR";
    if (r.includes("PROFESOR") || r.includes("DOCENTE")) return "PROFESOR_ASIGNATURA";
    if (r.includes("ESTUDIANTE") || r.includes("ALUMNO")) return "ESTUDIANTE";

    return r;
}

// Convierte la clave interna del rol a un texto amigable para la interfaz
function formatearRol(rolKey) {
    switch (rolKey) {
        case "ESTUDIANTE":
            return "Estudiante";
        case "PROFESOR_ASIGNATURA":
            return "Profesor de Asignatura";
        case "TUTOR_UNIVERSIDAD":
            return "Tutor Universidad";
        case "COORDINADOR_PRACTICA":
            return "Coordinador de Práctica";
        case "COLABORADOR":
            return "Profesor Colaborador";
        default:
            return rolKey ? rolKey.replace(/_/g, " ") : "";
    }
}

export default function App() {
    const [usuario, setUsuario] = useState(() => {
        try {
            const sesion = localStorage.getItem("usuario");
            return sesion ? JSON.parse(sesion) : null;
        } catch {
            return null;
        }
    });

    const [tabActiva, setTabActiva] = useState("");

    const rolNormalizado = useMemo(() => {
        return normalizarRol(usuario?.rol || usuario?.role);
    }, [usuario]);

    const rolFormateado = useMemo(() => {
        return formatearRol(rolNormalizado);
    }, [rolNormalizado]);

    // Filtrar las pestañas visibles para cada rol
    const tabsDisponibles = useMemo(() => {
        if (!usuario || !rolNormalizado) return [];
        return TABS.filter((tab) => !tab.roles || tab.roles.includes(rolNormalizado));
    }, [usuario, rolNormalizado]);

    // Garantizar que la pestaña activa seleccionada corresponda a un acceso válido
    useEffect(() => {
        if (tabsDisponibles.length > 0) {
            const existe = tabsDisponibles.some((t) => t.id === tabActiva);
            if (!existe) {
                setTabActiva(tabsDisponibles[0].id);
            }
        }
    }, [tabsDisponibles, tabActiva]);

    const handleCerrarSesion = () => {
        localStorage.removeItem("usuario");
        setUsuario(null);
    };

    if (!usuario) {
        return <RegistroUsuario onIngresar={setUsuario} />;
    }

    return (
        <div className="app-shell">
            <Header usuario={{ ...usuario, rol: rolFormateado }} onCerrarSesion={handleCerrarSesion} />
            <TabNav tabs={tabsDisponibles} activa={tabActiva} onChange={setTabActiva} />

            <main className="app-content">
                {tabActiva === "portafolio" && <TabPortafolio usuario={usuario} />}
                {tabActiva === "chatbot" && <TabChatbot rol={rolNormalizado} usuario={usuario} />}
                {tabActiva === "evaluacion" && <TabEvaluacion rol={rolNormalizado} usuario={usuario} />}
                {tabActiva === "dashboard" && <TabDashboard rol={rolNormalizado} usuario={usuario} />}
            </main>
        </div>
    );
}