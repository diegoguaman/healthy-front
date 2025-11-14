# 🥗 HealthyApp - Aplicación de Gestión de Recetas Saludables

Aplicación web moderna desarrollada con React y Vite para la gestión personalizada de recetas saludables, planes de comidas diarios y seguimiento nutricional. Proyecto que demuestra arquitectura escalable, principios SOLID, y mejores prácticas de desarrollo frontend.

## 🚀 Características Principales

### ✨ Funcionalidades Implementadas

- **🔐 Autenticación Completa**
  - Registro y login de usuarios
  - Gestión de sesiones con JWT
  - Rutas protegidas con HOC
  - Context API para estado global de autenticación

- **🍳 Gestión de Recetas**
  - Generación de recetas personalizadas con IA
  - Sistema de recetas favoritas
  - Visualización detallada de recetas con ingredientes y pasos
  - Componentes reutilizables para cards de recetas

- **📅 Planes de Comidas Diarios**
  - Creación de planes personalizados por fecha
  - Visualización de planes guardados
  - Detalles completos de cada plan
  - Integración con calendario

- **👤 Perfil de Usuario**
  - Gestión de preferencias alimentarias
  - Visualización de datos personales
  - Actualización de información

- **📱 Diseño Responsive**
  - Adaptado para móvil, tablet y desktop
  - Grid system con Bootstrap
  - Componentes optimizados para diferentes tamaños de pantalla

## 🛠️ Stack Tecnológico

### Core
- **React 18.2** - Biblioteca UI con Hooks
- **Vite 5.2** - Build tool y dev server de alta performance
- **React Router DOM 6.23** - Enrutamiento declarativo

### HTTP & Estado
- **Axios 1.7** - Cliente HTTP con interceptores
- **Context API** - Gestión de estado global (autenticación)
- **Custom Hooks** - Lógica reutilizable encapsulada

### UI/UX
- **Bootstrap 5.3** - Framework CSS responsive
- **React Bootstrap 2.10** - Componentes Bootstrap para React
- **FontAwesome 6.5** - Iconografía profesional
- **React Icons 5.2** - Biblioteca adicional de iconos
- **React Spinners 0.13** - Loading states animados

### Utilidades
- **date-fns 2.30** - Manipulación de fechas
- **dayjs 1.11** - Alternativa ligera para fechas
- **react-big-calendar 1.13** - Componente de calendario
- **react-datepicker 7.2** - Selector de fechas

### Desarrollo
- **ESLint** - Linting y calidad de código
- **TypeScript Types** - Tipos para mejor DX

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
src/
├── components/          # Componentes reutilizables
│   ├── DayPlanCard/    # Card para planes diarios
│   ├── Input/          # Input reutilizable
│   ├── MultiStepForm/  # Formulario multi-paso
│   ├── Navbar/         # Barra de navegación
│   ├── PacmanLoading/  # Componente de carga
│   ├── RecipeCard/     # Card reutilizable de recetas
│   └── ProtectedRoute.jsx  # HOC para rutas protegidas
│
├── contexts/            # Context API providers
│   └── AuthContext.jsx # Contexto de autenticación
│
├── hooks/               # Custom hooks
│   └── useAuth.js      # Hook para acceso a autenticación
│
├── pages/               # Páginas/views
│   ├── CalendarPage.jsx
│   ├── DayPlanDetails.jsx
│   ├── DayPlanPage.jsx
│   ├── FavoriteRecipes.jsx
│   ├── GeneratedRecipes.jsx
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── RecipesDetails.jsx
│   └── UserProfile.jsx
│
├── services/            # Capa de servicios (API)
│   ├── AuthService.js
│   ├── BaseService.js   # Configuración base de Axios
│   ├── ChatService.js
│   ├── DayPlanService.js
│   ├── ProtectUserService.js
│   ├── RecipesService.js
│   └── UserService.js
│
├── stores/              # Estado global simple
│   └── AccessTokenStore.js
│
└── utils/               # Utilidades
    ├── error-handler.js # Manejo centralizado de errores
    ├── generatedRecipesStorage.js
    └── ingredientsButtons.js
