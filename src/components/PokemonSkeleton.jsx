import React from 'react';

export const PokemonCardSkeleton = () => {
  return (
    <div className="card-pokemon skeleton">
      <div className="card-header">
        <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '12px' }}></div>
        <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
      </div>
      
      <div className="card-image-container">
        <div className="skeleton" style={{ width: '120px', height: '120px', borderRadius: '50%' }}></div>
      </div>
      
      <div className="card-content">
        <div className="skeleton" style={{ width: '80%', height: '28px', borderRadius: '8px', margin: '0 auto 16px' }}></div>
        
        <div className="card-types" style={{ justifyContent: 'center', gap: '8px' }}>
          <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '20px' }}></div>
          <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '20px' }}></div>
        </div>
        
        <div className="card-stats">
          <div className="stats-preview">
            {[1, 2, 3].map(item => (
              <div key={item} className="stat-item">
                <div className="skeleton" style={{ width: '100%', height: '12px', borderRadius: '4px', marginBottom: '8px' }}></div>
                <div className="skeleton" style={{ width: '60%', height: '16px', borderRadius: '4px', margin: '0 auto' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const PokemonGridSkeleton = ({ count = 24 }) => {
  return (
    <div className="pokemon-grid">
      {Array.from({ length: count }, (_, index) => (
        <PokemonCardSkeleton key={index} />
      ))}
    </div>
  );
};
