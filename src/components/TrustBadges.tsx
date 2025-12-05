import type { FC } from 'react';
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import NatureIcon from '@mui/icons-material/Nature';
import SupportAgentOutlinedIcon from '@mui/icons-material/SupportAgentOutlined';

interface Badge {
  icon: React.ReactElement;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

const badges: Badge[] = [
  {
    icon: <LocalShippingOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Envío Gratis',
    description: 'En compras sobre $30.000',
    color: '#3b82f6',
    bgColor: '#dbeafe'
  },
  {
    icon: <VerifiedUserOutlinedIcon sx={{ fontSize: 48 }} />,
    title: '100% Garantizado',
    description: 'Devolución si no estás satisfecho',
    color: '#16a34a',
    bgColor: '#dcfce7'
  },
  {
    icon: <NatureIcon sx={{ fontSize: 48 }} />,
    title: 'Productos Orgánicos',
    description: 'Certificados y sostenibles',
    color: '#059669',
    bgColor: '#d1fae5'
  },
  {
    icon: <SupportAgentOutlinedIcon sx={{ fontSize: 48 }} />,
    title: 'Soporte 24/7',
    description: 'Estamos para ayudarte',
    color: '#8b5cf6',
    bgColor: '#ede9fe'
  }
];

const TrustBadges: FC = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
          {badges.map((badge, index) => (
            <Paper
              key={index}
              elevation={0}
              sx={{
                p: 4,
                textAlign: 'center',
                borderRadius: 4,
                border: '2px solid #f1f5f9',
                bgcolor: '#fafafa',
                transition: 'all 0.3s ease',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  bgcolor: badge.color,
                  transform: 'scaleX(0)',
                  transformOrigin: 'left',
                  transition: 'transform 0.3s ease'
                },
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.1)',
                  bgcolor: '#ffffff',
                  borderColor: badge.color,
                  '&::before': {
                    transform: 'scaleX(1)'
                  },
                  '& .badge-icon-wrapper': {
                    bgcolor: badge.color,
                    '& svg': {
                      color: '#fff'
                    }
                  }
                }
              }}
            >
              <Box
                className="badge-icon-wrapper"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  bgcolor: badge.bgColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2.5,
                  transition: 'all 0.3s ease',
                  '& svg': {
                    color: badge.color,
                    transition: 'color 0.3s ease'
                  }
                }}
              >
                {badge.icon}
              </Box>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: '#1e293b',
                  mb: 1,
                  fontFamily: 'Montserrat, Arial, sans-serif'
                }}
              >
                {badge.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: '0.9rem',
                  color: '#64748b',
                  fontFamily: 'Montserrat, Arial, sans-serif',
                  lineHeight: 1.5
                }}
              >
                {badge.description}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default TrustBadges;
