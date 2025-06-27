// Performance utilities
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Type color utilities
export const getTypeColor = (type) => {
  const typeColors = {
    normal: '#A8A878',
    fighting: '#C03028',
    flying: '#A890F0',
    poison: '#A040A0',
    ground: '#E0C068',
    rock: '#B8A038',
    bug: '#A8B820',
    ghost: '#705898',
    steel: '#B8B8D0',
    fire: '#F08030',
    water: '#6890F0',
    grass: '#78C850',
    electric: '#F8D030',
    psychic: '#F85888',
    ice: '#98D8D8',
    dragon: '#7038F8',
    dark: '#705848',
    fairy: '#EE99AC',
    unknown: '#68A090',
    shadow: '#604E82'
  };
  
  return typeColors[type] || '#68A090';
};

// Format number utilities
export const formatNumber = (num) => {
  return num.toString().padStart(3, '0');
};

export const formatHeight = (height) => {
  return `${(height / 10).toFixed(1)} m`;
};

export const formatWeight = (weight) => {
  return `${(weight / 10).toFixed(1)} kg`;
};

// Pokemon stat utilities
export const getStatColor = (statName) => {
  const statColors = {
    hp: '#FF5959',
    attack: '#F5AC78',
    defense: '#FAE078',
    'special-attack': '#9DB7F5',
    'special-defense': '#A7DB8D',
    speed: '#FA92B2'
  };
  
  return statColors[statName] || '#68A090';
};

export const getStatAbbreviation = (statName) => {
  const abbreviations = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    'special-attack': 'S.ATK',
    'special-defense': 'S.DEF',
    speed: 'SPD'
  };
  
  return abbreviations[statName] || statName.toUpperCase();
};
