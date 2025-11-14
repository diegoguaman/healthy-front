# 🏗️ Arquitectura: Day Plans Implementation

## 📋 Análisis de Opciones

### Opción A: Separar en dos lugares
- **`/day-plan`**: Página para crear nuevos planes
- **`/profile`**: Sección para ver planes guardados

**Pros:**
- Separación clara de responsabilidades
- Fácil de encontrar "crear plan"

**Contras:**
- Los planes guardados están separados de donde se crean
- Menos cohesión en la UX
- El perfil puede saturarse con información

---

### Opción B: Todo en una página dedicada ⭐ **RECOMENDADA**
- **`/day-plan`**: Página completa con:
  - Sección superior: Formulario para crear nuevo plan
  - Sección inferior: Lista de planes guardados (userDayPlans)

**Pros:**
- ✅ Todo relacionado en un lugar (mejor UX)
- ✅ Sigue el patrón establecido (como GeneratedRecipes)
- ✅ Fácil navegación: crear y ver en el mismo lugar
- ✅ El perfil se mantiene limpio
- ✅ Escalable: fácil agregar más funcionalidades después

**Contras:**
- Página puede ser más compleja (pero manejable con componentes)

---

### Opción C: Mejorar CalendarPage existente
- Modificar `/calendar` para que sea específica de planes

**Pros:**
- Ya existe la ruta

**Contras:**
- CalendarPage está mezclado con eventos genéricos
- Menos claro el propósito
- Requiere refactorización mayor

---

## ✅ Decisión: Opción B

### Estructura Propuesta:

```
/day-plan (página protegida)
├── Header: "Planes de Comidas Diarios"
├── Sección Crear Plan:
│   ├── Formulario con:
│   │   ├── Selector de fecha (DatePicker)
│   │   ├── Preferencias del usuario (pre-cargadas del perfil)
│   │   └── Botón "Generar Plan"
│   └── Loading state durante generación
│
└── Sección Mis Planes:
    ├── Lista de planes guardados (userDayPlans)
    ├── Cards con:
    │   ├── Fecha del plan
    │   ├── Número de comidas
    │   ├── Vista previa de recetas
    │   └── Botón "Ver detalles"
    └── Estado vacío si no hay planes
```

### Navegación:
- Enlace en Navbar: "Planes de Comidas" o "Mi Plan"
- También accesible desde el perfil como enlace secundario

---

## 🎯 Beneficios de esta Arquitectura

1. **Cohesión:** Todo relacionado con planes en un lugar
2. **Escalabilidad:** Fácil agregar funcionalidades (editar, eliminar, duplicar planes)
3. **UX:** Flujo natural: crear → ver → gestionar
4. **Mantenibilidad:** Código organizado y fácil de mantener
5. **Consistencia:** Sigue el patrón de GeneratedRecipes

---

## 📝 Implementación

### Archivos a crear/modificar:

1. **`src/pages/DayPlanPage.jsx`** (nuevo)
   - Componente principal con ambas secciones
   - Manejo de estado para crear y listar

2. **`src/services/DayPlanService.js`** (nuevo)
   - `createDayPlan()` - ya existe en ChatService, mover aquí
   - `getUserDayPlans()` - nuevo método

3. **`src/components/DayPlanCard/DayPlanCard.jsx`** (nuevo)
   - Componente reutilizable para mostrar un plan

4. **`src/App.jsx`**
   - Agregar ruta `/day-plan`

5. **`src/components/Navbar/Navbar.jsx`**
   - Agregar enlace a "Planes de Comidas"

6. **`src/pages/CalendarPage.jsx`**
   - Opcional: mantener para eventos genéricos o redirigir a day-plan

---

## 🔄 Flujo de Usuario

1. Usuario va a `/day-plan`
2. Ve formulario para crear plan (con preferencias pre-cargadas)
3. Selecciona fecha y hace clic en "Generar Plan"
4. Ve loading state (puede tardar 1-2 minutos)
5. Plan generado aparece en la sección "Mis Planes"
6. Puede ver detalles del plan haciendo clic
7. Puede generar más planes desde el mismo lugar

---

¡Esta arquitectura es la más profesional y escalable! 🚀

