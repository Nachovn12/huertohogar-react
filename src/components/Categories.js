import React from 'react';

const Categories = () => {
  const categories = [
    {
      id: 'frutas',
      title: 'Frutas Frescas',
      description: 'Nuestra selección de frutas frescas ofrece una experiencia directa del campo a tu hogar. Estas frutas se cultivan y cosechan en el punto óptimo de madurez para asegurar su sabor y frescura.',
      features: ['Fresco', 'De Temporada', 'Nutritivo'],
      productCount: 3,
      image: '🍎'
    },
    {
      id: 'verduras',
      title: 'Verduras Orgánicas',
      description: 'Descubre nuestra gama de verduras orgánicas, cultivadas sin el uso de pesticidas ni químicos, garantizando un sabor auténtico y natural.',
      features: ['Orgánico', 'Sin Pesticidas', 'Sostenible'],
      productCount: 3,
      image: '🥕'
    },
    {
      id: 'organicos',
      title: 'Productos Orgánicos',
      description: 'Nuestros productos orgánicos están elaborados con ingredientes naturales y procesados de manera responsable para mantener sus beneficios saludables.',
      features: ['Natural', 'Responsable', 'Saludable'],
      productCount: 2,
      image: '🌿'
    },
    {
      id: 'lacteos',
      title: 'Productos Lácteos',
      description: 'Los productos lácteos de HuertoHogar provienen de granjas locales que se dedican a la producción responsable y de calidad.',
      features: ['Local', 'Fresco', 'Nutritivo'],
      productCount: 1,
      image: '🥛'
    }
  ];

  return (
    <section className="section-padding bg-light">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="section-title">Nuestras Categorías</h2>
            <p className="section-subtitle">
              Descubre nuestra selección de productos frescos y naturales
            </p>
          </div>
        </div>

        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className="col-lg-3 col-md-6">
              <div className="card h-100 border-0 shadow-sm category-card">
                <div className="card-body text-center p-4">
                  <div className="category-icon mb-3">
                    <div className="display-4">{category.image}</div>
                  </div>
                  <h5 className="card-title fw-bold mb-3">{category.title}</h5>
                  <p className="card-text text-muted mb-4">
                    {category.description}
                  </p>
                  
                  <div className="features mb-3">
                    {category.features.map((feature, index) => (
                      <span key={index} className="badge bg-success me-1 mb-1">
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  <div className="product-count mb-3">
                    <small className="text-muted">
                      {category.productCount} productos disponibles
                    </small>
                  </div>
                  
                  <button className="btn btn-outline-primary btn-sm w-100">
                    Ver Productos
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
