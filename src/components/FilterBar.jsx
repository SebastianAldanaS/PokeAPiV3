import React, { useContext } from 'react'
import { PokemonContext } from '../context/PokemonContext'

export const FilterBar = () => {
  const { active, typeFilter, handleTypeFilter, clearFilters, loadAllPokemonForFiltering, setActive } = useContext(PokemonContext);

  // Lista de tipos de Pokemon con sus nombres en español
  const pokemonTypes = [
    { id: 'grass', name: 'Planta', color: '#78C850' },
    { id: 'fire', name: 'Fuego', color: '#F08030' },
    { id: 'water', name: 'Agua', color: '#6890F0' },
    { id: 'bug', name: 'Bicho', color: '#A8B820' },
    { id: 'normal', name: 'Normal', color: '#A8A878' },
    { id: 'poison', name: 'Veneno', color: '#A040A0' },
    { id: 'electric', name: 'Eléctrico', color: '#F8D030' },
    { id: 'ground', name: 'Tierra', color: '#E0C068' },
    { id: 'fairy', name: 'Hada', color: '#EE99AC' },
    { id: 'fighting', name: 'Lucha', color: '#C03028' },
    { id: 'psychic', name: 'Psíquico', color: '#F85888' },
    { id: 'rock', name: 'Roca', color: '#B8A038' },
    { id: 'steel', name: 'Acero', color: '#B8B8D0' },
    { id: 'ice', name: 'Hielo', color: '#98D8D8' },
    { id: 'ghost', name: 'Fantasma', color: '#705898' },
    { id: 'dragon', name: 'Dragón', color: '#7038F8' },
    { id: 'dark', name: 'Siniestro', color: '#705848' },
    { id: 'flying', name: 'Volador', color: '#A890F0' },
  ];

  const handleCheckboxChange = (type) => {
    handleTypeFilter(type);
    // Cargar todos los pokemon si es la primera vez que se usa un filtro
    loadAllPokemonForFiltering();
  };

  const handleClose = () => {
    setActive(false);
  };

  const handleBackdropClick = (e) => {
    // Cerrar si se hace clic en el fondo negro (backdrop)
    if (e.target === e.currentTarget) {
      setActive(false);
    }
  };

  return (
    <div className={`container-filters ${active ? 'active' : ''}`} onClick={handleBackdropClick}>
      <div className="filter-content">
        <div className="filter-header">
          <h3>Filtrar por tipo</h3>
          <div className="filter-header-actions">
            {typeFilter.length > 0 && (
              <button className="clear-filters-btn" onClick={clearFilters}>
                Limpiar ({typeFilter.length})
              </button>
            )}
            <button className="close-filter-btn" onClick={handleClose}>
              ✕
            </button>
          </div>
        </div>
        
        <div className="filter-by-type">
          {pokemonTypes.map((type) => (
            <div key={type.id} className="group-type">
              <input 
                type="checkbox" 
                id={type.id} 
                name={type.id}
                checked={typeFilter.includes(type.id)}
                onChange={() => handleCheckboxChange(type.id)}
              />
              <label 
                htmlFor={type.id}
                className="type-label"
                style={{ 
                  backgroundColor: typeFilter.includes(type.id) ? type.color : 'white',
                  borderColor: type.color,
                  color: typeFilter.includes(type.id) ? 'white' : type.color
                }}
              >
                {type.name}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
