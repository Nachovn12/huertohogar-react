import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold">🌱 HuertoHogar</h5>
            <p className="text-muted">
              Tu tienda de confianza para productos de jardinería y hogar.
            </p>
          </div>
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Enlaces Rápidos</h6>
            <ul className="list-unstyled">
              <li><a href="/" className="text-muted text-decoration-none">Inicio</a></li>
              <li><a href="/productos" className="text-muted text-decoration-none">Productos</a></li>
              <li><a href="/cart" className="text-muted text-decoration-none">Carrito</a></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4">
            <h6 className="fw-bold">Contacto</h6>
            <p className="text-muted mb-1">📧 info@huertohogar.cl</p>
            <p className="text-muted mb-1">📞 +56 9 1234 5678</p>
            <p className="text-muted">📍 Santiago, Chile</p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row">
          <div className="col-12 text-center">
            <p className="mb-0 text-muted">
              © 2024 HuertoHogar. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
