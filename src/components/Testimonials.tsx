import type { FC } from 'react';
import React, { useState, useEffect, useRef } from 'react';
import { Box, Container, Typography, Card, Avatar, Rating } from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  date: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'María González',
    location: 'Santiago, Chile',
    rating: 5,
    comment: 'Los productos son increíblemente frescos y de excelente calidad. El servicio de entrega es rápido y confiable. ¡Totalmente recomendado!',
    avatar: 'https://i.pravatar.cc/150?img=1',
    date: 'Hace 2 días'
  },
  {
    id: 2,
    name: 'Carlos Ruiz',
    location: 'Valparaíso, Chile',
    rating: 5,
    comment: 'Llevo 6 meses comprando aquí y nunca me han decepcionado. Los tomates y lechugas son los más frescos que he probado.',
    avatar: 'https://i.pravatar.cc/150?img=12',
    date: 'Hace 1 semana'
  },
  {
    id: 3,
    name: 'Ana Silva',
    location: 'Concepción, Chile',
    rating: 5,
    comment: 'Me encanta poder apoyar a agricultores locales mientras recibo productos orgánicos de primera calidad. El precio es justo y la atención al cliente es excepcional.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    date: 'Hace 3 días'
  },
  {
    id: 4,
    name: 'Pedro Morales',
    location: 'La Serena, Chile',
    rating: 4,
    comment: 'Excelente variedad de productos. La app es fácil de usar y el proceso de compra es muy simple. Solo mejoraría los tiempos de entrega en zonas rurales.',
    avatar: 'https://i.pravatar.cc/150?img=8',
    date: 'Hace 5 días'
  }
];

// Hook para animar números
const useCountUp = (end: number, duration: number = 2000, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldStart) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function para suavizar
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);

  return count;
};

const Testimonials: FC = () => {
  const [isStatsVisible, setIsStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Contador animado
  const ratingCount = useCountUp(48, 2000, isStatsVisible); // Cuenta hasta 48 para luego dividir por 10
  const clientsCount = useCountUp(12000, 2500, isStatsVisible);
  const percentCount = useCountUp(98, 2000, isStatsVisible);

  // Intersection Observer para activar animación cuando sea visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isStatsVisible) {
          setIsStatsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => {
      if (statsRef.current) {
        observer.unobserve(statsRef.current);
      }
    };
  }, [isStatsVisible]);

  return (
    <Box sx={{ bgcolor: '#f8fafc', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
              mb: 2,
              px: 3,
              py: 1,
              borderRadius: 8,
              bgcolor: 'rgba(251, 191, 36, 0.1)',
              border: '1px solid rgba(251, 191, 36, 0.2)'
            }}
          >
            <Typography sx={{ fontSize: '1.2rem' }}>💬</Typography>
            <Typography
              sx={{
                color: '#d97706',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Testimonios
            </Typography>
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1e293b',
              mb: 2,
              fontFamily: 'Playfair Display, serif',
              letterSpacing: '-1px',
              fontSize: { xs: '2rem', md: '2.8rem' }
            }}
          >
            Lo Que Dicen Nuestros Clientes
          </Typography>
          <Typography
            sx={{
              color: '#64748b',
              fontSize: { xs: '0.95rem', md: '1.05rem' },
              maxWidth: 650,
              mx: 'auto',
              fontFamily: 'Montserrat, Arial, sans-serif',
              lineHeight: 1.7
            }}
          >
            Miles de familias chilenas confían en nosotros para llevar productos frescos y saludables a sus hogares
          </Typography>
        </Box>

        {/* Testimonials Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              elevation={0}
              sx={{
                p: 4,
                borderRadius: 4,
                border: '1px solid #e2e8f0',
                bgcolor: '#ffffff',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  borderColor: '#16a34a'
                }
              }}
            >
              {/* Quote Icon */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: '#16a34a',
                  opacity: 0.1
                }}
              >
                <FormatQuoteIcon sx={{ fontSize: 60 }} />
              </Box>

              {/* Rating */}
              <Box sx={{ mb: 2 }}>
                <Rating 
                  value={testimonial.rating} 
                  readOnly 
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#fbbf24' },
                    '& .MuiRating-iconEmpty': { color: '#e5e7eb' }
                  }}
                />
              </Box>

              {/* Comment */}
              <Typography
                sx={{
                  color: '#475569',
                  fontSize: '1rem',
                  lineHeight: 1.7,
                  mb: 3,
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  fontStyle: 'italic'
                }}
              >
                "{testimonial.comment}"
              </Typography>

              {/* Author */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  sx={{
                    width: 50,
                    height: 50,
                    border: '3px solid #f0fdf4'
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: '#1e293b',
                      fontSize: '1rem',
                      fontFamily: 'Montserrat, Arial, sans-serif'
                    }}
                  >
                    {testimonial.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography
                      sx={{
                        color: '#64748b',
                        fontSize: '0.85rem'
                      }}
                    >
                      {testimonial.location}
                    </Typography>
                    <Typography sx={{ color: '#cbd5e1' }}>•</Typography>
                    <Typography
                      sx={{
                        color: '#94a3b8',
                        fontSize: '0.8rem'
                      }}
                    >
                      {testimonial.date}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Card>
          ))}
        </Box>

        {/* Stats con animaciones */}
        <Box
          ref={statsRef}
          sx={{
            mt: 8,
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 4,
            textAlign: 'center'
          }}
        >
          {/* Stat 1 - Rating */}
          <Box
            sx={{
              animation: isStatsVisible ? 'fadeInUp 0.8s ease-out' : 'none',
              animationDelay: '0s',
              opacity: isStatsVisible ? 1 : 0
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 900,
                color: '#16a34a',
                fontFamily: 'Montserrat, Arial, sans-serif',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {(ratingCount / 10).toFixed(1)}
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 1 }}>
              Calificación Promedio
            </Typography>
            <Rating value={4.8} readOnly precision={0.1} size="small" sx={{ mt: 1 }} />
          </Box>

          {/* Stat 2 - Clients */}
          <Box
            sx={{
              animation: isStatsVisible ? 'fadeInUp 0.8s ease-out' : 'none',
              animationDelay: '0.2s',
              opacity: isStatsVisible ? 1 : 0
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 900,
                color: '#16a34a',
                fontFamily: 'Montserrat, Arial, sans-serif',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {clientsCount.toLocaleString()}+
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 1 }}>
              Clientes Satisfechos
            </Typography>
          </Box>

          {/* Stat 3 - Percentage */}
          <Box
            sx={{
              animation: isStatsVisible ? 'fadeInUp 0.8s ease-out' : 'none',
              animationDelay: '0.4s',
              opacity: isStatsVisible ? 1 : 0
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: '2.5rem', md: '3rem' },
                fontWeight: 900,
                color: '#16a34a',
                fontFamily: 'Montserrat, Arial, sans-serif',
                lineHeight: 1,
                background: 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {percentCount}%
            </Typography>
            <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 1 }}>
              Recomendarían HuertoHogar
            </Typography>
          </Box>
        </Box>

        {/* Animaciones CSS */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </Container>
    </Box>
  );
};

export default Testimonials;
