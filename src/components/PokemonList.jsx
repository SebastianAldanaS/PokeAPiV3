import React, { useContext } from 'react'
import { PokemonContext } from '../context/PokemonContext'
import { CardPokemon } from './CardPokemon'
import { Loader } from './Loader'

export const PokemonList = () => {
  const { 
    loading, 
    getPokemonToShow, 
    typeFilter, 
    filteredPokemon, 
    getPaginationInfo,
    isSearching,
    searchResults,
    valueSearch
  } = useContext(PokemonContext)
  
  if (loading) {
    return <Loader />
  }

  const pokemonToShow = getPokemonToShow();
  const paginationInfo = getPaginationInfo();
  
  return (
    <div className="pokemon-list-container">
      {/* Results Summary */}
      <div className="results-summary">
        {isSearching && (
          <div className="search-summary">
            <h3>Resultados de búsqueda para: <span className="search-term">"{valueSearch}"</span></h3>
            <div className="results-count">
              {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}

        {typeFilter.length > 0 && (
          <div className="filter-summary">
            <p>Filtrando por tipos:</p>
            <div className="applied-filters">
              {typeFilter.map(type => (
                <span key={type} className={`applied-filter ${type}`}>{type}</span>
              ))}
            </div>
            <div className="results-count">
              {filteredPokemon.length} Pokémon encontrados
            </div>
          </div>
        )}

        {/* Default state */}
        {!isSearching && typeFilter.length === 0 && (
          <div className="default-summary">
            <div className="summary-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <div className="summary-content">
              <h3>Explorando Pokémon</h3>
              <p>Descubre todos los Pokémon disponibles</p>
              <div className="summary-stats">
                <span className="stat-badge">
                  {pokemonToShow?.length || 0} Pokémon mostrados
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Pokemon Grid */}
      <div className="pokemon-grid">
        {pokemonToShow && pokemonToShow.length > 0 ? (
          pokemonToShow.map((pokemon) => (
            <CardPokemon pokemon={pokemon} key={pokemon.id} />
          ))
        ) : (
          <div className="no-results-container">
            <div className="no-results-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M16 16s-1.5-2-4-2-4 2-4 2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
            <h3>No se encontraron resultados</h3>
            {isSearching ? (
              <p>No hay Pokémon que contengan "<span className="search-term">{valueSearch}</span>"</p>
            ) : (
              <p>No hay Pokémon disponibles</p>
            )}
            <div className="no-results-suggestions">
              <p>Sugerencias:</p>
              <ul>
                <li>Intenta con otro término de búsqueda</li>
                <li>Verifica tu conexión a internet</li>
                <li>Recarga la página</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
