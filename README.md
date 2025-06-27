# 🔥 Pokédex Moderna - React + Vite

Una Pokédex moderna, responsiva y elegante construida con React, Vite y la PokéAPI. Diseñada con una interfaz de usuario moderna y una experiencia de usuario optimizada.

## ✨ Características Principales

### 🎨 Diseño Moderno y Responsivo
- **Interfaz elegante** con gradientes, sombras y animaciones suaves
- **Completamente responsivo** - Optimizado para desktop, tablet y móvil
- **Tarjetas de Pokémon rediseñadas** con efectos hover y colores dinámicos por tipo
- **Hero section** con animación de Pokébola
- **Loader moderno** con animación de Pokébola

### 🔍 Funcionalidades Avanzadas
- **Búsqueda en tiempo real** con debouncing para mejor rendimiento
- **Filtrado por tipo con lógica AND** - Muestra Pokémon que tengan todos los tipos seleccionados
- **Paginación completa** - Funciona sobre todos los Pokémon, resultados de búsqueda y filtros
- **Cache inteligente** para filtros y búsquedas
- **Limpieza automática** de búsquedas y filtros

### 📱 Experiencia de Usuario
- **Navegación intuitiva** con indicadores visuales de filtros activos
- **FilterBar mejorado** con fondo elegante y cierre fácil
- **Página de detalles rediseñada** con estadísticas visuales y sprites
- **Estados de carga optimizados** con skeletons
- **Manejo de errores** con error boundary

### ⚡ Rendimiento
- **Service Worker** para cache de API requests
- **Debouncing** en búsquedas para mejor rendimiento
- **Lazy loading** y optimizaciones de render
- **Memoización** para prevenir re-renders innecesarios

## 🚀 Tecnologías Utilizadas

- **React 18** - Librería principal
- **Vite** - Build tool y dev server
- **React Router DOM** - Navegación
- **Context API** - Manejo de estado global
- **PokéAPI** - Datos de Pokémon
- **CSS3** - Estilos modernos con flexbox/grid
- **Service Worker** - Cache offline

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes reutilizables
│   ├── CardPokemon.jsx      # Tarjeta de Pokémon
│   ├── FilterBar.jsx        # Barra de filtros
│   ├── Loader.jsx           # Componente de carga
│   ├── Navigation.jsx       # Header con búsqueda
│   ├── Pagination.jsx       # Paginación
│   ├── PokemonList.jsx      # Lista/Grid de Pokémon
│   ├── PokemonSkeleton.jsx  # Loading skeletons
│   └── ErrorBoundary.jsx    # Manejo de errores
├── context/         # Context API
│   ├── PokemonContext.jsx   # Contexto
│   └── PokemonProvider.jsx  # Provider con lógica
├── hooks/          # Custom hooks
│   ├── useForm.js          # Hook para formularios
│   └── useDocumentTitle.js # Hook para títulos dinámicos
├── pages/          # Páginas principales
│   ├── HomePage.jsx        # Página principal
│   ├── PokemonPage.jsx     # Página de detalles
│   └── SearchPage.jsx      # Página de búsqueda
├── utils/          # Utilidades
│   └── helpers.js          # Funciones helper
└── index.css       # Estilos globales
```

## 🎯 Funcionalidades Implementadas

### 1. **Búsqueda Avanzada**
- Búsqueda por nombre en tiempo real
- Debouncing para mejor rendimiento
- Limpieza automática de resultados
- Indicadores visuales de búsqueda activa

### 2. **Filtrado por Tipo**
- Filtros múltiples con lógica AND
- Chips visuales de filtros activos
- Cache de todos los Pokémon para filtrado rápido
- Contador de filtros aplicados

### 3. **Paginación Completa**
- Paginación sobre todos los resultados
- Funciona con búsquedas y filtros
- Navegación intuitiva con números de página
- Información de totales

### 4. **Páginas Rediseñadas**
- **HomePage**: Hero section, controles modernos, resumen de resultados
- **PokemonPage**: Diseño moderno con stats visuales, sprites y habilidades
- **Tarjetas**: Badges de tipo, preview de stats, efectos hover elegantes

### 5. **UX/UI Mejoradas**
- Animaciones suaves y transiciones
- Estados de carga con skeletons
- Responsive design completo
- Accesibilidad mejorada
- Manejo de errores robusto

## 🛠️ Instalación y Uso

```bash
# Clonar el repositorio
git clone [repository-url]

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de producción
npm run preview
```

## 🎨 Personalización

El proyecto utiliza CSS variables para fácil personalización de colores y temas. Los colores de tipos de Pokémon están definidos en `src/utils/helpers.js`.

## 📱 Compatibilidad

- ✅ Chrome (último)
- ✅ Firefox (último)  
- ✅ Safari (último)
- ✅ Edge (último)
- ✅ Dispositivos móviles

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting con ESLint

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir los cambios que te gustaría hacer.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

---

**Desarrollado con ❤️ usando React + Vite**
