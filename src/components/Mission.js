import React from 'react';

const Mission = () => {
  return (
    <section className="section-padding mission-section">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h2 className="display-5 fw-bold mb-4">Nuestra Misión es Conectarte con la Tierra</h2>
            <p className="lead mb-4">
              En HuertoHogar, nuestra misión es llevar productos frescos y orgánicos directamente 
              de los campos chilenos a tu hogar, garantizando calidad y sostenibilidad. 
              Apoyamos a los agricultores locales y promovemos un estilo de vida saludable.
            </p>
            <button className="btn btn-primary btn-lg">
              Conoce más sobre nosotros
            </button>
          </div>
          <div className="col-lg-4 text-center">
            <div className="mission-icon">
              <div className="display-1">🌱</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mission;
