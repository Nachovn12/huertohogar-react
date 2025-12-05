import React from 'react';

interface SkeletonProps {
    width?: string;
    height?: string;
    borderRadius?: string;
    className?: string;
    style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
    width = '100%', 
    height = '20px', 
    borderRadius = '8px',
    className = '',
    style = {}
}) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{
                width,
                height,
                borderRadius,
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s ease-in-out infinite',
                ...style
            }}
        />
    );
};

// Skeleton para tarjetas de KPI
export const SkeletonKPI: React.FC = () => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Skeleton width="48px" height="48px" borderRadius="12px" />
            <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="14px" />
                <Skeleton width="40%" height="12px" style={{ marginTop: '6px' }} />
            </div>
        </div>
        <Skeleton width="50%" height="32px" style={{ marginBottom: '8px' }} />
        <Skeleton width="70%" height="14px" />
    </div>
);

// Skeleton para tabla
export const SkeletonTable: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb'
    }}>
        <Skeleton width="30%" height="24px" style={{ marginBottom: '20px' }} />
        {Array.from({ length: rows }).map((_, i) => (
            <div key={i} style={{ 
                display: 'flex', 
                gap: '12px', 
                marginBottom: '12px',
                paddingBottom: '12px',
                borderBottom: i < rows - 1 ? '1px solid #f3f4f6' : 'none'
            }}>
                <Skeleton width="20%" height="16px" />
                <Skeleton width="30%" height="16px" />
                <Skeleton width="15%" height="16px" />
                <Skeleton width="20%" height="16px" />
                <Skeleton width="15%" height="16px" />
            </div>
        ))}
    </div>
);

// Skeleton para widget
export const SkeletonWidget: React.FC = () => (
    <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        border: '1px solid #e5e7eb'
    }}>
        <Skeleton width="40%" height="20px" style={{ marginBottom: '20px' }} />
        {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <Skeleton width="40px" height="40px" borderRadius="10px" />
                    <div style={{ flex: 1 }}>
                        <Skeleton width="80%" height="14px" />
                        <Skeleton width="50%" height="12px" style={{ marginTop: '4px' }} />
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// CSS para la animación (agregar al archivo CSS global)
export const skeletonStyles = `
@keyframes loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.skeleton {
    display: inline-block;
}
`;

export default Skeleton;
