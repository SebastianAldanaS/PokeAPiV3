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
    const [isLoadingCache, setIsLoadingCache] = useState(false); // Estado de carga del cache
    const [firstSearchAttempt, setFirstSearchAttempt] = useState(false); // Primera búsqueda
    const [isInitialized, setIsInitialized] = useState(false); // Para evitar múltiples inicializaciones

    //Formulario de busqueda
    const {valueSearch, onInputChange, onResetForm} = useForm({
        valueSearch: ''
    })

    //Estados Simples
    const [loading, setLoading] = useState(true)
    const [active, setActive] = useState(false)

    // Cargar Pokemon con paginación
    const getAllPokemon = async (limit = 24) => {
        console.log('Loading Pokemon - Page:', currentPage, 'Offset:', offset);
        setLoading(true);
        try {
            const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
            console.log('Fetching URL:', url);
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Fetched data:', data.results.length, 'pokemon');

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
            console.log('Valid Pokemon loaded:', validResults.length);
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
        
        console.log('Loading Pokemon cache for filtering...');
        setIsLoadingCache(true);
        
        try {
            // Cargar menos pokemon por lotes para evitar saturar la API
            const url = `https://pokeapi.co/api/v2/pokemon?limit=500&offset=0`; // Reducido de 1000 a 500
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            
            const data = await res.json();
            console.log('Fetching', data.results.length, 'pokemon for cache...');

            // Procesar en lotes más pequeños para evitar saturar la red
            const batchSize = 20; // Procesar de 20 en 20
            const allResults = [];
            
            for (let i = 0; i < data.results.length; i += batchSize) {
                const batch = data.results.slice(i, i + batchSize);
                console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(data.results.length/batchSize)}`);
                
                const promises = batch.map(async (pokemon) => {
                    try {
                        const res = await fetch(pokemon.url);
                        if (!res.ok) {
                            console.warn(`Failed to fetch ${pokemon.name}: ${res.status}`);
                            return null;
                        }
                        const data = await res.json();
                        return data;
                    } catch (error) {
                        console.error(`Error fetching pokemon ${pokemon.name}:`, error);
                        return null;
                    }
                });

                const batchResults = await Promise.all(promises);
                const validResults = batchResults.filter(pokemon => pokemon !== null);
                allResults.push(...validResults);
                
                // Pequeña pausa entre lotes para no saturar la API
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            console.log('Pokemon cache loaded:', allResults.length, 'pokemon');
            setAllPokemonCache(allResults);
            
        } catch (error) {
            console.error('Error loading Pokemon cache:', error);
            // En caso de error, usar los pokemon ya cargados como fallback
            if (allPokemon.length > 0) {
                console.log('Using current pokemon as fallback cache');
                setAllPokemonCache([...allPokemon]);
            }
        } finally {
            setIsLoadingCache(false);
        }
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
        try {
            const url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
            const res = await fetch(url);
            
            if (!res.ok) {
                throw new Error(`Pokemon not found: ${res.status}`);
            }
            
            const data = await res.json();
            return data;
        } catch (error) {
            console.error(`Error fetching pokemon by ID ${id}:`, error.message);
            throw error; // Re-throw para que el código que llama pueda manejarlo
        }
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
        console.log('Changing to page:', page, 'Current page:', currentPage, 'Total pages:', totalPages);
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            setCurrentPage(page);
            const newOffset = (page - 1) * itemsPerPage;
            console.log('New offset:', newOffset);
            setOffset(newOffset);
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

    // Filtrar Pokemon por tipo - Solo muestra Pokemon que tengan TODOS los tipos seleccionados
    const filterPokemonByType = () => {
        const filtered = allPokemonCache.filter(pokemon => {
            // Obtener todos los tipos del Pokemon
            const pokemonTypes = pokemon.types.map(t => t.type.name);
            
            // Verificar que el Pokemon tenga TODOS los tipos seleccionados (intersección)
            return typeFilter.every(selectedType => pokemonTypes.includes(selectedType));
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

        console.log('Searching for:', searchTerm);
        setIsSearching(true);
        setLoading(true);

        try {
            // Buscar primero por ID exacto SOLO si es un número
            if (!isNaN(searchTerm) && !isNaN(parseInt(searchTerm))) {
                console.log('Searching by ID:', searchTerm);
                try {
                    const pokemon = await getPokemonById(searchTerm);
                    if (pokemon) {
                        setSearchResults([pokemon]);
                        setCurrentPage(1);
                        setLoading(false);
                        return;
                    }
                } catch (error) {
                    console.log('Pokemon ID not found:', searchTerm);
                    // Continuar con búsqueda por nombre
                }
            }

            // Si hay cache, buscar inmediatamente
            if (allPokemonCache.length > 0) {
                console.log('Searching in cache of', allPokemonCache.length, 'pokemon');
                const results = allPokemonCache.filter(pokemon => 
                    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
                );

                console.log('Search results found:', results.length);
                setSearchResults(results);
                setCurrentPage(1);
                
                // Si no encuentra en cache Y es un nombre exacto, intentar búsqueda directa
                if (results.length === 0 && /^[a-zA-Z\-]+$/.test(searchTerm)) {
                    console.log('No results in cache, trying direct API search...');
                    try {
                        const directPokemon = await getPokemonById(searchTerm.toLowerCase());
                        if (directPokemon) {
                            setSearchResults([directPokemon]);
                            console.log('Found via direct search:', directPokemon.name);
                        }
                    } catch (error) {
                        console.log('Direct search also failed for:', searchTerm);
                        setSearchResults([]);
                    }
                }
            } else {
                // Si no hay cache, cargarlo primero
                console.log('Cache empty, loading...');
                setFirstSearchAttempt(true); // Marcar que es la primera búsqueda
                await loadAllPokemonForFiltering();
                
                // Después de cargar el cache, la lógica de búsqueda se maneja en el useEffect
                // No hacer nada más aquí para evitar conflictos
                return; // Salir temprano, el useEffect manejará la búsqueda
            }
            
        } catch (error) {
            console.error('Error searching Pokemon:', error);
            setSearchResults([]);
            setLoading(false);
        } finally {
            // Solo poner loading en false si no estamos esperando que se cargue el cache
            if (!firstSearchAttempt) {
                setLoading(false);
            }
        }
    };

    const clearSearch = () => {
        setIsSearching(false);
        setSearchResults([]);
        setCurrentPage(1);
        // No llamar onResetForm aquí para evitar bucles
    };

    // Función para ejecutar búsqueda manual (solo cuando se envía el formulario)
    const executeSearch = () => {
        if (valueSearch.trim()) {
            searchPokemon(valueSearch);
        } else {
            // Solo limpiar los estados de búsqueda, no el formulario
            setIsSearching(false);
            setSearchResults([]);
            setCurrentPage(1);
        }
    };

    // Efecto para limpiar la búsqueda cuando se vacía el input manualmente
    useEffect(() => {
        // Solo limpiar si el input está vacío Y no estamos en proceso de búsqueda
        if (!valueSearch.trim() && isSearching && !loading) {
            console.log('Input cleared, clearing search results');
            setIsSearching(false);
            setSearchResults([]);
            setCurrentPage(1);
        }
    }, [valueSearch, isSearching, loading]);

    // Efecto inicial para cargar los primeros Pokemon - Corregir ejecuciones múltiples en desarrollo
    useEffect(() => {
        if (!isInitialized) {
            console.log('Initial effect running...');
            setIsInitialized(true);
            getAllPokemon();
            
            // Timeout de seguridad para evitar loading infinito
            const timeout = setTimeout(() => {
                console.log('Safety timeout triggered - setting loading to false');
                setLoading(false);
            }, 10000); // 10 segundos máximo
            
            return () => clearTimeout(timeout);
        }
    }, []); // Sin dependencias para ejecutar solo una vez

    // Efecto para cuando cambia el offset (paginación)
    useEffect(() => {
        // Solo cargar cuando el offset cambie después de la carga inicial y no estemos buscando
        // Y que no sea la primera carga (offset > 0 o currentPage > 1)
        if (!isSearching && (offset > 0 || currentPage > 1) && allPokemon.length > 0) {
            console.log('Pagination effect triggered - loading new page');
            getAllPokemon();
        }
    }, [offset, isSearching]);

    // Efecto para filtrar cuando cambian los tipos seleccionados o los pokemon del cache
    useEffect(() => {
        if (typeFilter.length > 0 && allPokemonCache.length > 0) {
            filterPokemonByType();
        }
    }, [typeFilter, allPokemonCache]);

    // Efecto para re-ejecutar búsqueda cuando el cache se carga por primera vez
    useEffect(() => {
        if (allPokemonCache.length > 0 && firstSearchAttempt && valueSearch.trim() && isSearching) {
            console.log('Cache loaded, re-executing search for:', valueSearch);
            setFirstSearchAttempt(false); // Reset el flag
            
            // Buscar en el cache recién cargado
            const results = allPokemonCache.filter(pokemon => 
                pokemon.name.toLowerCase().includes(valueSearch.toLowerCase())
            );
            
            console.log('Found', results.length, 'results after cache load');
            setSearchResults(results);
            
            // Ahora sí podemos poner loading en false
            setLoading(false);
        }
    }, [allPokemonCache, firstSearchAttempt, valueSearch, isSearching]);

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
            executeSearch, // Nueva función para ejecutar búsqueda manual
            searchResults,
            isSearching,
            isLoadingCache,
            firstSearchAttempt,
            clearSearch,
        }}>
            {children}
        </PokemonContext.Provider>
    )
}
