import type { FC } from 'react';
import React from 'react';
import { Box, Container, Typography, TextField, Button, InputAdornment } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';

const HomeNewsletter: FC = () => {
  return (
    <Box sx={{ bgcolor: '#ffffff', py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Box
          sx={{
            bgcolor: '#f0fdf4',
            borderRadius: 4,
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            border: '1px solid #bbf7d0'
          }}
        >
          {/* Elementos decorativos */}
          <Box
            sx={{
              position: 'absolute',
              top: -50,
              left: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(74, 222, 128, 0.1)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(74, 222, 128, 0.1)'
            }}
          />

          <Box sx={{ position: 'relative', zIndex: 1 }}>
            {/* Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                bgcolor: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                boxShadow: '0 8px 24px rgba(22, 163, 74, 0.3)'
              }}
            >
              <EmailIcon sx={{ fontSize: 40, color: '#fff' }} />
            </Box>

            {/* Title */}
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                color: '#1e293b',
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.5rem' }
              }}
            >
              Recibe Ofertas Exclusivas en tu Correo
            </Typography>

            {/* Description */}
            <Typography
              sx={{
                color: '#64748b',
                mb: 1,
                fontSize: '1.05rem',
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              Únete a nuestra comunidad y recibe las mejores ofertas, recetas deliciosas y tips de alimentación saludable directamente en tu email
            </Typography>

            {/* Offer Badge */}
            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                bgcolor: '#fef3c7',
                color: '#92400e',
                px: 3,
                py: 1,
                borderRadius: 50,
                mb: 4,
                border: '1px solid #fde68a'
              }}
            >
              <LocalOfferOutlinedIcon sx={{ fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                10% de descuento en tu primera compra
              </Typography>
            </Box>

            {/* Form */}
            <Box
              component="form"
              noValidate
              autoComplete="off"
              sx={{
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'white',
                borderRadius: 50,
                p: 0.5,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                maxWidth: 500,
                mx: 'auto',
                border: '1px solid #e2e8f0',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: '0 8px 30px rgba(22, 163, 74, 0.15)',
                  borderColor: '#4ade80',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <InputAdornment position="start" sx={{ pl: 2.5, color: '#94a3b8' }}>
                <EmailIcon />
              </InputAdornment>
              <TextField
                fullWidth
                placeholder="tu@email.com"
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: { px: 1.5, py: 1.5 }
                }}
                sx={{ flex: 1 }}
              />
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#16a34a',
                  color: 'white',
                  borderRadius: 50,
                  px: 4,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 700,
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#15803d',
                    boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
                  }
                }}
              >
                Suscribirme
              </Button>
            </Box>

            {/* Privacy note */}
            <Typography
              sx={{
                color: '#94a3b8',
                fontSize: '0.75rem',
                mt: 2,
                fontFamily: 'Montserrat, Arial, sans-serif'
              }}
            >
              🔒 Tus datos están seguros. No compartimos tu información con terceros.
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeNewsletter;
