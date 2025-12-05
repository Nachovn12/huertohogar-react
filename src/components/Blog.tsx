import type { FC } from 'react';
import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  Chip, 
  Button, 
  TextField, 
  InputAdornment,
  useTheme,
  useMediaQuery
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

// --- Tipos ---
type Post = {
  id: number;
  title: string;
  date: string;
  readTime: string;
  author: string;
  excerpt: string;
  image: string;
  category: string;
  featured?: boolean;
};

// --- Datos ---
const blogPosts: Post[] = [
  {
    id: 1,
    title: "Ensalada de Verano con Ingredientes Frescos de Estación",
    date: "1 Nov, 2025",
    readTime: "5 min",
    author: "María González",
    excerpt: "Descubre cómo preparar una deliciosa y nutritiva ensalada utilizando exclusivamente los productos de nuestra última cosecha. Una explosión de sabor y salud en tu mesa.",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
    category: "Recetas",
    featured: true
  },
  {
    id: 2,
    title: "5 Pasos Sencillos para Empezar a Compostar",
    date: "28 Oct, 2025",
    readTime: "8 min",
    author: "Juan Pérez",
    excerpt: "Aprende a reducir tus residuos y a crear abono rico en nutrientes para tus plantas con esta guía práctica de compostaje para principiantes.",
    image: "https://images.unsplash.com/photo-1581578017093-cd30fce4eeb7?auto=format&fit=crop&w=800&q=80",
    category: "Sostenibilidad"
  },
  {
    id: 3,
    title: "Los Beneficios de la Miel Orgánica",
    date: "25 Oct, 2025",
    readTime: "4 min",
    author: "Ana Silva",
    excerpt: "Más allá de endulzar, la miel pura de abeja tiene propiedades increíbles para tu salud inmunológica y digestiva. Te contamos todo aquí.",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=800&q=80",
    category: "Salud"
  },
  {
    id: 4,
    title: "Guía para tu Primer Huerto Urbano en Balcón",
    date: "22 Oct, 2025",
    readTime: "10 min",
    author: "Carlos Ruiz",
    excerpt: "No necesitas un gran jardín. Te mostramos cómo cultivar tus propias hierbas aromáticas y vegetales en un espacio pequeño.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=800&q=80",
    category: "Guías"
  }
];

// --- Componentes ---

const HeroSection: FC = () => (
  <Box sx={{ 
    position: 'relative', 
    bgcolor: '#1e293b', 
    color: 'white', 
    py: { xs: 8, md: 12 }, 
    overflow: 'hidden',
    mb: 8
  }}>
    <Box sx={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundImage: 'url(https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      opacity: 0.2,
      zIndex: 0
    }} />
    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
      <Chip 
        label="Nuestro Blog" 
        sx={{ 
          bgcolor: 'rgba(74, 222, 128, 0.2)', 
          color: '#4ade80', 
          fontWeight: 700, 
          mb: 3,
          backdropFilter: 'blur(4px)',
          border: '1px solid rgba(74, 222, 128, 0.3)'
        }} 
      />
      <Typography variant="h1" sx={{ 
        fontFamily: 'Playfair Display, serif', 
        fontWeight: 800, 
        fontSize: { xs: '2.5rem', md: '4rem' },
        mb: 2,
        letterSpacing: '-1px'
      }}>
        Historias de <span style={{ color: '#4ade80', fontStyle: 'italic' }}>HuertoHogar</span>
      </Typography>
      <Typography variant="h6" sx={{ 
        color: '#94a3b8', 
        maxWidth: 700, 
        mx: 'auto', 
        fontWeight: 300,
        lineHeight: 1.8
      }}>
        Explora artículos sobre agricultura sostenible, recetas saludables y consejos para llevar una vida más natural y conectada con la tierra.
      </Typography>
    </Container>
  </Box>
);

const FeaturedPost: FC<{ post: Post }> = ({ post }) => (
  <Card sx={{ 
    display: 'flex', 
    flexDirection: { xs: 'column', md: 'row' }, 
    mb: 8, 
    borderRadius: 4, 
    overflow: 'hidden',
    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
    border: '1px solid #f1f5f9',
    transition: 'transform 0.3s ease',
    '&:hover': { transform: 'translateY(-4px)' }
  }}>
    <CardMedia
      component="img"
      sx={{ width: { xs: '100%', md: '55%' }, height: { xs: 300, md: 'auto' } }}
      image={post.image}
      alt={post.title}
    />
    <Box sx={{ display: 'flex', flexDirection: 'column', p: { xs: 3, md: 5 }, justifyContent: 'center' }}>
      <Box sx={{ mb: 2 }}>
        <Chip 
          label={post.category} 
          sx={{ 
            bgcolor: '#f0fdf4', 
            color: '#16a34a', 
            fontWeight: 700, 
            fontSize: '0.75rem',
            borderRadius: 1.5
          }} 
        />
      </Box>
      <Typography variant="h3" sx={{ 
        fontFamily: 'Playfair Display, serif', 
        fontWeight: 700, 
        fontSize: { xs: '1.75rem', md: '2.25rem' },
        mb: 2,
        color: '#1e293b',
        lineHeight: 1.2
      }}>
        {post.title}
      </Typography>
      <Typography variant="body1" sx={{ color: '#64748b', mb: 3, lineHeight: 1.7 }}>
        {post.excerpt}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, color: '#94a3b8', fontSize: '0.875rem', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <PersonOutlineIcon sx={{ fontSize: 18 }} /> {post.author}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <AccessTimeIcon sx={{ fontSize: 18 }} /> {post.readTime}
        </Box>
      </Box>
      <Button 
        variant="text" 
        endIcon={<ArrowForwardIcon />}
        sx={{ 
          alignSelf: 'flex-start', 
          color: '#16a34a', 
          fontWeight: 700,
          p: 0,
          '&:hover': { bgcolor: 'transparent', color: '#15803d' }
        }}
      >
        Leer Artículo Completo
      </Button>
    </Box>
  </Card>
);

