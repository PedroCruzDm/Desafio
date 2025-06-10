import { useEffect, useState } from "react";
import Eventos from "../components/Eventos/Eventos.jsx"
import Dashboard from "../components/Dashboard/Dashboard.jsx"
import Equipes from "../components/Equipes/Equipes.jsx"
import Inscricoes from "../components/Inscricoes/Inscricoes.jsx"
import Configuracoes from "../components/Configuracoes/Configuracoes.jsx";
import "./styles/menu.scss";

const UserProfile = ({ usuario }) => (
    <div className="sidebar__user-profile">
        <div className="sidebar__user-profile-avatar">
            <img src={usuario.fotoPerfil || "https://via.placeholder.com/40"} alt="Foto de Perfil" />
        </div>
        <div className="sidebar__user-profile-info">
            <div className="name">{usuario.nome}</div>
            <div className="role">
                {usuario.admin ? "Administrador" : "Usuário"}
            </div>
        </div>
    </div>
);

// Componente Sidebar
const Sidebar = ({ usuario, onLogout, onMenuClick, onMenuDoubleClick, activeItem }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar__brand">
                <h2>EventManager</h2>
                <span>Sistema de Gerenciamento de Eventos</span>
            </div>
            
            <nav className="sidebar__menu">
                <h4>Menu Principal</h4>
                <ul>
                    {menuItems.map(item => (
                        <li 
                            key={item.id} 
                            className={activeItem === item.id ? "active" : ""}
                        >
                            <a 
                                href="#" 
                                className={activeItem === item.id ? "active" : ""}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onMenuClick(item.id);
                                }}
                                onDoubleClick={(e) => {
                                    e.preventDefault();
                                    onMenuDoubleClick(item.id);
                                }}
                            >
                                {item.icon}
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            
            <div className="sidebar__footer">
                <UserProfile usuario={usuario} />
                  <div className="sidebar__actions">
                    <button className="logout-btn" onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        Sair
                    </button>
                </div>
            </div>
        </aside>
    );
};

const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
      </svg> },
    { id: "eventos", label: "Eventos", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm-5 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5v-1z"/>
        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/>
      </svg> },
    { id: "equipes", label: "Equipes", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
      </svg> },
    { id: "inscricao", label: "Inscrições", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
      </svg> },
    { id: "configuracoes", label: "Configurações", icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/>
        <path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.893 3.434-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.893-1.64-.902-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319zm-2.633.283c.246-.835 1.428-.835 1.674 0l.094.319a1.873 1.873 0 0 0 2.693 1.115l.291-.16c.764-.415 1.6.42 1.184 1.185l-.159.292a1.873 1.873 0 0 0 1.116 2.692l.318.094c.835.246.835 1.428 0 1.674l-.319.094a1.873 1.873 0 0 0-1.115 2.693l.16.291c.415.764-.42 1.6-1.185 1.184l-.291-.159a1.873 1.873 0 0 0-2.693 1.116l-.094.318c-.246.835-1.428.835-1.674 0l-.094-.319a1.873 1.873 0 0 0-2.692-1.115l-.292.16c-.764.415-1.6-.42-1.184-1.185l.159-.291A1.873 1.873 0 0 0 1.945 8.93l-.319-.094c-.835-.246-.835-1.428 0-1.674l.319-.094A1.873 1.873 0 0 0 3.06 4.377l-.16-.292c-.415-.764.42-1.6 1.185-1.184l.292.159a1.873 1.873 0 0 0 2.692-1.115l.094-.319z"/>
      </svg> },
];

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
    };// Componente placeholder para cada item do menu
    const menuComponents = {
        dashboard: () => <Dashboard />,
        eventos: () => <Eventos />,
        equipes: () => <Equipes />,
        inscricao: () => <Inscricoes />,
        configuracoes: () => <Configuracoes />
    };

    const ActiveComponent = activeItem ? menuComponents[activeItem] : null;    return (
        <main className="menu-container">
            <Sidebar
                usuario={usuario}
                onLogout={handleLogout}
                onMenuClick={handleMenuClick}
                onMenuDoubleClick={handleMenuDoubleClick}
                activeItem={activeItem}
            />            <section className="content-section">
                <div className="content-section__container">
                    {showInitialContent ? (
                        <>
                            <div className="home-welcome">
                                <h1>Início</h1>
                                <p>Seja bem-vindo de volta, <b>{usuario.nome}</b>. Esta é sua área inicial, onde você pode acessar rapidamente os principais recursos do sistema.</p>
                            </div>
                            
                            <div className="features-grid">
                                <div className="feature-card" onClick={() => handleMenuClick("eventos")}>
                                    <div className="feature-card__icon">📅</div>
                                    <h3>Eventos</h3>
                                    <p>Gerencie seus eventos, crie novos e acompanhe as inscrições.</p>
                                </div>
                                
                                <div className="feature-card" onClick={() => handleMenuClick("equipes")}>
                                    <div className="feature-card__icon">👥</div>
                                    <h3>Equipes</h3>
                                    <p>Organize e gerencie equipes para seus eventos e atividades.</p>
                                </div>
                                  <div className="feature-card" onClick={() => handleMenuClick("inscricao")}>
                                    <div className="feature-card__icon">✅</div>
                                    <h3>Inscrições</h3>
                                    <p>Veja suas inscrições atuais e gerencie participações.</p>
                                </div>
                                
                                <div className="feature-card" onClick={() => handleMenuClick("dashboard")}>
                                    <div className="feature-card__icon">📊</div>
                                    <h3>Dashboard</h3>
                                    <p>Visualize estatísticas e informações importantes do sistema.</p>
                                </div>
                            </div>
                        </>
                    ) : (
                        ActiveComponent && <ActiveComponent />                    )}
                </div>
            </section>
        </main>
    );
};