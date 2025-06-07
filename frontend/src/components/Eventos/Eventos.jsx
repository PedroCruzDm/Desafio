const Eventos = () => (
    <div>
        <h2>Eventos</h2>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1.5rem" }}>
            <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #eee", padding: "0.75rem", textAlign: "left" }}>Nome</th>
                    <th style={{ borderBottom: "1px solid #eee", padding: "0.75rem", textAlign: "left" }}>Nº Total de Equipe</th>
                    <th style={{ borderBottom: "1px solid #eee", padding: "0.75rem", textAlign: "left" }}>Status</th>
                    <th style={{ borderBottom: "1px solid #eee", padding: "0.75rem", textAlign: "left" }}>Data</th>
                    <th style={{ borderBottom: "1px solid #eee", padding: "0.75rem", textAlign: "center" }}></th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td colSpan={5} style={{ textAlign: "center", color: "#888", padding: "2rem" }}>
                        Nenhum evento encontrado.
                    </td>
                </tr>
                {/* Exemplo de linha de evento:
                <tr>
                    <td>Evento Exemplo</td>
                    <td>5</td>
                    <td>Ativo</td>
                    <td>2024-06-01</td>
                    <td style={{ textAlign: "center" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer" }}>
                            <FaEllipsisV />
                        </button>
                    </td>
                </tr>
                */}
            </tbody>
        </table>
    </div>
);

export default Eventos;