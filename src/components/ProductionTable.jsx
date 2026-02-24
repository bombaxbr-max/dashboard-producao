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

            // If reached bottom, jump back to top (seamless loop simulation)
            if (scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
                setTimeout(() => {
                    scrollContainer.scrollTop = 0;
                }, 2000); // Pause at bottom before reset
            }

            animationId = requestAnimationFrame(scroll);
        };

        animationId = requestAnimationFrame(scroll);

        return () => cancelAnimationFrame(animationId);
    }, [data]);

    // Calculate totals
    const totals = data.reduce((acc, curr) => ({
        hc: acc.hc + curr.hc,
        pu: acc.pu + curr.pu,
        altas: acc.altas + curr.altasConcluidas,
        iniciadas: acc.iniciadas + curr.iniciadas,
        naoIniciadas: acc.naoIniciadas + curr.naoIniciadas,
        improdutivas: acc.improdutivas + curr.improdutivas,
        servico: acc.servico + curr.servico,
        b2b: acc.b2b + curr.b2b,
        lis: acc.lis + curr.lis,
        meta: acc.meta + curr.meta,
        gap: acc.gap + curr.gap,
        projecao: acc.projecao + curr.projecaoPu,
    }), { hc: 0, pu: 0, altas: 0, iniciadas: 0, naoIniciadas: 0, improdutivas: 0, servico: 0, b2b: 0, lis: 0, meta: 0, gap: 0, projecao: 0 });

    const totalEficiencia = (totals.altas / totals.meta * 100).toFixed(1);

    return (
        <div className="table-container">
            <div className="table-wrapper" ref={scrollRef}>
                <table>
                    <thead>
                        <tr>
                            <th>Empresa</th>
                            <th>HC</th>
                            <th>P.U</th>
                            <th>Altas</th>
                            <th>Iniciadas</th>
                            <th>N. Iniciadas</th>
                            <th>Improd.</th>
                            <th>Serviço</th>
                            <th>B2B</th>
                            <th>LIS</th>
                            <th>Meta</th>
                            <th>GAP</th>
                            <th>Proj. P.U</th>
                            <th>Eficiência</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, idx) => (
                            <tr key={idx}>
                                <td><strong>{row.empresa}</strong></td>
                                <td>{row.hc}</td>
                                <td>{row.pu}</td>
                                <td>{row.altasConcluidas}</td>
                                <td>{row.iniciadas}</td>
                                <td>{row.naoIniciadas}</td>
                                <td>{row.improdutivas}</td>
                                <td>{row.servico}</td>
                                <td>{row.b2b}</td>
                                <td>{row.lis}</td>
                                <td>{row.meta}</td>
                                <td className={row.gap >= 0 ? 'value-pos' : 'value-neg'}>
                                    {row.gap}
                                </td>
                                <td>{row.projecaoPu}</td>
                                <td style={{ color: row.eficiencia < 80 ? 'var(--danger)' : 'var(--success)' }}>
                                    {row.eficiencia}%
                                </td>
                            </tr>
                        ))}
                        <tr className="total-row">
                            <td>TOTAL GERAL</td>
                            <td>{totals.hc}</td>
                            <td>{totals.pu}</td>
                            <td>{totals.altas}</td>
                            <td>{totals.iniciadas}</td>
                            <td>{totals.naoIniciadas}</td>
                            <td>{totals.improdutivas}</td>
                            <td>{totals.servico}</td>
                            <td>{totals.b2b}</td>
                            <td>{totals.lis}</td>
                            <td>{totals.meta}</td>
                            <td className={totals.gap >= 0 ? 'value-pos' : 'value-neg'}>{totals.gap}</td>
                            <td>{totals.projecao}</td>
                            <td>{totalEficiencia}%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductionTable;
