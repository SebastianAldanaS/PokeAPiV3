import React from 'react'

export const SearchPage = () => {

  const location = useLocation()
  console.log(location)

  const {globalPokemons} = useGlobalContext(PokemonContext)

  const filteredPokemons = globalPokemons.filter(pokemon => {
    return pokemon.name.toLowerCase().includes(location.state)
  })

  return (
    <div>SearchPage</div>
  )
}
