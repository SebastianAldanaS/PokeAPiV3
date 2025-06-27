import React from 'react'
import { Link } from 'react-router-dom'

export const CardPokemon = ({ pokemon }) => {
  if (!pokemon) {
    return null;
  }
  
  const primaryType = pokemon.types[0]?.type.name;
  
  return (
    <Link to={`/pokemon/${pokemon.id}`} className={`card-pokemon ${primaryType}`}>
      <div className="card-background">
        <div className="card-pattern"></div>
      </div>
      
      <div className="card-header">
        <span className="pokemon-id">#{String(pokemon.id).padStart(3, '0')}</span>
        <div className="card-favorite">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </div>
      </div>

      <div className="card-image-container">
        <div className="card-image-bg"></div>
        <img 
          src={pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.other.home.front_default} 
          alt={pokemon.name}
          className="card-image"
          loading="lazy"
        />
      </div>

      <div className="card-content">
        <h3 className="pokemon-name">{pokemon.name}</h3>
        
        <div className="card-types">
          {pokemon.types.map((type, index) => (
            <span 
              key={type.type.name} 
              className={`type-badge ${type.type.name} ${index === 0 ? 'primary' : 'secondary'}`}
            >
              {type.type.name}
            </span>
          ))}
        </div>

        <div className="card-stats">
          {pokemon.stats && (
            <div className="stats-preview">
              <div className="stat-item">
                <span className="stat-label">HP</span>
                <span className="stat-value">{pokemon.stats[0]?.base_stat}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">ATK</span>
                <span className="stat-value">{pokemon.stats[1]?.base_stat}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">DEF</span>
                <span className="stat-value">{pokemon.stats[2]?.base_stat}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-hover-effect">
        <div className="hover-shine"></div>
      </div>
    </Link>
  )
}
