import React from "react";
import './styles/home.scss';
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <h1>Bem-vindo ao Portal de Trabalho</h1>
            <p>Trabalhe em equipe ou individualmente de forma eficiente.</p>
            <div className="home-buttons">
                <button onClick={() => navigate("/cadastro")}>Cadastro</button>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
    );
}
