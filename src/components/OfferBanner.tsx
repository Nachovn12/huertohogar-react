import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/OfferBanner.css';

const OfferBanner: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navigate = useNavigate();

  // Calcular tiempo restante hasta medianoche
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const difference = midnight.getTime() - now.getTime();
      
      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Control de scroll profesional - Hide on scroll down
  useEffect(() => {
    const controlBanner = () => {
      const currentScrollY = window.scrollY;
      
      // Si está en el top, siempre mostrar
      if (currentScrollY < 10) {
        setIsVisible(true);
      }
      // Si hace scroll hacia abajo, ocultar
      else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      // Si hace scroll hacia arriba, mostrar
      else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlBanner);
    
    return () => {
      window.removeEventListener('scroll', controlBanner);
    };
  }, [lastScrollY]);

  const handleClick = () => {
    navigate('/ofertas');
  };

  return (
    <div className={`offer-banner ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="offer-banner-content">
        <div className="offer-icon">
          <i className="fas fa-bolt"></i>
        </div>
        
        <div className="offer-text">
          <span className="offer-label">¡OFERTA FLASH!</span>
          <span className="offer-message">
            Hasta <strong>30% OFF</strong> en productos seleccionados
          </span>
        </div>

        <div className="offer-timer">
          <div className="timer-unit">
            <span className="timer-value">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="timer-label">Horas</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="timer-label">Min</span>
          </div>
          <span className="timer-separator">:</span>
          <div className="timer-unit">
            <span className="timer-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="timer-label">Seg</span>
          </div>
        </div>

        <button className="offer-cta" onClick={handleClick}>
          Ver Ofertas
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};

export default OfferBanner;
