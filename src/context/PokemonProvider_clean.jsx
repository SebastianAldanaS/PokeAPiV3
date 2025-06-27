import { useState } from "react"
import { PokemonContext } from "./PokemonContext"
import { useEffect } from "react"
import { useForm } from "../hook/useForm"

export const PokemonProvider = ({ children }) => {

    const [globalPokemon, setGlobalPokemon] = useState([]);
    const [allPokemon, setAllPokemon] = useState([]);
    const [offset, setOffset] = useState(0);

    // Estados para paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPokemon, setTotalPokemon] = useState(0);
    const itemsPerPage = 24;

    // Estados para filtros
    const [typeFilter, setTypeFilter] = useState([]);
    const [filteredPokemon, setFilteredPokemon] = useState([]);
    const [allPokemonCache, setAllPokemonCache] = useState([]); // Cache de todos los pokemon
    const [searchResults, setSearchResults] = useState([]); // Resultados de búsqueda
    const [isSearching, setIsSearching] = useState(false); // Estado de búsqueda activa

    //Formulario de busqueda
    const {valueSearch, onInputChange, onResetForm} = useForm({
        valueSearch: ''
    })

    //Estados Simples
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState(false)

    // Cargar Pokemon con paginación
    const getAllPokemon = async (limit = 24) => {
        setLoading(true);
        try {
            const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();

            // Obtener el total de pokemon para calcular páginas
            setTotalPokemon(data.count);
            setTotalPages(Math.ceil(data.count / itemsPerPage));

            const promises = data.results.map(async (pokemon) => {
                try {
                    const res = await fetch(pokemon.url);
                    if (!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const data = await res.json();
                    return data;
                } catch (error) {
                    console.error(`Error fetching pokemon ${pokemon.name}:`, error);
                    return null;
                }
            });

            const results = await Promise.all(promises);
            // Filtrar resultados nulos
            const validResults = results.filter(pokemon => pokemon !== null);
            setAllPokemon(validResults);
            
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            // En caso de error, mostrar al menos algo
            setAllPokemon([]);
        } finally {
            // ASEGURAR que loading siempre se ponga en false
            setLoading(false);
        }
    };

    // Cargar TODOS los Pokemon para filtrado (primera vez)
    const loadAllPokemonForFiltering = async () => {
        if (allPokemonCache.length > 0) return; // Ya están cargados
        
        setLoading(true);
        const url = `https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0`; // Cargar más pokemon
        const res = await fetch(url);
        const data = await res.json();

        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            return data;
        });

        const results = await Promise.all(promises);
        const validResults = results.filter(pokemon => pokemon !== null);
        setAllPokemonCache(validResults);
        setLoading(false);
    };

    //Petición de todos los Pokemon
    const getGlobalPokemon = async () => {
        const url = `https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;

        const res = await fetch(url);
        const data = await res.json();

        const promises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            return data;
        });

        const results = await Promise.all(promises);

        setGlobalPokemon(results);
        setLoading(false);
    };

    //Pokemon por ID
    const getPokemonById = async (id) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
        const res = await fetch(url);
        const data = await res.json();
        return data;
    };

    // Navegación entre páginas
    const nextPage = () => {
        if (currentPage < totalPages) {
            const newPage = currentPage + 1;
            setCurrentPage(newPage);
            setOffset((newPage - 1) * itemsPerPage);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            const newPage = currentPage - 1;
            setCurrentPage(newPage);
            setOffset((newPage - 1) * itemsPerPage);
        }
    };

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            setOffset((page - 1) * itemsPerPage);
        }
    };

    // Información de paginación
    const getPaginationInfo = () => {
        const start = isSearching ? 
            (currentPage - 1) * itemsPerPage + 1 : 
            offset + 1;
        
        const totalItems = isSearching ? 
            searchResults.length : 
            (typeFilter.length > 0 ? filteredPokemon.length : totalPokemon);
        
        const end = isSearching ? 
            Math.min(currentPage * itemsPerPage, searchResults.length) :
            (typeFilter.length > 0 ? 
                Math.min(currentPage * itemsPerPage, filteredPokemon.length) :
                Math.min(offset + itemsPerPage, totalPokemon));

        return {
            start,
            end,
            total: totalItems,
            currentPage,
            totalPages: isSearching ? 
                Math.ceil(searchResults.length / itemsPerPage) :
                (typeFilter.length > 0 ? 
                    Math.ceil(filteredPokemon.length / itemsPerPage) :
                    totalPages)
        };
    };

    // Manejar filtros por tipo
    const handleTypeFilter = (type) => {
        if (typeFilter.includes(type)) {
            // Remover tipo del filtro
            setTypeFilter(typeFilter.filter(t => t !== type));
        } else {
            // Agregar tipo al filtro
            setTypeFilter([...typeFilter, type]);
        }
        setCurrentPage(1); // Reset página
    };

    const clearFilters = () => {
        setTypeFilter([]);
        setFilteredPokemon([]);
        setCurrentPage(1);
    };

    // Filtrar Pokemon por tipo
    const filterPokemonByType = () => {
        const filtered = allPokemonCache.filter(pokemon => {
            return typeFilter.some(type => 
                pokemon.types.some(pokemonType => pokemonType.type.name === type)
            );
        });
        setFilteredPokemon(filtered);
    };

    // Obtener Pokemon a mostrar (búsqueda, filtrados o paginados normalmente)
    const getPokemonToShow = () => {
        if (isSearching) {
            // Si hay búsqueda activa, usar resultados de búsqueda
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const result = searchResults.slice(startIndex, endIndex);
            return result;
        } else if (typeFilter.length > 0) {
            // Si hay filtros activos, usar pokemon filtrados
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            const result = filteredPokemon.slice(startIndex, endIndex);
            return result;
        } else {
            // Si no hay búsqueda ni filtros, mostrar todos los pokemon cargados
            // IMPORTANTE: No aplicar paginación aquí porque ya estamos cargando solo 24 de la API
            // La paginación se maneja cambiando el offset y haciendo una nueva petición
            if (Array.isArray(allPokemon) && allPokemon.length > 0) {
                return allPokemon;
            } else {
                return [];
            }
        }
    };

    // Búsqueda de Pokemon
    const searchPokemon = async (searchTerm) => {
        if (!searchTerm.trim()) {
            setIsSearching(false);
            setSearchResults([]);
            setCurrentPage(1);
            return;
        }

        setIsSearching(true);
        setLoading(true);

        try {
            // Buscar primero por ID exacto
            if (!isNaN(searchTerm)) {
                const pokemon = await getPokemonById(searchTerm);
                if (pokemon) {
                    setSearchResults([pokemon]);
                    setCurrentPage(1);
                    setLoading(false);
                    return;
                }
            }

            // Si no hay cache, cargarlo
            if (allPokemonCache.length === 0) {
                await loadAllPokemonForFiltering();
            }

            // Buscar por nombre
            const results = allPokemonCache.filter(pokemon => 
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setSearchResults(results);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error searching Pokemon:', error);
            setSearchResults([]);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        setCurrentPage(1);
        onResetForm();
    };

    // Efecto para búsqueda en tiempo real
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (valueSearch.trim()) {
                searchPokemon(valueSearch);
            } else {
                clearSearch();
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [valueSearch]);

    // Efecto inicial para cargar los primeros Pokemon
    useEffect(() => {
        getAllPokemon();
        
        // Timeout de seguridad para evitar loading infinito
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 segundos máximo
        
        return () => clearTimeout(timeout);
    }, []); // Sin dependencias para ejecutar solo una vez

    // Efecto para cuando cambia el offset (paginación)
    useEffect(() => {
        if (offset > 0) { // Solo cargar cuando el offset cambie después de la carga inicial
            getAllPokemon();
        }
    }, [offset]);

    // Efecto para filtrar cuando cambian los tipos seleccionados o los pokemon del cache
    useEffect(() => {
        if (typeFilter.length > 0 && allPokemonCache.length > 0) {
            filterPokemonByType();
        }
    }, [typeFilter, allPokemonCache]);

    /*useEffect(() => {
        getGlobalPokemon()
    }, [])*/

    return (
        <PokemonContext.Provider value={{
            valueSearch,
            onInputChange,
            onResetForm,
            allPokemon,
            globalPokemon,
            getPokemonById,
            loading,
            active,
            setActive,
            // Paginación
            currentPage,
            totalPages,
            totalPokemon,
            nextPage,
            prevPage,
            changePage,
            getPaginationInfo,
            // Filtros
            typeFilter,
            pokemonFilter: typeFilter, // Alias para compatibilidad
            filteredPokemon,
            handleTypeFilter,
            clearFilters,
            getPokemonToShow,
            loadAllPokemonForFiltering,
            // Búsqueda
            searchPokemon: valueSearch, // Valor de búsqueda actual
            searchPokemonFunc: searchPokemon, // Función de búsqueda
            searchResults,
            isSearching,
            clearSearch,
        }}>
            {children}
        </PokemonContext.Provider>
    )
}
