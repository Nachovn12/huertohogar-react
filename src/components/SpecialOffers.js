import React from 'react';
import { Link } from 'react-router-dom';
import { products } from '../data/products';

const formatPrice = (value) => `${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const SpecialOffers = () => {
  // Usar solo los productos que realmente tienen ofertas (según indicaciones)
  const declaredOffers = [
    { id: 'PO001', discount: 25 }, // Miel Orgánica
    { id: 'PO003', discount: 20 }, // Quinua Orgánica
    { id: 'FR001', discount: 15 }, // Manzanas Fuji
    { id: 'VR003', discount: 18 }  // Pimientos Tricolores
  ];

  const offers = declaredOffers
    .map(o => {
      const p = products.find(prod => prod.id === o.id);
      if (!p) return null;
      return {
        ...p,
        discount: o.discount,
        discountedPrice: Math.round(p.price * (1 - o.discount / 100))
      };
    })
    .filter(Boolean);

  return (
    <section className="section-padding special-offers hf-theme">
      <div className="container">
        <div className="row mb-4 align-items-center">
          <div className="col-md-8">
            <h2 className="section-title text-dark">Ofertas Exclusivas</h2>
            <p className="section-subtitle text-dark mb-0">
              Productos seleccionados con descuentos especiales para nuestros clientes
            </p>
          </div>
          <div className="col-md-4 text-md-end mt-3 mt-md-0">
            <Link to="/productos" className="btn btn-outline-success btn-lg">Ver todos los productos</Link>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          {offers.map((item) => (
            <div key={item.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <article className="product-card h-100 shadow-sm position-relative">
                <div className="product-image-container position-relative">
                  <img src={item.image} alt={item.name} className="featured-product-image" />
                  <div className="offer-badge position-absolute">-{item.discount}%</div>
                </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fw-bold text-dark">{item.name}</h5>
                  <p className="card-text text-muted small mb-2">{item.unit}</p>

                  <div className="price-section mb-3">
                    <div className="d-flex align-items-end gap-3">
                      <div>
                        <div className="price-new">${formatPrice(item.discountedPrice)} CLP</div>
                        <div className="price-old text-muted">${formatPrice(item.price)} CLP</div>
                      </div>
                      <div className="ms-auto">
                        <span className="price-discount-pill">-{item.discount}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-auto">
                    <Link to={`/productos/${item.id}`} className="btn btn-cta flex-fill">Ver detalles</Link>
                    <button className="btn btn-add flex-fill">Agregar al carrito</button>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
