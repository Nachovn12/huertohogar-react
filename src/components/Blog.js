import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import KitchenIcon from '@mui/icons-material/Kitchen';

const blogPosts = [
  {
    id: 1,
    title: "Ensalada de Verano con Ingredientes Frescos",
    date: "1 de Noviembre, 2025",
    excerpt: "Descubre cómo preparar una deliciosa y nutritiva ensalada con los productos de nuestra última cosecha..",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
    category: "Receta"
  },
  {
    id: 2,
    title: "5 Pasos Sencillos para Empezar a Compostar en Casa",
    date: "28 de Octubre, 2025",
    excerpt: "Aprende a reducir tus residuos y a crear abono para tus plantas con esta guía de compostaje para principiantes..",
  image: "https://www.rionegro.com.ar/wp-content/uploads/2024/06/composts.jpg?w=920&h=517&crop=1", // compostaje: manos y tierra
    category: "Sostenibilidad"
  },
  {
    id: 3,
    title: "Los Beneficios de la Miel Orgánica para tu Bienestar",
    date: "25 de Octubre, 2025",
    excerpt: "Más allá de endulzar, la miel pura de abeja tiene propiedades increíbles para tu salud. Te contamos todo aquí..",
  image: "https://saborusachile.cl/wp-content/uploads/2024/08/miel-ok-1240x578.jpg", // miel orgánica: tarro de miel y panal
    category: "Salud"
  }
];

const Blog = () => {
  return (
    <div style={{ background: '#F7F7F7', minHeight: '100vh', padding: '48px 0' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', color: '#2E8B57', fontWeight: 700, fontFamily: 'Playfair Display, serif', fontSize: '2.5rem', marginBottom: 24 }}>
          Blog HuertoHogar
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          justifyItems: 'center',
        }}>
          {blogPosts.map((post) => (
            <div
              key={post.id}
              style={{
                background: '#fff',
                borderRadius: 20,
                boxShadow: '0 8px 32px rgba(46,139,87,0.10)',
                width: '100%',
                maxWidth: 350,
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s',
                minHeight: 440,
                position: 'relative',
                height: '100%',
              }}
            >
              <div style={{ width: '100%', height: 180, overflow: 'hidden', background: '#eee' }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  loading="lazy"
                />
              </div>
              <div style={{ padding: '20px 20px 16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{
                  background: '#FFEB3B',
                  color: '#333',
                  fontWeight: 700,
                  fontSize: 13,
                  borderRadius: 6,
                  padding: '4px 12px',
                  alignSelf: 'flex-start',
                  marginBottom: 12,
                  letterSpacing: 0.5,
                }}>{post.category}</span>
                <h3 style={{ color: '#222', fontWeight: 700, fontSize: '1.15rem', margin: 0, marginBottom: 8 }}>{post.title}</h3>
                <span style={{ color: '#7CBF7B', fontSize: 13, fontWeight: 500, marginBottom: 8 }}>{post.date}</span>
                <p style={{ color: '#666', fontSize: 15, margin: 0, marginBottom: 16 }}>{post.excerpt}</p>
                <a
                  href="#"
                  style={{
                    color: '#2E8B57',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: 15,
                    marginTop: 'auto',
                    transition: 'color 0.2s',
                  }}
                  onMouseOver={e => (e.target.style.color = '#1b5e20')}
                  onMouseOut={e => (e.target.style.color = '#2E8B57')}
                >
                  Leer más →
                </a>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 48, color: '#666', fontStyle: 'italic', fontSize: '1.08rem' }}>
          Próximamente más artículos sobre alimentación saludable y sostenible
        </p>
      </div>
    </div>
  );
};

export default Blog;
