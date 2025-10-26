import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = () => {
  const { addToCart } = useCart();

  const featuredProducts = [
    {
      id: "FR001",
      name: "Manzanas Fuji",
      price: 1020,
      originalPrice: 1200,
      discount: 15,
      savings: 180,
      image: "https://santaisabel.vtexassets.com/arquivos/ids/174684-900-900?width=200&height=200&aspect=true",
      unit: "kilos"
    },
    {
      id: "FR002",
      name: "Naranjas Valencia", 
      price: 1000,
      image: "https://static.vecteezy.com/system/resources/previews/022/825/544/non_2x/orange-fruit-orange-on-transparent-background-free-png.png",
      unit: "kilos"
    },
    {
      id: "FR003",
      name: "Plátanos Cavendish",
      price: 800,
      image: "https://png.pngtree.com/png-vector/20240128/ourmid/pngtree-ripe-cavendish-banana-png-image_11508971.png",
      unit: "kilos"
    },
    {
      id: "VR001",
      name: "Zanahorias Orgánicas",
      price: 900,
      image: "https://png.pngtree.com/png-vector/20241225/ourmid/pngtree-fresh-organic-carrots-in-a-neat-stack-png-image_14812590.png",
      unit: "kilos"
    },
    {
      id: "VR002",
      name: "Espinacas Frescas",
      price: 700,
      image: "https://pngimg.com/uploads/spinach/spinach_PNG45.png",
      unit: "bolsas de 500g"
    },
    {
      id: "VR003",
      name: "Pimientos Tricolores",
      price: 1230,
      originalPrice: 1500,
      discount: 18,
      savings: 270,
      image: "https://png.pngtree.com/png-vector/20241212/ourmid/pngtree-colored-paprica-raw-paprika-fruit-png-image_14613829.png",
      unit: "kilos"
    }
  ];

  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(price);
  };

  const navigate = useNavigate();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleViewDetails = (product) => {
    navigate(`/productos/${product.id}`);
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row mb-5">
          <div className="col-12 text-center">
            <h2 className="display-5 fw-bold mb-3">Productos Destacados</h2>
            <p className="lead text-muted">
              Los mejores productos seleccionados especialmente para ti
            </p>
          </div>
        </div>

        <div className="row g-4">
          {featuredProducts.map((product) => (
            <div key={product.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm featured-product-card">
                <div className="position-relative">
                  {product.discount && (
                    <div className="position-absolute top-0 start-0 m-2">
                      <span className="badge bg-danger fs-6">🔥 {product.discount}% OFF</span>
                    </div>
                  )}
                  <div className="text-center p-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        objectFit: 'contain'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{product.name}</h5>
                  
                  <div className="mb-3">
                    <span className="h5 text-primary fw-bold">
                      {formatPrice(product.price)} CLP
                    </span>
                    <small className="text-muted d-block">{product.unit}</small>
                  </div>

                  <div className="product-info-block mb-3">
                    {product.originalPrice && (
                      <div className="mb-3">
                        <small className="text-muted text-decoration-line-through">
                          Antes: {formatPrice(product.originalPrice)} CLP
                        </small>
                        <br />
                        <small className="text-success fw-bold">
                          💰 Ahorras {formatPrice(product.savings)} CLP
                        </small>
                      </div>
                    )}
                  </div>

                  <div className="d-grid gap-2 mt-auto">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => handleViewDetails(product)}
                    >
                      Ver Detalles
                    </button>
                    <button
                      className="btn btn-primary w-100"
                      onClick={() => handleAddToCart(product)}
                    >
                      Agregar al Carrito
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
