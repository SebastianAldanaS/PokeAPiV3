import React from 'react'
import { Pagination } from '../components'
import { PokemonList } from '../components/PokemonList'

export const HomePage = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <span className="gradient-text">Pokédex</span>
          </h1>
          <p className="hero-subtitle">
            Descubre y explora el fascinante mundo de los Pokémon
          </p>
        </div>
        <div className="hero-image">
          <div className="pokeball-animation">
            <div className="pokeball">
              <div className="pokeball-top"></div>
              <div className="pokeball-middle">
                <div className="pokeball-center"></div>
              </div>
              <div className="pokeball-bottom"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="container">
          <PokemonList />
          <Pagination />
        </div>
      </div>
    </div>
  )
}
