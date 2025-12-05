import React from 'react';
import '../styles/TrustBadges.css';

const TrustBadges: React.FC = () => {
  const badges = [
    {
      icon: 'fa-shield-alt',
      title: 'Compra Segura',
      description: 'Protección SSL 256-bit'
    },
    {
      icon: 'fa-truck',
      title: 'Envío Gratis',
      description: 'En compras sobre $30.000'
    },
    {
      icon: 'fa-leaf',
      title: '100% Orgánico',
      description: 'Productos certificados'
    },
    {
      icon: 'fa-undo',
      title: 'Devolución Fácil',
      description: 'Garantía de satisfacción'
    },
    {
      icon: 'fa-headset',
      title: 'Soporte 24/7',
      description: 'Estamos para ayudarte'
    },
    {
      icon: 'fa-award',
      title: 'Calidad Premium',
      description: 'Productos seleccionados'
    }
  ];

  return (
    <div className="trust-badges-container">
      <div className="trust-badges">
        {badges.map((badge, index) => (
          <div key={index} className="trust-badge" data-aos="fade-up" data-aos-delay={index * 100}>
            <div className="badge-icon">
              <i className={`fas ${badge.icon}`}></i>
            </div>
            <div className="badge-content">
              <h4>{badge.title}</h4>
              <p>{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBadges;
