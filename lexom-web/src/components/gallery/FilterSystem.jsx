import React from 'react';
import FilterChip from './FilterChip';

const FilterSystem = () => {
  const filterCategories = [
    { label: 'Color', category: 'color', options: ['Silver', 'Black', 'Gold', 'Blue'] },
    { label: 'Size', category: 'size', options: ['38mm', '40mm', '42mm', '44mm'] },
    { label: 'Price', category: 'price', options: ['Under 1L', '1L–2L', 'Above 2L'] },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '24px',
        width: '100%',
      }}
    >
      {filterCategories.map((group, idx) => (
        <div 
          key={group.category} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px' 
          }}
        >
          {/* Category Label */}
          <span
            style={{
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
              fontFamily: 'DM Sans, sans-serif',
            }}
          >
            {group.label}
          </span>

          {/* Chips Wrapper */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {group.options.map((option) => (
              <FilterChip 
                key={option} 
                category={group.category} 
                value={option} 
              />
            ))}
          </div>

          {/* Separator Line (except last one) */}
          {idx < filterCategories.length - 1 && (
            <div
              style={{
                width: '1px',
                height: '24px',
                background: 'rgba(255,255,255,0.1)',
                marginLeft: '12px',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default FilterSystem;
