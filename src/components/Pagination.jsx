import React, { useContext } from 'react';
import { PokemonContext } from '../context/PokemonContext';

export const Pagination = () => {
  const { 
    currentPage, 
    nextPage, 
    prevPage, 
    changePage,
    getPaginationInfo
  } = useContext(PokemonContext);

  const paginationInfo = getPaginationInfo();
  const { totalPages, totalPokemon } = paginationInfo;

  // Generar números de página a mostrar
  const getPageNumbers = () => {
    const pageNumbers = [];
    const showPages = 5; // Mostrar 5 páginas como máximo
    
    let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
    let endPage = Math.min(totalPages, startPage + showPages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage < showPages - 1) {
      startPage = Math.max(1, endPage - showPages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        <span>
          Página {currentPage} de {totalPages} - Total: {totalPokemon} Pokémon
        </span>
      </div>
      
      <div className="pagination-controls">
        {/* Botón Primera página */}
        <button 
          onClick={() => changePage(1)}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Primera página"
        >
          ⏮️
        </button>

        {/* Botón Anterior */}
        <button 
          onClick={prevPage}
          disabled={currentPage === 1}
          className="pagination-btn"
          title="Página anterior"
        >
          ⬅️
        </button>

        {/* Números de página */}
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => changePage(pageNum)}
            className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}

        {/* Botón Siguiente */}
        <button 
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Página siguiente"
        >
          ➡️
        </button>

        {/* Botón Última página */}
        <button 
          onClick={() => changePage(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
          title="Última página"
        >
          ⏭️
        </button>
      </div>
    </div>
  );
};
