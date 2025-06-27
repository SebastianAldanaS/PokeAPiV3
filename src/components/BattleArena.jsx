import React, { useState, useEffect } from 'react';

export const BattleArena = () => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [enemyPokemon, setEnemyPokemon] = useState(null);
  const [battleLog, setBattleLog] = useState([]);
  const [currentTurn, setCurrentTurn] = useState('player');
  const [battlePhase, setBattlePhase] = useState('setup'); // setup, battle, finished
  const [playerHP, setPlayerHP] = useState(100);
  const [enemyHP, setEnemyHP] = useState(100);
  const [isAnimating, setIsAnimating] = useState(false);
  const [damageAnimation, setDamageAnimation] = useState({ player: false, enemy: false });
  const [useAnimatedSprites, setUseAnimatedSprites] = useState(true);

  // Pokémon de ejemplo para la demo
  const demoPokemons = [
    { id: 25, name: 'pikachu' },
    { id: 6, name: 'charizard' },
    { id: 9, name: 'blastoise' },
    { id: 3, name: 'venusaur' }
  ];

  // Cargar datos de un Pokémon
  const loadPokemon = async (pokemonId) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
      const data = await response.json();
      
      // Obtener algunos movimientos
      const movePromises = data.moves.slice(0, 4).map(async (moveEntry) => {
        try {
          const moveResponse = await fetch(moveEntry.move.url);
          const moveData = await moveResponse.json();
          return {
            name: moveData.name,
            displayName: moveData.names.find(n => n.language.name === 'es')?.name || 
                        moveData.names.find(n => n.language.name === 'en')?.name || 
                        moveData.name,
            power: moveData.power || 40,
            accuracy: moveData.accuracy || 100,
            type: moveData.type.name,
            damageClass: moveData.damage_class.name
          };
        } catch {
          return {
            name: 'tackle',
            displayName: 'Placaje',
            power: 40,
            accuracy: 100,
            type: 'normal',
            damageClass: 'physical'
          };
        }
      });

      const moves = await Promise.all(movePromises);

      return {
        id: data.id,
        name: data.name,
        displayName: data.name.charAt(0).toUpperCase() + data.name.slice(1),
        sprites: {
          front_default: data.sprites.front_default,
          back_default: data.sprites.back_default,
          front_animated: data.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default || data.sprites.front_default,
          back_animated: data.sprites.versions?.['generation-v']?.['black-white']?.animated?.back_default || data.sprites.back_default,
          showdown_front: data.sprites.other?.showdown?.front_default || data.sprites.front_default,
          showdown_back: data.sprites.other?.showdown?.back_default || data.sprites.back_default
        },
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat
        },
        types: data.types.map(t => t.type.name),
        moves: moves.filter(move => move !== null)
      };
    } catch (error) {
      console.error('Error loading Pokemon:', error);
      return null;
    }
  };

  // Inicializar batalla con Pokémon aleatorios
  const initializeBattle = async () => {
    setBattleLog(['¡La batalla está a punto de comenzar!']);
    
    const randomPlayer = demoPokemons[Math.floor(Math.random() * demoPokemons.length)];
    let randomEnemy = demoPokemons[Math.floor(Math.random() * demoPokemons.length)];
    
    // Asegurar que no sean el mismo Pokémon
    while (randomEnemy.id === randomPlayer.id) {
      randomEnemy = demoPokemons[Math.floor(Math.random() * demoPokemons.length)];
    }

    const playerData = await loadPokemon(randomPlayer.id);
    const enemyData = await loadPokemon(randomEnemy.id);

    if (playerData && enemyData) {
      setPlayerPokemon(playerData);
      setEnemyPokemon(enemyData);
      setPlayerHP(playerData.stats.hp);
      setEnemyHP(enemyData.stats.hp);
      setBattlePhase('battle');
      
      setBattleLog(prev => [
        ...prev,
        `¡${playerData.displayName} entró en batalla!`,
        `¡El oponente envió a ${enemyData.displayName}!`
      ]);
    }
  };

  // Cálculo de efectividad de tipos (simplificado)
  const getTypeEffectiveness = (attackType, defenderTypes) => {
    const effectiveness = {
      fire: { grass: 2, water: 0.5, fire: 0.5 },
      water: { fire: 2, grass: 0.5, water: 0.5 },
      grass: { water: 2, fire: 0.5, grass: 0.5 },
      electric: { water: 2, grass: 0.5, electric: 0.5 },
      normal: {}
    };

    let multiplier = 1;
    defenderTypes.forEach(defType => {
      if (effectiveness[attackType] && effectiveness[attackType][defType]) {
        multiplier *= effectiveness[attackType][defType];
      }
    });

    return multiplier;
  };

  // Calcular daño
  const calculateDamage = (attacker, defender, move) => {
    const level = 50;
    const attack = move.damageClass === 'physical' ? attacker.stats.attack : attacker.stats.specialAttack;
    const defense = move.damageClass === 'physical' ? defender.stats.defense : defender.stats.specialDefense;
    
    const typeEffectiveness = getTypeEffectiveness(move.type, defender.types);
    const isCritical = Math.random() < 0.0625; // 1/16 chance
    const randomFactor = Math.random() * 0.15 + 0.85; // 85-100%
    
    const baseDamage = ((((2 * level + 10) / 250) * (attack / defense) * move.power) + 2);
    let finalDamage = Math.floor(baseDamage * typeEffectiveness * randomFactor);
    
    if (isCritical) {
      finalDamage = Math.floor(finalDamage * 1.5);
    }
    
    return {
      damage: Math.max(1, finalDamage),
      isCritical,
      effectiveness: typeEffectiveness
    };
  };

  // Función para obtener el sprite correcto
  const getSprite = (pokemon, isPlayer) => {
    if (!pokemon || !pokemon.sprites) return '';
    
    if (useAnimatedSprites) {
      return isPlayer ? 
        (pokemon.sprites.back_animated || pokemon.sprites.back_default) :
        (pokemon.sprites.front_animated || pokemon.sprites.front_default);
    } else {
      return isPlayer ? pokemon.sprites.back_default : pokemon.sprites.front_default;
    }
  };

  // Ejecutar ataque
  const executeAttack = (move, isPlayerAttacking) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const attacker = isPlayerAttacking ? playerPokemon : enemyPokemon;
    const defender = isPlayerAttacking ? enemyPokemon : playerPokemon;
    
    // Verificar si el ataque acierta
    const hitChance = Math.random() * 100;
    if (hitChance > move.accuracy) {
      setBattleLog(prev => [...prev, `¡${attacker.displayName} falló el ataque!`]);
      setCurrentTurn(isPlayerAttacking ? 'enemy' : 'player');
      setIsAnimating(false);
      return;
    }

    const result = calculateDamage(attacker, defender, move);
    
    setBattleLog(prev => [
      ...prev,
      `¡${attacker.displayName} usó ${move.displayName}!`,
      ...(result.isCritical ? ['¡Golpe crítico!'] : []),
      ...(result.effectiveness > 1 ? ['¡Es súper efectivo!'] : 
         result.effectiveness < 1 ? ['No es muy efectivo...'] : [])
    ]);

    // Animación de ataque
    setTimeout(() => {
      // Activar animación de daño en el defensor
      setDamageAnimation(prev => ({
        ...prev,
        [isPlayerAttacking ? 'enemy' : 'player']: true
      }));
      
      // Aplicar daño
      if (isPlayerAttacking) {
        setEnemyHP(prev => {
          const newHP = Math.max(0, prev - result.damage);
          if (newHP <= 0) {
            setBattleLog(prev => [...prev, `¡${enemyPokemon.displayName} se debilitó!`, '¡Ganaste la batalla!']);
            setBattlePhase('finished');
          }
          return newHP;
        });
      } else {
        setPlayerHP(prev => {
          const newHP = Math.max(0, prev - result.damage);
          if (newHP <= 0) {
            setBattleLog(prev => [...prev, `¡${playerPokemon.displayName} se debilitó!`, '¡Perdiste la batalla!']);
            setBattlePhase('finished');
          }
          return newHP;
        });
      }
      
      // Desactivar animación de daño después de un tiempo
      setTimeout(() => {
        setDamageAnimation({ player: false, enemy: false });
        setCurrentTurn(isPlayerAttacking ? 'enemy' : 'player');
        setIsAnimating(false);
      }, 800);
    }, 600);
  };

  // IA simple para el enemigo
  useEffect(() => {
    if (currentTurn === 'enemy' && battlePhase === 'battle' && enemyPokemon && !isAnimating) {
      const randomMove = enemyPokemon.moves[Math.floor(Math.random() * enemyPokemon.moves.length)];
      
      setTimeout(() => {
        executeAttack(randomMove, false);
      }, 1500);
    }
  }, [currentTurn, battlePhase, enemyPokemon, isAnimating]);

  if (battlePhase === 'setup') {
    return (
      <div className="battle-setup">
        <h2>¡Arena de Batalla Pokémon!</h2>
        <p>Prepárate para una batalla épica con Pokémon aleatorios</p>
        <button className="start-battle-btn" onClick={initializeBattle}>
          ¡Comenzar Batalla!
        </button>
      </div>
    );
  }

  if (!playerPokemon || !enemyPokemon) {
    return (
      <div className="battle-loading">
        <div className="pokeball-loader"></div>
        <p>Cargando Pokémon...</p>
      </div>
    );
  }

  return (
    <div className="battle-arena">
      {/* Campo de batalla */}
      <div className="battle-field">
        {/* Pokémon del jugador */}
        <div className="player-pokemon">
          <div className={`pokemon-sprite ${isAnimating && currentTurn === 'enemy' ? 'attack-animation' : ''} ${damageAnimation.player ? 'damage-animation' : ''}`}>
            <img src={getSprite(playerPokemon, true)} alt={playerPokemon.name} />
            {damageAnimation.player && <div className="damage-effect"></div>}
          </div>
          <div className="pokemon-info">
            <h3>{playerPokemon.displayName}</h3>
            <div className="hp-bar">
              <div className="hp-fill" style={{ width: `${(playerHP / playerPokemon.stats.hp) * 100}%` }}></div>
            </div>
            <span className="hp-text">{playerHP}/{playerPokemon.stats.hp}</span>
          </div>
        </div>

        {/* Pokémon enemigo */}
        <div className="enemy-pokemon">
          <div className="pokemon-info">
            <h3>{enemyPokemon.displayName}</h3>
            <div className="hp-bar">
              <div className="hp-fill" style={{ width: `${(enemyHP / enemyPokemon.stats.hp) * 100}%` }}></div>
            </div>
            <span className="hp-text">{enemyHP}/{enemyPokemon.stats.hp}</span>
          </div>
          <div className={`pokemon-sprite ${isAnimating && currentTurn === 'player' ? 'attack-animation' : ''} ${damageAnimation.enemy ? 'damage-animation' : ''}`}>
            <img src={getSprite(enemyPokemon, false)} alt={enemyPokemon.name} />
            {damageAnimation.enemy && <div className="damage-effect"></div>}
          </div>
        </div>
      </div>

      {/* UI de batalla */}
      <div className="battle-ui">
        {/* Log de batalla */}
        <div className="battle-log">
          {battleLog.slice(-3).map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>

        {/* Controles */}
        <div className="battle-controls">
          {battlePhase === 'battle' && currentTurn === 'player' && !isAnimating && (
            <div className="move-selection">
              <h4>Selecciona un movimiento:</h4>
              <div className="moves-grid">
                {playerPokemon.moves.map((move, index) => (
                  <button
                    key={index}
                    className={`move-btn ${move.type}`}
                    onClick={() => executeAttack(move, true)}
                  >
                    <span className="move-name">{move.displayName}</span>
                    <span className="move-power">Poder: {move.power}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {battlePhase === 'finished' && (
            <div className="battle-finished">
              <button className="restart-btn" onClick={() => window.location.reload()}>
                Nueva Batalla
              </button>
            </div>
          )}

          {/* Controles de configuración */}
          <div className="battle-settings">
            <button 
              className={`sprite-toggle-btn ${useAnimatedSprites ? 'active' : ''}`}
              onClick={() => setUseAnimatedSprites(!useAnimatedSprites)}
            >
              {useAnimatedSprites ? '🎬 Sprites Animados' : '🖼️ Sprites Estáticos'}
            </button>
          </div>

          {currentTurn === 'enemy' && battlePhase === 'battle' && (
            <div className="enemy-turn">
              <p>Es el turno del oponente...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
