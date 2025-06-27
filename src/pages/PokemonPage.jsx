import React, { useContext, useEffect, useState } from 'react'
import { PokemonContext } from '../context/PokemonContext'
import { Loader, PokemonMoves } from '../components'
import { useParams, useNavigate } from 'react-router-dom'

export const PokemonPage = () => {
  const { getPokemonById } = useContext(PokemonContext)
  const [loading, setLoading] = useState(true)
  const [pokemon, setPokemon] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()

  const fetchPokemon = async (id) => {
    const data = await getPokemonById(id)
    setPokemon(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchPokemon(id)
  }, [])

  // Función para obtener el color dominante según el tipo principal
  const getTypeColor = (type) => {
    const colors = {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      bug: '#A8B820',
      normal: '#A8A878',
      poison: '#A040A0',
      electric: '#F8D030',
      ground: '#E0C068',
      fairy: '#EE99AC',
      fighting: '#C03028',
      psychic: '#F85888',
      rock: '#B8A038',
      steel: '#B8B8D0',
      ice: '#98D8D8',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      flying: '#A890F0',
    }
    return colors[type] || '#68A090'
  }

  // Traducir nombres de stats al español
  const translateStat = (statName) => {
    const translations = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Ataque Esp.',
      'special-defense': 'Defensa Esp.',
      speed: 'Velocidad'
    }
    return translations[statName] || statName
  }

  if (loading) {
    return (
      <main className='container main-pokemon'>
        <Loader />
      </main>
    )
  }

  const primaryType = pokemon.types[0].type.name
  const typeColor = getTypeColor(primaryType)

  return (
    <main className='main-pokemon-page'>
      {/* Header con botón de volver */}
      <div className="pokemon-header">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
          style={{ borderColor: typeColor, color: typeColor }}
        >
          ← Volver
        </button>
        <span className="pokemon-id">#{pokemon.id.toString().padStart(3, '0')}</span>
      </div>

      {/* Sección principal del Pokemon */}
      <div 
        className="pokemon-main-section"
        style={{ background: `linear-gradient(135deg, ${typeColor}20, ${typeColor}10)` }}
      >
        <div className="container">
          <div className="pokemon-main-content">
            {/* Imagen del Pokemon */}
            <div className="pokemon-image-container">
              <div 
                className="pokemon-image-bg"
                style={{ backgroundColor: `${typeColor}26` }} // 15% transparencia en hex
              >
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.other.home.front_default} 
                  alt={pokemon.name}
                  className="pokemon-main-image"
                />
              </div>
            </div>

            {/* Información básica */}
            <div className="pokemon-basic-info">
              <h1 className="pokemon-name" style={{ color: typeColor }}>
                {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
              </h1>
              
              <div className="pokemon-types">
                {pokemon.types.map(type => (
                  <span 
                    key={type.type.name} 
                    className="type-badge"
                    style={{ backgroundColor: getTypeColor(type.type.name) }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>

              <div className="pokemon-physical-info">
                <div className="info-card">
                  <span className="info-label">Altura</span>
                  <span className="info-value">{(pokemon.height / 10).toFixed(1)} m</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Peso</span>
                  <span className="info-value">{(pokemon.weight / 10).toFixed(1)} kg</span>
                </div>
                <div className="info-card">
                  <span className="info-label">Experiencia</span>
                  <span className="info-value">{pokemon.base_experience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de estadísticas */}
      <div className="pokemon-stats-section">
        <div className="container">
          <h2 className="section-title" style={{ color: typeColor }}>
            Estadísticas Base
          </h2>
          <div className="stats-grid">
            {pokemon.stats.map(stat => (
              <div key={stat.stat.name} className="stat-item">
                <div className="stat-info">
                  <span className="stat-name">{translateStat(stat.stat.name)}</span>
                  <span className="stat-value">{stat.base_stat}</span>
                </div>
                <div className="stat-bar-container">
                  <div 
                    className="stat-bar"
                    style={{ 
                      width: `${Math.min((stat.base_stat / 25) * 100)}%`,
                      backgroundColor: typeColor
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de habilidades */}
      <div className="pokemon-abilities-section" style={{ background: `linear-gradient(135deg, rgba(0, 0, 0, 0.8) 80%, ${typeColor} 10%)` }}>
        <div className="container">
          <h2 className="section-title" style={{ color: typeColor }}>
            Habilidades
          </h2>
          <div className="abilities-grid">
            {pokemon.abilities.map((ability, index) => (
              <div key={index} className="ability-card">
                <div className="shine-effect"></div>
                <span className="ability-name">
                  {ability.ability.name.replace('-', ' ')}
                </span>
                {ability.is_hidden && (
                  <span className="hidden-ability-badge">Oculta</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección de sprites adicionales */}
      <div className="pokemon-sprites-section">
        <div className="container">
          <h2 className="section-title" style={{ color: typeColor }}>
            Otros Sprites
          </h2>
          <div className="sprites-grid">
            {pokemon.sprites.front_default && (
              <div className="sprite-item" style={{ backgroundColor: `${typeColor}50` }}>
                <img src={pokemon.sprites.front_default} alt="Frente" />
              </div>
            )}
            {pokemon.sprites.front_shiny && (
              <div className="sprite-item" style={{ backgroundColor: `${typeColor}50` }}>
                <img src={pokemon.sprites.front_shiny} alt="Frente Shiny" />
              </div>
            )}
            {pokemon.sprites.back_default && (
              <div className="sprite-item" style={{ backgroundColor: `${typeColor}50` }}>
                <img src={pokemon.sprites.back_default} alt="Espalda" />
              </div>
            )}
            {pokemon.sprites.back_shiny && (
              <div className="sprite-item" style={{ backgroundColor: `${typeColor}50` }}>
                <img src={pokemon.sprites.back_shiny} alt="Espalda Shiny" />
              </div>
            )}
          </div>
        </div>

        {/* Movimientos del Pokémon */}
        <div className="pokemon-moves-section">
          <PokemonMoves pokemonId={pokemon.id} />
        </div>
      </div>
    </main>
  )
}