```

## 🎯 Principios de Diseño Aplicados

### SOLID Principles

- **Single Responsibility**: Cada servicio maneja un dominio específico (Auth, Recipes, Chat, User, DayPlan)
- **Open/Closed**: Extensible mediante interceptores y composición de componentes
- **Liskov Substitution**: Interfaces consistentes en servicios
- **Interface Segregation**: Hooks y servicios específicos por dominio
- **Dependency Inversion**: Componentes dependen de abstracciones (hooks, servicios)

### DRY (Don't Repeat Yourself)

- **BaseService**: Instancias HTTP reutilizables con interceptores centralizados
- **RecipeCard**: Componente reutilizable usado en múltiples páginas
- **useAuth Hook**: Acceso centralizado al contexto de autenticación
- **Error Handler**: Sistema centralizado de manejo de errores

### KISS (Keep It Simple, Stupid)

- Código legible y mantenible
- Lógica simplificada sin complejidad innecesaria
- Nombres descriptivos y claros
- Separación clara de responsabilidades

## 🔧 Características Técnicas Destacadas

### 1. Arquitectura de Servicios

```javascript
// BaseService.js - Configuración centralizada de HTTP
- Instancias separadas para endpoints públicos y autenticados
- Interceptores para autenticación automática
- Manejo centralizado de errores HTTP
- Timeout configurado para evitar requests colgados
- Validación de variables de entorno
```

### 2. Gestión de Estado

```javascript
// AuthContext.jsx - Context API optimizado
- useCallback para prevenir re-renders innecesarios
- Separación de navegación del contexto (SRP)
- Hook personalizado useAuth para acceso limpio
- Validación de uso dentro del provider
```

### 3. Manejo de Errores

```javascript
// error-handler.js - Sistema centralizado
- Formateo consistente de errores
- Logging condicional (solo en desarrollo)
- Mensajes user-friendly
- Manejo de diferentes tipos de errores (API, red, etc.)
```

### 4. Componentes Reutilizables

```javascript
// RecipeCard - Componente reutilizable
- Usado en Home, FavoriteRecipes y GeneratedRecipes
- Diseño responsive con Bootstrap grid
- Lazy loading de imágenes
- Accesibilidad mejorada (ARIA labels)
```

### 5. Rutas Protegidas

```javascript
// ProtectedRoute.jsx - HOC para autenticación
- Validación de usuario autenticado
- Redirección automática al login
- Integración con AuthContext
```

## 📚 Documentación Técnica

El proyecto incluye documentación detallada sobre:

- **REFACTORING_GUIDE.md**: Explicación de refactorizaciones y principios aplicados
- **GENERATED_RECIPES_FEATURE.md**: Documentación de la feature de recetas generadas
- **DAY_PLANS_ARCHITECTURE.md**: Arquitectura de planes de comidas diarios
- **BACKEND_ENDPOINT_SPEC.md**: Especificación de endpoints del backend
- **TESTING_GUIDE.md**: Guía de pruebas y testing

## 🚀 Instalación y Uso

### Prerrequisitos

- Node.js 16+ 
- npm o yarn

### Instalación

```bash
# Clonar el repositorio
git clone <repository-url>

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env con:
VITE_API_URL=http://localhost:3000
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo con Vite

# Producción
npm run build        # Build para producción
npm run preview      # Preview del build de producción

# Calidad de código
npm run lint         # Ejecuta ESLint
```

## 🎨 Mejores Prácticas Implementadas

### Código Limpio
- ✅ Eliminación de `console.log` en producción
- ✅ Documentación JSDoc en funciones públicas
- ✅ Nombres descriptivos y consistentes
- ✅ Código auto-documentado

### Performance
- ✅ `useCallback` para optimizar re-renders
- ✅ Lazy loading de imágenes
- ✅ Componentes memoizados cuando es necesario
- ✅ Timeout en requests HTTP

### Seguridad
- ✅ Validación de tokens JWT
- ✅ Rutas protegidas
- ✅ Manejo seguro de errores (sin exponer información sensible)
- ✅ Validación de parámetros en servicios

### Accesibilidad
- ✅ ARIA labels en componentes interactivos
- ✅ Estados disabled apropiados
- ✅ Contraste adecuado en UI
- ✅ Navegación por teclado

### Testing & Calidad
- ✅ ESLint configurado con reglas estrictas
- ✅ Estructura preparada para testing
- ✅ Código testeable (separación de concerns)

## 💡 Puntos Destacados para Entrevistas Técnicas

### 1. Separación de Instancias HTTP
> "Implementé instancias HTTP separadas para endpoints públicos y autenticados, siguiendo el principio de responsabilidad única. Esto mejora el rendimiento (los endpoints públicos no necesitan interceptores de autenticación) y la claridad del código."

### 2. Hook Personalizado useAuth
> "Creé un hook personalizado `useAuth` siguiendo DRY para evitar repetir `useContext(AuthContext)` en cada componente. El hook también valida que se use correctamente dentro del provider, previniendo errores comunes en runtime."

### 3. Sistema Centralizado de Errores
> "Implementé un sistema centralizado de manejo de errores que formatea mensajes de forma consistente y solo hace logging en desarrollo. Esto asegura que los usuarios vean mensajes claros y que no expongamos información sensible en producción."

### 4. Optimización con useCallback
> "Usé `useCallback` en AuthContext para prevenir re-renders innecesarios. Sin esto, cada vez que el contexto se actualiza, todas las funciones se recrean, causando re-renders en componentes hijos que las usan."

### 5. Componentes Reutilizables
> "Refactoricé código duplicado creando componentes reutilizables como `RecipeCard`, que se usa en múltiples páginas. Esto sigue el principio DRY y facilita el mantenimiento."

## 🔄 Flujos Principales

### Autenticación
1. Usuario se registra/login → Token JWT almacenado
2. Token incluido automáticamente en requests autenticados
3. Interceptor maneja 401 y limpia sesión automáticamente

### Generación de Recetas
1. Usuario completa formulario con preferencias
2. Request a API con IA para generar recetas
3. Recetas guardadas y disponibles en "Mis recetas generadas"
4. Usuario puede marcar como favoritas

### Planes de Comidas
1. Usuario selecciona fecha y preferencias
2. Sistema genera plan completo del día
3. Plan guardado y accesible desde calendario
4. Detalles completos disponibles

## 📈 Próximas Mejoras

- [ ] Migración a TypeScript para type safety
- [ ] Implementación de tests unitarios y E2E
- [ ] Error Boundaries de React
- [ ] Optimización de imágenes con lazy loading avanzado
- [ ] Implementación de PWA (Progressive Web App)
- [ ] Internacionalización (i18n)
- [ ] Dark mode

## 👨‍💻 Autor

Desarrollado con enfoque en arquitectura escalable, código limpio y mejores prácticas de desarrollo frontend.

---

**Nota para Reclutadores**: Este proyecto demuestra competencia en React moderno, arquitectura de software, principios SOLID, y capacidad para crear aplicaciones escalables y mantenibles. El código está documentado, refactorizado siguiendo mejores prácticas, y listo para ser discutido en entrevistas técnicas.
