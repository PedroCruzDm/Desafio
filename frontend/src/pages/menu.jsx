import { useEffect, useState } from "react";
import Eventos from "../components/Eventos/Eventos.jsx"
import Dashboard from "../components/Dashboard/Dashboard.jsx"
import Equipes from "../components/Equipes/Equipes.jsx"
const UserProfile = ({ usuario }) => (
    <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2rem"}}>
        <div style={{display: "grid", gridTemplateColumns: "34px 1fr", alignItems: "center", gap: "0.75rem", width: "100%",}}>

            <img src={usuario.fotoPerfil}alt="Foto de Perfil" style={{ width: 34, height: 34, borderRadius: "50%" }}/>
            <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontWeight: "bold" }}>{usuario.nome}</span>
                <span style={{ fontSize: "0.9em", color: "#888" }}>
                    {usuario.admin ? "Administrador" : "Usuário"}
                </span>
            </div>
        </div>
    </div>
);

const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "eventos", label: "Eventos" },
    { id: "equipes", label: "Equipes" },
    { id: "inscricao", label: "Inscrições" },
];

const SidebarMenu = ({ onItemClick, onItemDoubleClick, activeItem }) => (
    <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
            <h4 style={{ textAlign: "center" }}>Menu</h4>
        </li>
        {menuItems.map(item => (
            <li key={item.id}>
                <a
                    href={`#${item.id}`}
                    style={{
                        fontWeight: activeItem === item.id ? "bold" : "normal",
                        color: activeItem === item.id ? "#1976d2" : "inherit",
                        cursor: "pointer",
                        userSelect: "none"
                    }}
                    onClick={e => {
                        e.preventDefault();
                        onItemClick(item.id);
                    }}
                    onDoubleClick={e => {
                        e.preventDefault();
                        onItemDoubleClick(item.id);
                    }}
                >
                    {item.label}
                </a>
            </li>
        ))}
    </ul>
);

const Sidebar = ({ usuario, onLogout, onMenuClick, onMenuDoubleClick, activeItem }) => (
    <aside style={{ width: "220px", background: "#f5f5f5", padding: "2rem 1rem", display: "flex", flexDirection: "column", justifyContent: "space-between"}} >
        <nav>
            <SidebarMenu onItemClick={onMenuClick} onItemDoubleClick={onMenuDoubleClick} activeItem={activeItem} />
        </nav>
        <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "2rem"}}>
            <UserProfile usuario={usuario} />
            <button style={{padding: "0.5rem", borderRadius: "4px", border: "none", background: "#e0e0e0", cursor: "pointer"}}>
                Configurações
            </button>
            <button style={{padding: "0.5rem", borderRadius: "4px", border: "none", background: "#ff5252", color: "#fff", cursor: "pointer"}}
                onClick={onLogout}>
                Sair
            </button>
        </div>
    </aside>
);

export const Menu = () => {
    const [usuario, setUsuario] = useState(null);
    const [activeItem, setActiveItem] = useState("dashboard");
    const [showInitialContent, setShowInitialContent] = useState(false);

    useEffect(() => {
        const usuarioStorage = localStorage.getItem("usuario");
        if (usuarioStorage) {
            setUsuario(JSON.parse(usuarioStorage));
        }
    }, []);

    if (!usuario) return <p>Carregando...</p>;
    const handleLogout = () => {
        localStorage.removeItem("usuario");
        window.location.href = "/";
    };

    // Função clique no menu
    const handleMenuClick = (itemId) => {
        setActiveItem(itemId);
        setShowInitialContent(false);
    };

    const handleMenuDoubleClick = (itemId) => {
        if (activeItem === itemId) {
            setActiveItem(null);
            setShowInitialContent(true);
        }
    };    // Componente placeholder para cada item do menu
    const menuComponents = {
        dashboard: () => <div><Dashboard /></div>,
        eventos: () => <div>
            <Eventos />
        </div>,
        equipes: () => <div><Equipes /></div>,
        inscricao: () => <div><h2>Inscrições</h2><p>Conteúdo de Inscrições.</p></div>,
    };

    const ActiveComponent = activeItem ? menuComponents[activeItem] : null;

    return (
        <main style={{ display: "flex", minHeight: "100vh" }}>
            <Sidebar
                usuario={usuario}
                onLogout={handleLogout}
                onMenuClick={handleMenuClick}
                onMenuDoubleClick={handleMenuDoubleClick}
                activeItem={activeItem}
            />
            <section style={{ flex: 1, padding: "2rem" }}>
                <div className="section-container" style={{ background: "#fff", borderRadius: "8px", boxShadow: "0 2px 8px #0001", padding: "2rem", minHeight: "80vh" }}>
                    {showInitialContent ? (
                        <>
                            <div className="section-header" style={{ borderBottom: "1px solid #eee", marginBottom: "1.5rem", paddingBottom: "1rem" }}>
                                <h2 style={{ margin: 0 }}>Inicio</h2>
                                <div style={{ marginTop: "0.5rem", color: "#555" }}>
                                    Seja bem-vindo de volta, <b>{usuario.nome}</b>
                                </div>
                            </div>
                            <div className="section-body">
                                <p>Esta é sua área inicial. Aqui você pode acessar rapidamente os principais recursos do sistema.</p>
                            </div>
                        </>
                    ) : (
                        ActiveComponent ? <ActiveComponent /> : (
                            <div style={{ textAlign: "center", color: "#888", marginTop: "3rem" }}>
                                <p>Selecione um item do menu para ver o conteúdo.</p>
                            </div>
                        )
                    )}
                </div>
            </section>
        </main>
    );
};