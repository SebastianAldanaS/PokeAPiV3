import React from 'react'

export const Loader = () => {
  return (
    <div className="loader-container">
      <div className="pokeball-loader">
        <div className="pokeball-loader-top"></div>
        <div className="pokeball-loader-bottom"></div>
        <div className="pokeball-loader-center">
          <div className="pokeball-loader-inner"></div>
        </div>
      </div>
      <div className="loader-text">
        <h3>Cargando Pokémon...</h3>
        <p>¡Preparando la Pokédex para ti!</p>
      </div>
    </div>
  )
}
