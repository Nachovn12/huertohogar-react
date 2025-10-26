import React from 'react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Beneficios de los Productos Orgánicos",
      excerpt: "Descubre por qué elegir productos orgánicos es mejor para tu salud y el medio ambiente.",
      date: "15 de Diciembre, 2024",
      author: "Equipo HuertoHogar",
      category: "Salud",
      image: "🌿"
    },
    {
      id: 2,
      title: "Cultivo Sostenible en Chile",
      excerpt: "Conoce las prácticas agrícolas sostenibles que implementan nuestros agricultores locales.",
      date: "10 de Diciembre, 2024",
      author: "Equipo HuertoHogar",
      category: "Sostenibilidad",
      image: "🌱"
    },
    {
      id: 3,
      title: "Recetas con Productos Frescos",
      excerpt: "Ideas deliciosas para aprovechar al máximo tus productos frescos de HuertoHogar.",
      date: "5 de Diciembre, 2024",
      author: "Equipo HuertoHogar",
      category: "Recetas",
      image: "🍽️"
    },
    {
      id: 4,
      title: "Temporada de Frutas de Verano",
      excerpt: "Las mejores frutas de temporada que puedes encontrar en esta época del año.",
      date: "1 de Diciembre, 2024",
      author: "Equipo HuertoHogar",
      category: "Temporada",
      image: "🍎"
    }
  ];

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="display-4 fw-bold text-center mb-5">Blog HuertoHogar</h1>
          <p className="lead text-center text-muted mb-5">
            Descubre consejos, recetas y noticias sobre alimentación saludable y sostenible
          </p>
        </div>
      </div>

      <div className="row g-4">
        {blogPosts.map((post) => (
          <div key={post.id} className="col-lg-6 col-md-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-3">
                  <div className="display-4 me-3">{post.image}</div>
                  <div>
                    <span className="badge bg-success mb-2">{post.category}</span>
                    <p className="text-muted small mb-0">{post.date}</p>
                  </div>
                </div>
                
                <h5 className="card-title fw-bold mb-3">{post.title}</h5>
                <p className="card-text text-muted mb-3">{post.excerpt}</p>
                
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted">Por {post.author}</small>
                  <button className="btn btn-outline-primary btn-sm">
                    Leer más
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card bg-light">
            <div className="card-body text-center p-5">
              <h3 className="card-title fw-bold mb-3">¿Tienes Alguna Pregunta?</h3>
              <p className="card-text lead mb-4">
                Nuestro equipo está aquí para ayudarte con cualquier consulta sobre nuestros productos.
              </p>
              <button className="btn btn-primary btn-lg">
                Contactar Equipo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
