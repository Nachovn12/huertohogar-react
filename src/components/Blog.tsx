import type { FC } from 'react';
import React from 'react';

type Post = {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category?: string;
};

// --- CAMBIO: Añadí un post más para que la grilla se vea mejor ---
const blogPosts: Post[] = [
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
    image: "https://www.rionegro.com.ar/wp-content/uploads/2024/06/composts.jpg?w=920&h=517&crop=1",
    category: "Sostenibilidad"
  },
  {
    id: 3,
    title: "Los Beneficios de la Miel Orgánica para tu Bienestar",
    date: "25 de Octubre, 2025",
    excerpt: "Más allá de endulzar, la miel pura de abeja tiene propiedades increíbles para tu salud. Te contamos todo aquí..",
    image: "https://saborusachile.cl/wp-content/uploads/2024/08/miel-ok-1240x578.jpg",
    category: "Salud"
  },
  {
    id: 4,
    title: "Guía para tu Primer Huerto Urbano en Balcón",
    date: "22 de Octubre, 2025",
    excerpt: "No necesitas un gran jardín. Te mostramos cómo cultivar tus propias hierbas y vegetales en un espacio pequeño.",
    image: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=600&q=80",
    category: "Guías"
  }
];

const Blog: FC = () => {
  // --- CAMBIO: Lógica de Hover en JS para controlar la tarjeta y la imagen ---
  const handleMouseOver = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.transform = 'translateY(-6px)';
    target.style.boxShadow = '0 12px 24px rgba(46,139,87,0.15)';
    const img = target.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1.05)';
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.transform = 'translateY(0)';
    target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)'; // Sombra base más suave
    const img = target.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  };


  return (
    // --- CAMBIO: Fondo más claro y más padding vertical ---
    <div style={{ background: '#F9FAFB', minHeight: '100vh', padding: '64px 24px' }}>
      {/* --- CAMBIO: Contenedor más ancho --- */}
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          color: '#2E8B57',
          fontWeight: 800, // Más grueso
          fontFamily: 'Playfair Display, serif',
          fontSize: '2.75rem', // Más grande
          marginBottom: 16
        }}>
          Blog HuertoHogar
        </h2>
        {/* --- CAMBIO: Subtítulo descriptivo --- */}
        <p style={{
          textAlign: 'center',
          color: '#555',
          fontSize: '1.15rem',
          maxWidth: 600,
          margin: '0 auto 48px auto', // Margen inferior
          lineHeight: 1.6
        }}>
          Novedades, recetas y consejos de nuestro huerto a tu hogar.
        </p>

        <div style={{
          display: 'grid',
          // --- CAMBIO: minmax a 300px para más flexibilidad ---
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '40px', // Más espacio
          justifyItems: 'center'
        }}>
          {blogPosts.map((post) => (
            <article
              key={post.id}
              // --- CAMBIO: Eventos de hover ---
              onMouseOver={handleMouseOver}
              onMouseOut={handleMouseOut}
              style={{
                background: '#fff',
                // --- CAMBIO: Bordes más redondeados ---
                borderRadius: 16,
                // --- CAMBIO: Sombra base más sutil ---
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
                width: '100%',
                maxWidth: 380, // Límite de ancho
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                // --- CAMBIO: Transición más suave ---
                transition: 'all 0.3s ease-in-out',
                height: '100%' // Importante para que todas tengan la misma altura en la fila
              }}
            >
              {/* --- CAMBIO: Contenedor de imagen con aspect-ratio y overflow --- */}
              <div style={{
                width: '100%',
                height: 220, // Altura fija para la imagen
                overflow: 'hidden',
                background: '#eee'
              }}>
                <img
                  src={post.image}
                  alt={post.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    // --- CAMBIO: Transición para el zoom ---
                    transition: 'transform 0.4s ease'
                  }}
                  loading="lazy"
                />
              </div>

              {/* --- CAMBIO: Padding aumentado y flex --- */}
              <div style={{
                padding: '24px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* --- CAMBIO: Estilo de la etiqueta de categoría --- */}
                <span style={{
                  background: '#EAF6ED', // Fondo verde pálido
                  color: '#2E8B57', // Texto verde oscuro
                  fontWeight: 700,
                  fontSize: 12,
                  borderRadius: 9999, // Forma de píldora
                  padding: '6px 14px',
                  alignSelf: 'flex-start',
                  marginBottom: 16,
                  textTransform: 'uppercase', // Mayúsculas
                  letterSpacing: 0.5
                }}>{post.category}</span>

                {/* --- CAMBIO: Tipografía del título --- */}
                <h3 style={{
                  color: '#1A202C', // Casi negro
                  fontWeight: 800,
                  fontSize: '1.25rem',
                  margin: 0,
                  marginBottom: 8,
                  lineHeight: 1.4
                }}>{post.title}</h3>

                {/* --- CAMBIO: Tipografía de la fecha --- */}
                <span style={{
                  color: '#718096', // Gris suave
                  fontSize: 14,
                  fontWeight: 500,
                  marginBottom: 12
                }}>{post.date}</span>

                {/* --- CAMBIO: Tipografía del extracto --- */}
                <p style={{
                  color: '#4A5568', // Gris oscuro
                  fontSize: 16,
                  margin: 0,
                  marginBottom: 24,
                  lineHeight: 1.6,
                  flexGrow: 1 // Empuja el link "Leer más" hacia abajo
                }}>{post.excerpt}</p>

                <a
                  href="#"
                  style={{
                    color: '#2E8B57',
                    fontWeight: 700,
                    textDecoration: 'none',
                    fontSize: 16, // Ligeramente más grande
                    marginTop: 'auto' // Se asegura que esté al final
                  }}
                >
                  Leer más →
                </a>
              </div>
            </article>
          ))}
        </div>
        <p style={{
          textAlign: 'center',
          marginTop: 64, // Más margen superior
          color: '#666',
          fontStyle: 'italic',
          fontSize: '1.1rem'
        }}>
          Próximamente más artículos sobre alimentación saludable y sostenible
        </p>
      </div>
    </div>
  );
};

export default Blog;