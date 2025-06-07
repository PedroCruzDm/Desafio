import react from "react";
import './styles/home.scss';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
    const navigate = useNavigate();

    return(
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" }}>
            <h1>Bem-vindo ao Portal de Trabalho</h1>
            <p>Trabalhe em equipe ou individualmente de forma eficiente.</p>
            <div style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}>
                <button onClick={() => navigate("/cadastro")}>Cadastro</button>
                <button onClick={() => navigate("/login")}>Login</button>
            </div>
        </div>
    )
}