import React, { useContext, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { PokemonContext } from '../context/PokemonContext'
import { FilterBar } from './FilterBar'

export const Navigation = () => {
  const { 
    valueSearch, 
    onInputChange, 
    onResetForm, 
    executeSearch, // Nueva función para búsqueda manual
    clearSearch, 
    isSearching,
    // Estados de filtros
    active, 
    setActive, 
    pokemonFilter, 
    searchPokemon: searchTerm 
  } = useContext(PokemonContext);

  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    executeSearch(); // Usar la nueva función de búsqueda manual
    setMobileMenuOpen(false); // Cerrar menú al buscar
  };

  const handleInputChange = (e) => {
    onInputChange(e);
    // Removido: búsqueda automática mientras se escribe
    // Solo actualizar el valor del input
  };

  const handleClearSearch = () => {
    onResetForm(); // Limpiar el formulario primero
    clearSearch(); // Luego limpiar el estado de búsqueda
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSearch(); // Buscar al presionar Enter
      setMobileMenuOpen(false); // Cerrar menú al buscar
    }
  };

  const handleToggleFilter = () => {
    setActive(!active);
    setMobileMenuOpen(false); // Cerrar menú al abrir filtros
  };

  const handleBattleClick = () => {
    navigate('/battle');
    setMobileMenuOpen(false); // Cerrar menú al navegar
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header>
        <div className="header-content">
          {/* Logo */}
          <div className="header-logo" onClick={() => navigate('/')}>
            <h1 className="header-title">
              <span className="gradient-text">Pokédx</span>
            </h1>
            <div className="header-pokeball">
              <div className="pokeball">
                <div className="pokeball-top"></div>
                <div className="pokeball-middle">
                  <div className="pokeball-center"></div>
                </div>
                <div className="pokeball-bottom"></div>
              </div>
            </div>
          </div>

          {/* Desktop Controls */}
          <div className="header-controls desktop-only">
            <form onSubmit={onSearchSubmit}>
              <div className="search-container">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                  <path d="M21 21l-6 -6" />
                </svg>
                <input 
                  type="search" 
                  placeholder="Buscar pokemon" 
                  name="valueSearch"
                  value={valueSearch}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                />
              </div>
              <button type="submit">Buscar</button>
            </form>

            {/* Botón de filtros */}
            <button 
              className={`filter-toggle ${active ? 'active' : ''}`}
              onClick={handleToggleFilter}
            >
              <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 6l8 0" />
                <path d="M16 6l4 0" />
                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 12l2 0" />
                <path d="M10 12l10 0" />
                <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 18l11 0" />
                <path d="M19 18l1 0" />
              </svg>
              <span>Filtros</span>
              {(pokemonFilter.length > 0 || searchTerm) && (
                <div className="active-indicator">{pokemonFilter.length > 0 ? pokemonFilter.length : '1'}</div>
              )}
            </button>

            {/* Botón de batalla */}
            <button 
              className="battle-btn"
              onClick={handleBattleClick}
            >
              <svg className="battle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="2" />
                <path d="M13 13l6 6" />
                <path d="M21 3l-6 6" />
                <path d="M3 21l6-6" />
                <circle cx="15" cy="15" r="2" />
              </svg>
              <span>Batalla</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <button 
            className={`hamburger-btn mobile-only ${mobileMenuOpen ? 'open' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Menú"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <form onSubmit={onSearchSubmit} className="mobile-search">
            <div className="search-container">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-search">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
                <path d="M21 21l-6 -6" />
              </svg>
              <input 
                type="search" 
                placeholder="Buscar pokemon" 
                name="valueSearch"
                value={valueSearch}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button type="submit">Buscar</button>
          </form>

          <div className="mobile-actions">
            <button 
              className={`mobile-filter-btn ${active ? 'active' : ''}`}
              onClick={handleToggleFilter}
            >
              <svg className="filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 6l8 0" />
                <path d="M16 6l4 0" />
                <path d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 12l2 0" />
                <path d="M10 12l10 0" />
                <path d="M17 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                <path d="M4 18l11 0" />
                <path d="M19 18l1 0" />
              </svg>
              <span>Filtros</span>
              {(pokemonFilter.length > 0 || searchTerm) && (
                <div className="active-indicator">{pokemonFilter.length > 0 ? pokemonFilter.length : '1'}</div>
              )}
            </button>

            <button 
              className="mobile-battle-btn"
              onClick={handleBattleClick}
            >
              <svg className="battle-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="9" r="2" />
                <path d="M13 13l6 6" />
                <path d="M21 3l-6 6" />
                <path d="M3 21l6-6" />
                <circle cx="15" cy="15" r="2" />
              </svg>
              <span>Batalla</span>
            </button>
          </div>
        </div>

        {/* Active Filters Display */}
        {(pokemonFilter.length > 0 || searchTerm) && (
          <div className="active-filters-header">
            <div className="container">
              Filtros activos:
              {searchTerm && (
                <div className="filter-chip search" >
                  <span>Búsqueda: "{searchTerm}"</span>
                </div>
              )}
              {pokemonFilter.map(type => (
                <div key={type} className={`filter-chip type ${type}`}>
                  <span>{type}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
      
      {/* Filter Overlay */}
      <FilterBar />
      
      <Outlet />
    </>
  )
}
