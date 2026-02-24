import React from 'react';
import * as Icons from 'lucide-react';

const KpiCard = ({ label, value, trend, direction, status, icon }) => {
    const IconComponent = Icons[icon] || Icons.Activity;

    return (
        <div className={`kpi-card ${status}`}>
            <div className="kpi-header">
                <span className="kpi-label">{label}</span>
            </div>
            <div className="kpi-value">{value}</div>
            <div className="kpi-footer">
                <span className={`kpi-trend ${direction === 'up' ? 'trend-up' : 'trend-down'}`}>
                    {direction === 'up' ? <Icons.ArrowUpRight size={16} /> : <Icons.ArrowDownRight size={16} />}
                    {trend}
                </span>
                <IconComponent className="kpi-icon" size={20} style={{ opacity: 0.2, position: 'absolute', right: '1rem', bottom: '1rem' }} />
            </div>
        </div>
    );
};

export default KpiCard;
