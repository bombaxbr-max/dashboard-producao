import React, { useEffect, useRef } from 'react';

const ProductionTable = ({ data }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let scrollSpeed = 0.5; // pixels per frame
        let animationId;

        const scroll = () => {
            scrollContainer.scrollTop += scrollSpeed;

            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
                setTimeout(() => {
                    if (scrollContainer) scrollContainer.scrollTop = 0;
                }, 3000);
            }

            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationId);
    }, [data]);

    return (
        <div className="table-container">
            <div className="table-wrapper" ref={scrollRef}>
                <table>
                    <thead>
                        <tr>
                            <th>Praça / Empresa</th>
                            <th>HC</th>
                            <th>P.U</th>
                            <th>Altas</th>
                            <th>Inic.</th>
                            <th>N. Inic.</th>
                            <th>Impr.</th>
                            <th>Serviço</th>
                            <th>B2B</th>
                            <th>LIS</th>
                            <th>Meta</th>
                            <th>GAP</th>
                            <th>Proj. P.U</th>
                            <th>Eficácia</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => {
                            const label = row["PORTO ALEGRE"];
                            if (label === "EMPRESA" || label === "ALTAS") return null;

                            const isHeader = !row["col_2"] && label && label !== "TOTAL";
                            const isTotal = label === "TOTAL" || label === "RS CAPITAL";

                            return (
                                <tr key={idx} className={`${isTotal ? 'total-row' : ''}`}
                                    style={isHeader ? { background: '#1e293b', fontWeight: 'bold', color: '#3b82f6' } : {}}>
                                    <td><strong>{label}</strong></td>
                                    <td>{row["col_2"] ?? '-'}</td>
                                    <td>{typeof row["col_3"] === 'number' ? row["col_3"].toFixed(2) : (row["col_3"] || '-')}</td>
                                    <td>{row["ALTAS"] ?? 0}</td>
                                    <td>{row["col_5"] ?? 0}</td>
                                    <td>{row["col_6"] ?? 0}</td>
                                    <td>{row["col_7"] ?? 0}</td>
                                    <td>{row["SERVIO"] || row["SERVIO"] || row["SERVIÇO"] || 0}</td>
                                    <td>{row["B2B"] ?? 0}</td>
                                    <td>{row["LIS"] ?? 0}</td>
                                    <td>{typeof row["col_25"] === 'number' ? row["col_25"].toFixed(0) : (row["col_25"] || 0)}</td>
                                    <td className={row["col_24"] < 0 ? 'value-neg' : 'value-pos'}>
                                        {typeof row["col_24"] === 'number' ? row["col_24"].toFixed(1) : (row["col_24"] || 0)}
                                    </td>
                                    <td>{typeof row["col_27"] === 'number' ? row["col_27"].toFixed(2) : (row["col_27"] || 0)}</td>
                                    <td style={{ color: row["col_28"] < 0.6 ? 'var(--danger)' : 'var(--success)' }}>
                                        {typeof row["col_28"] === 'number' ? (row["col_28"] * 100).toFixed(1) + '%' : (row["col_28"] || '0%')}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionTable;
