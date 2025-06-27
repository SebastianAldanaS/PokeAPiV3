import React, { useState, useEffect } from 'react';

export const PokemonMoves = ({ pokemonId }) => {
  const [moves, setMoves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMoves, setSelectedMoves] = useState([]);

  const fetchPokemonMoves = async () => {
    if (!pokemonId) return;
    
    setLoading(true);
    try {
      // Obtener el Pokemon
      const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      const pokemonData = await pokemonResponse.json();
      
      // Obtener solo los primeros 6 movimientos para no saturar la API
      const movePromises = pokemonData.moves.slice(0, 6).map(async (moveEntry) => {
        try {
          const moveResponse = await fetch(moveEntry.move.url);
          const moveData = await moveResponse.json();
          return {
            name: moveData.name,
            displayName: moveData.names.find(n => n.language.name === 'es')?.name || 
                        moveData.names.find(n => n.language.name === 'en')?.name || 
                        moveData.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            pp: moveData.pp,
            type: moveData.type.name,
            damageClass: moveData.damage_class.name,
            effect: moveData.effect_entries.find(e => e.language.name === 'es')?.short_effect || 
                    moveData.effect_entries.find(e => e.language.name === 'en')?.short_effect || 
                    'No hay descripción disponible'
          };
        } catch (error) {
          console.error(`Error fetching move ${moveEntry.move.name}:`, error);
          return null;
        }
      });

      const movesData = await Promise.all(movePromises);
      setMoves(movesData.filter(move => move !== null));
    } catch (error) {
      console.error('Error fetching Pokemon moves:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonMoves();
  }, [pokemonId]);

  const getTypeColor = (type) => {
    const typeColors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC'
    };
    return typeColors[type] || '#68A090';
  };

  const translateType = (type) => {
    const typeTranslations = {
      normal: 'Normal',
      fire: 'Fuego',
      water: 'Agua',
      electric: 'Eléctrico',
      grass: 'Planta',
      ice: 'Hielo',
      fighting: 'Lucha',
      poison: 'Veneno',
      ground: 'Tierra',
      flying: 'Volador',
      psychic: 'Psíquico',
      bug: 'Bicho',
      rock: 'Roca',
      ghost: 'Fantasma',
      dragon: 'Dragón',
      dark: 'Siniestro',
      steel: 'Acero',
      fairy: 'Hada'
    };
    return typeTranslations[type] || type;
  };

  const getDamageClassIcon = (damageClass) => {
    switch (damageClass) {
      case 'physical':
        return '💪';
      case 'special':
        return '✨';
      case 'status':
        return '🛡️';
      default:
        return '❓';
    }
  };

  const translateDamageClass = (damageClass) => {
    const damageClassTranslations = {
      physical: 'Físico',
      special: 'Especial',
      status: 'Estado'
    };
    return damageClassTranslations[damageClass] || damageClass;
  };

  if (loading) {
    return (
      <div className="pokemon-moves-loading">
        <div className="loading-spinner"></div>
        <p>Cargando movimientos...</p>
      </div>
    );
  }

  if (moves.length === 0) {
    return (
      <div className="pokemon-moves-empty">
        <p>No se encontraron movimientos para este Pokémon.</p>
      </div>
    );
  }

  return (
    <div className="pokemon-moves">
      <h3>Movimientos del Pokémon</h3>
      <div className="moves-grid">
        {moves.map((move, index) => (
          <div key={index} className="move-card">
            <div className="move-header">
              <h4 className="move-name">{move.displayName}</h4>
              <span 
                className="move-type" 
                style={{ backgroundColor: getTypeColor(move.type) }}
              >
                {translateType(move.type)}
              </span>
            </div>
            
            <div className="move-stats">
              <div className="stat">
                <span className="stat-label">Poder:</span>
                <span className="stat-value">
                  {move.power ? `${move.power}` : 'N/A'}
                </span>
              </div>
              
              <div className="stat">
                <span className="stat-label">Precisión:</span>
                <span className="stat-value">
                  {move.accuracy ? `${move.accuracy}%` : 'N/A'}
                </span>
              </div>
              
              <div className="stat">
                <span className="stat-label">PP:</span>
                <span className="stat-value">{move.pp}</span>
              </div>
              
              <div className="stat">
                <span className="stat-label">Clase:</span>
                <span className="stat-value">
                  {getDamageClassIcon(move.damageClass)} {translateDamageClass(move.damageClass)}
                </span>
              </div>
            </div>
            
            <div className="move-effect">
              <p>{move.effect}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
