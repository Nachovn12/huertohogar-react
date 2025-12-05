import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useProducts, useProductsOnOffer } from '../hooks/useApi';
import { CircularProgress, Box } from '@mui/material';
import ProductCard from './ProductCard';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

const FeaturedProducts: React.FC = () => {
  const { products: offerProducts, loading: loadingOffers } = useProductsOnOffer();
  const { products: allProducts, loading: loadingAll } = useProducts();
  
  // Usar productos en oferta, o si no hay, los primeros 8 productos
  const featuredProducts = React.useMemo(() => {
    if (offerProducts.length >= 4) return offerProducts;
    return allProducts.slice(0, 8);
  }, [offerProducts, allProducts]);

  const loading = loadingOffers || loadingAll;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
        <CircularProgress sx={{ color: '#16a34a' }} />
      </Box>
    );
  }

  return (
    <section style={{ 
      padding: '60px 0 80px 0', 
      background: 'linear-gradient(180deg, #F7F7F7 0%, #ffffff 100%)',
      position: 'relative'
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 40px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '16px',
            padding: '8px 24px',
            borderRadius: '32px',
            background: 'rgba(139, 69, 19, 0.1)',
            border: '1px solid rgba(139, 69, 19, 0.2)'
          }}>
            <span style={{ fontSize: '1.2rem' }}>⭐</span>
            <span style={{ 
              color: '#8B4513', 
              fontWeight: 700,
              fontSize: '0.85rem',
              textTransform: 'uppercase',
              letterSpacing: '1.5px',
              fontFamily: 'Montserrat, Arial, sans-serif'
            }}>
              Selección Especial
            </span>
          </div>

          <h2 style={{ 
            fontWeight: 800, 
            fontSize: '2.8rem', 
            color: '#1a1a1a',
            marginBottom: 16, 
            fontFamily: 'Playfair Display, serif',
            letterSpacing: '-1px'
          }}>
            Productos Destacados
          </h2>
          <p style={{ 
            color: '#666666', 
            fontSize: '1.05rem', 
            marginBottom: 0,
            fontWeight: 400,
            fontFamily: 'Montserrat, Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Los mejores productos frescos y orgánicos seleccionados especialmente para ti y tu familia
          </p>
        </div>
        
        {/* Swiper Carousel */}
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={false}
          navigation={true}
          pagination={{ 
            clickable: true,
            dynamicBullets: false
          }}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true
          }}
          loop={featuredProducts.length > 4}
          speed={800}
          grabCursor={true}
          breakpoints={{
            480: {
              slidesPerView: 1.8,
              spaceBetween: 16,
            },
            640: {
              slidesPerView: 2.2,
              spaceBetween: 18,
            },
            768: {
              slidesPerView: 2.8,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3.5,
              spaceBetween: 22,
            },
            1280: {
              slidesPerView: 4.2,
              spaceBetween: 24,
            },
          }}
          style={{
            paddingTop: '8px',
            paddingBottom: '52px',
            paddingLeft: '4px',
            paddingRight: '4px'
          }}
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: #374151;
          background: #ffffff;
          padding: 8px;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
          top: 50%;
          transform: translateY(-50%);
          margin-top: -26px;
        }

        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 14px;
          font-weight: 900;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: #16a34a;
          color: #fff;
          border-color: #16a34a;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.3);
          transform: translateY(-50%) scale(1.08);
        }

        .swiper-button-disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .swiper-pagination {
          bottom: 20px !important;
        }

        .swiper-pagination-bullet {
          background: #cbd5e1;
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
          margin: 0 4px !important;
        }

        .swiper-pagination-bullet-active {
          background: #16a34a;
          width: 28px;
          border-radius: 4px;
        }

        .swiper-slide {
          height: auto;
          display: flex;
        }

        .swiper-slide > div {
          width: 100%;
        }
      `}</style>
    </section>
  );
};

export default FeaturedProducts;
