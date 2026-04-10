import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ watch, image }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="gallery-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        background: '#1A1A1A',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.15)',
        overflow: 'hidden',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'none',
        boxShadow: hovered ? '0 10px 30px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      {/* IMAGE CONTAINER */}
      <div
        className="gallery-card-image-wrap"
        style={{
          width: '100%',
          aspectRatio: '1',
          position: 'relative',
          background: '#0c0c0c',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <img
          src={image}
          alt={watch.name}
          loading="lazy"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.6s ease',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
          }}
        />
      </div>

      {/* INFO AREA */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 20px',
          flex: 1,
        }}
      >
        <h3
          style={{
            margin: '0 0 8px 0',
            fontSize: '1.25rem',
            fontWeight: 800,
            color: '#FFFFFF',
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {watch.name}
        </h3>
        
        <p
          style={{
            margin: '0 0 24px 0',
            fontSize: '0.85rem',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.55)',
            fontFamily: 'DM Sans, sans-serif',
            lineHeight: 1.4,
          }}
        >
          {watch.description || 'Exclusive luxury timepiece'}
        </p>

        <div style={{ marginTop: 'auto', textAlign: 'left', marginBottom: '20px' }}>
          <p
            style={{
              margin: 0,
              fontSize: '1rem',
              fontWeight: 600,
              color: '#FFFFFF',
              fontFamily: 'DM Sans, sans-serif',
              letterSpacing: '0.02em',
            }}
          >
            PKR {watch.price.toLocaleString('en-PK')}
          </p>
        </div>

        {/* BUY NOW Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/product/${watch.id}`);
          }}
          style={{
            width: '100%',
            height: '46px',
            background: '#D95A11',
            borderRadius: '9999px',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontFamily: 'DM Sans, sans-serif',
            cursor: 'pointer',
            transition: 'background 0.2s ease, transform 0.1s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#C04C0A'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#D95A11'}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          BUY NOW
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
