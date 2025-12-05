import type { FC } from 'react';
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';
import NatureIcon from '@mui/icons-material/Nature';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';

interface Benefit {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const benefits: Benefit[] = [
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Envío Rápido',
    description: 'Entrega en 24-48 horas a todo Chile. Seguimiento en tiempo real de tu pedido.',
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Calidad Garantizada',
    description: 'Productos 100% orgánicos certificados. Devolución gratuita si no estás satisfecho.',
    color: '#16a34a',
    bgColor: '#dcfce7'
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Soporte 24/7',
    description: 'Nuestro equipo está disponible para ayudarte en cualquier momento del día.',
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  },
  {
    icon: <NatureIcon sx={{ fontSize: 48 }} />,
    title: 'Sostenibilidad',
    description: 'Apoyamos a agricultores locales y promovemos prácticas ecológicas responsables.',
    color: '#059669',
    bgColor: '#d1fae5'
  },
  {
    icon: <AttachMoneyOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Mejores Precios',
    description: 'Directo del productor a tu mesa. Sin intermediarios, precios justos para todos.',
    color: '#f59e0b',
    bgColor: '#fef3c7'
  },
  {
    icon: <FavoriteOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Frescura Máxima',
    description: 'Cosechamos y empacamos el mismo día de tu pedido para máxima frescura.',
    color: '#ef4444',
    bgColor: '#fee2e2'
  }
];

const WhyChooseUs: FC = () => {
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
              bgcolor: 'rgba(22, 163, 74, 0.1)',
              border: '1px solid rgba(22, 163, 74, 0.2)'
            }}
          >
            <Typography sx={{ fontSize: '1.2rem' }}>✨</Typography>
            <Typography
              sx={{
                color: '#16a34a',
                fontWeight: 700,
                fontSize: '0.85rem',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Nuestros Beneficios
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
            ¿Por Qué Elegirnos?
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
            Nos comprometemos a brindarte la mejor experiencia de compra con productos de calidad superior y un servicio excepcional
          </Typography>
        </Box>

        {/* Benefits Grid */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 4 }}>
          {benefits.map((benefit, index) => (
            <Box key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  borderRadius: 4,
                  border: '1px solid #e2e8f0',
                  bgcolor: '#ffffff',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    bgcolor: benefit.color,
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease'
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: benefit.color,
                    '&::before': {
                      transform: 'scaleX(1)'
                    },
                    '& .benefit-icon': {
                      transform: 'scale(1.1) rotate(5deg)',
                      bgcolor: benefit.color,
                      color: '#fff'
                    }
                  }
                }}
              >
                {/* Icon */}
                <Box
                  className="benefit-icon"
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 3,
                    bgcolor: benefit.bgColor,
                    color: benefit.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    transition: 'all 0.3s ease'
                  }}
                >
                  {benefit.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 700,
                    color: '#1e293b',
                    mb: 1.5,
                    fontSize: '1.25rem'
                  }}
                >
                  {benefit.title}
                </Typography>

                {/* Description */}
                <Typography
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.7,
                    fontSize: '0.95rem',
                    fontFamily: 'Montserrat, Arial, sans-serif'
                  }}
                >
                  {benefit.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default WhyChooseUs;