const BlogPostCard: FC<{ post: Post }> = ({ post }) => (
  <Card sx={{ 
    height: '100%', 
    display: 'flex', 
    flexDirection: 'column',
    borderRadius: 4,
    border: '1px solid #f1f5f9',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      '& .MuiCardMedia-root': { transform: 'scale(1.05)' }
    }
  }}>
    <Box sx={{ overflow: 'hidden', height: 240, position: 'relative' }}>
      <CardMedia
        component="img"
        height="100%"
        image={post.image}
        alt={post.title}
        sx={{ 
          transition: 'transform 0.5s ease',
          height: '100%',
          width: '100%'
        }}
      />
      <Chip 
        label={post.category} 
        size="small"
        sx={{ 
          position: 'absolute',
          top: 16,
          left: 16,
          bgcolor: 'rgba(255,255,255,0.9)', 
          color: '#1e293b', 
          fontWeight: 700, 
          backdropFilter: 'blur(4px)',
          borderRadius: 1.5
        }} 
      />
    </Box>
    <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, fontSize: '0.75rem', color: '#94a3b8' }}>
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.readTime} lectura</span>
      </Box>
      <Typography variant="h5" sx={{ 
        fontFamily: 'Playfair Display, serif', 
        fontWeight: 700, 
        fontSize: '1.25rem',
        mb: 1.5,
        color: '#1e293b',
        lineHeight: 1.3
      }}>
        {post.title}
      </Typography>
      <Typography variant="body2" sx={{ color: '#64748b', mb: 3, lineHeight: 1.6, flexGrow: 1 }}>
        {post.excerpt}
      </Typography>
      <Button 
        variant="outlined" 
        color="success"
        endIcon={<ArrowForwardIcon />}
        sx={{ 
          alignSelf: 'flex-start', 
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 600,
          borderWidth: 2,
          '&:hover': { borderWidth: 2 }
        }}
      >
        Leer más
      </Button>
    </CardContent>
  </Card>
);

const Newsletter: FC = () => (
  <Box sx={{ 
    bgcolor: '#f0fdf4', 
    borderRadius: 4, 
    p: { xs: 4, md: 8 }, 
    textAlign: 'center',
    mt: 12,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <Box sx={{ 
      position: 'absolute', top: -50, left: -50, width: 200, height: 200, 
      borderRadius: '50%', bgcolor: 'rgba(74, 222, 128, 0.1)' 
    }} />
    <Box sx={{ 
      position: 'absolute', bottom: -50, right: -50, width: 200, height: 200, 
      borderRadius: '50%', bgcolor: 'rgba(74, 222, 128, 0.1)' 
    }} />
    
    <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
      <EmailIcon sx={{ fontSize: 48, color: '#16a34a', mb: 2 }} />
      <Typography variant="h3" sx={{ 
        fontFamily: 'Playfair Display, serif', 
        fontWeight: 700, 
        color: '#1e293b',
        mb: 2
      }}>
        Únete a nuestra comunidad
      </Typography>
      <Typography sx={{ color: '#64748b', mb: 4 }}>
        Recibe las mejores recetas, consejos de cultivo y ofertas exclusivas directamente en tu bandeja de entrada.
      </Typography>
      
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
          placeholder="Tu correo electrónico" 
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
          Suscribirse
        </Button>
      </Box>

    </Container>
  </Box>
);

// --- Componente Principal ---

const Blog: FC = () => {
  const featuredPost = blogPosts[0];
  const otherPosts = blogPosts.slice(1);

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', pb: 12 }}>
      <HeroSection />
      
      <Container maxWidth="lg">
        {/* Featured Post */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="overline" sx={{ color: '#94a3b8', fontWeight: 700, letterSpacing: 1.5, mb: 2, display: 'block' }}>
            Destacado de la Semana
          </Typography>
          <FeaturedPost post={featuredPost} />
        </Box>

        {/* Recent Posts Grid */}
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" sx={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, color: '#1e293b' }}>
              Artículos Recientes
            </Typography>
            <Button endIcon={<ArrowForwardIcon />} sx={{ color: '#64748b' }}>
              Ver todos
            </Button>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {otherPosts.map((post) => (
              <Box key={post.id}>
                <BlogPostCard post={post} />
              </Box>
            ))}
          </Box>
        </Box>

        <Newsletter />
      </Container>
    </Box>
  );
};

export default Blog;