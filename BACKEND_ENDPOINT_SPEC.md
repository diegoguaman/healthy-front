# 🔧 Especificación Técnica: Endpoint `/recipes/user/generated`

## 📋 Resumen

Este documento especifica los requisitos técnicos para implementar el endpoint que permite obtener las recetas generadas por el usuario autenticado.

---

## 🌐 Endpoint

```
GET /recipes/user/generated
```

---

## 🔐 Autenticación

**Requerida:** ✅ Sí

**Tipo:** Bearer Token (JWT)

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

**Ejemplo:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📥 Request

### Método HTTP
```
GET
```

### Parámetros de URL
Ninguno

### Query Parameters
Opcionales (para futuras mejoras):
- `limit` (number): Número máximo de recetas a devolver
- `offset` (number): Número de recetas a saltar (para paginación)
- `sort` (string): Orden de resultados (`date`, `name`, `-date`, `-name`)

**Ejemplo con query parameters:**
```
GET /recipes/user/generated?limit=10&offset=0&sort=-date
```

### Body
No requiere body

---

## 📤 Response

### Estructura Exitosa (200 OK)

**Content-Type:** `application/json`

**Body:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pollo al ajillo",
    "phrase": "Un plato tradicional español lleno de sabor",
    "preparationTime": 30,
    "urlImage": "https://example.com/images/pollo-ajillo.jpg",
    "ingredients": [
      "pollo",
      "ajo",
      "aceite de oliva",
      "vino blanco",
      "perejil"
    ],
    "steps": [
      "Cortar el pollo en trozos",
      "Pelar y picar los ajos",
      "Calentar el aceite en una sartén",
      "..."
    ],
    "createdAt": "2024-12-20T10:30:00.000Z",
    "userId": "507f191e810c19729de860ea"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Ensalada mediterránea",
    "phrase": "Fresca y saludable",
    "preparationTime": 15,
    "urlImage": "https://example.com/images/ensalada-mediterranea.jpg",
    "ingredients": [
      "tomate",
      "pepino",
      "cebolla",
      "aceitunas",
      "queso feta"
    ],
    "steps": [
      "Cortar los tomates en rodajas",
      "Picar el pepino",
      "..."
    ],
    "createdAt": "2024-12-20T11:00:00.000Z",
    "userId": "507f191e810c19729de860ea"
  }
]
```

### Estructura de Objeto Receta

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | string | ✅ Sí | ID único de la receta (MongoDB ObjectId) |
| `name` | string | ✅ Sí | Nombre de la receta |
| `phrase` | string | ❌ No | Descripción corta o frase de la receta |
| `preparationTime` | number | ❌ No | Tiempo de preparación en minutos |
| `urlImage` | string | ❌ No | URL de la imagen de la receta |
| `ingredients` | array[string] | ✅ Sí | Lista de ingredientes |
| `steps` | array[string] | ✅ Sí | Lista de pasos de preparación |
| `createdAt` | string (ISO 8601) | ❌ No | Fecha de creación |
| `userId` | string | ❌ No | ID del usuario que generó la receta |

---

## 🔢 Códigos de Estado HTTP

### 200 OK
Recetas obtenidas exitosamente.

**Response Body:** Array de recetas (puede estar vacío `[]`)

**Ejemplo:**
```json
[]
```

### 401 Unauthorized
Token de autenticación inválido o faltante.

**Response Body:**
```json
{
  "message": "Unauthorized",
  "error": "Invalid or missing token"
}
```

### 404 Not Found
Endpoint no implementado (temporal, hasta que se implemente).

**Response Body:**
```json
{
  "message": "Not Found",
  "error": "Endpoint not implemented"
}
```

### 500 Internal Server Error
Error del servidor.

**Response Body:**
```json
{
  "message": "Internal Server Error",
  "error": "Error message here"
}
```

---

## 🔍 Lógica del Backend

### Pasos Recomendados:

1. **Validar Autenticación:**
   - Extraer token del header `Authorization`
   - Verificar que el token sea válido
   - Obtener el `userId` del token

2. **Consultar Base de Datos:**
   - Buscar recetas donde `userId` coincida con el usuario autenticado
   - Filtrar solo recetas generadas (no todas las recetas públicas)
   - Opcional: Ordenar por fecha de creación (más recientes primero)

3. **Formatear Response:**
   - Devolver array de recetas
   - Si no hay recetas, devolver array vacío `[]`
   - Asegurar que todas las recetas tengan la estructura esperada

### Query de Ejemplo (MongoDB):

```javascript
// Ejemplo con Mongoose
const recipes = await Recipe.find({ 
  userId: req.user._id,
  // Opcional: agregar campo para identificar recetas generadas
  // isGenerated: true
})
.sort({ createdAt: -1 }) // Más recientes primero
.limit(limit || 50)
.skip(offset || 0);
```

### Query de Ejemplo (SQL):

```sql
SELECT * FROM recipes 
WHERE user_id = :userId 
  AND is_generated = true
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;
```

---

## 🧪 Ejemplos de Prueba

### cURL

```bash
# Obtener recetas generadas
curl -X GET http://localhost:3000/recipes/user/generated \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### JavaScript (Fetch API)

```javascript
const response = await fetch('http://localhost:3000/recipes/user/generated', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const recipes = await response.json();
```

### JavaScript (Axios)

```javascript
const response = await axios.get('/recipes/user/generated', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const recipes = response.data;
```

---

## 🔄 Compatibilidad con Frontend

### Lo que el Frontend Espera:

1. **Response siempre debe ser un Array:**
   - ✅ `[]` (array vacío si no hay recetas)
   - ✅ `[{...}, {...}]` (array con recetas)
   - ❌ `null` o `undefined` (causará errores)

2. **Estructura de Receta:**
   - El frontend usa estos campos: `_id`, `name`, `phrase`, `preparationTime`, `urlImage`
   - Campos opcionales pueden ser `null` o `undefined`, pero deben existir en la estructura

3. **Manejo de Errores:**
   - El frontend maneja 404 como "endpoint no disponible" y usa localStorage como fallback
   - El frontend maneja 401 redirigiendo al login
   - El frontend maneja 500 mostrando mensaje de error

### Validación Recomendada en Backend:

```javascript
// Asegurar que siempre se devuelva un array
const recipes = await getRecipes(userId);
return res.status(200).json(Array.isArray(recipes) ? recipes : []);

// Validar estructura de cada receta antes de enviar
const validatedRecipes = recipes.map(recipe => ({
  _id: recipe._id || recipe._id.toString(),
  name: recipe.name || '',
  phrase: recipe.phrase || null,
  preparationTime: recipe.preparationTime || null,
  urlImage: recipe.urlImage || null,
  ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
  steps: Array.isArray(recipe.steps) ? recipe.steps : [],
  createdAt: recipe.createdAt || null,
  userId: recipe.userId || null
}));
```

---

## 📝 Notas de Implementación

### Consideraciones:

1. **Seguridad:**
   - ✅ Validar siempre el token JWT
   - ✅ Verificar que el usuario esté autenticado
   - ✅ Solo devolver recetas del usuario autenticado
   - ✅ No exponer información sensible

2. **Performance:**
   - ✅ Considerar paginación si hay muchas recetas
   - ✅ Indexar `userId` en la base de datos
   - ✅ Cachear resultados si es apropiado

3. **Compatibilidad:**
   - ✅ Devolver siempre un array (nunca null)
   - ✅ Mantener estructura de receta consistente con otros endpoints
   - ✅ Usar mismos nombres de campos que `/chat` endpoint

4. **Futuras Mejoras:**
   - Paginación con `limit` y `offset`
   - Filtros por fecha, ingredientes, etc.
   - Ordenamiento personalizable
   - Búsqueda dentro de recetas generadas

---

## ✅ Checklist de Implementación

- [ ] Endpoint `GET /recipes/user/generated` creado
- [ ] Middleware de autenticación aplicado
- [ ] Validación de token JWT implementada
- [ ] Query a base de datos para obtener recetas del usuario
- [ ] Filtrado por `userId` del token
- [ ] Response siempre devuelve array (vacío o con datos)
- [ ] Estructura de receta consistente con otros endpoints
- [ ] Manejo de errores (401, 404, 500)
- [ ] Tests unitarios creados
- [ ] Tests de integración creados
- [ ] Documentación actualizada

---

## 🔗 Endpoints Relacionados

- `POST /chat` - Genera recetas (devuelve estructura similar)
- `GET /recipes` - Obtiene todas las recetas públicas
- `GET /recipes/favorites` - Obtiene recetas favoritas del usuario
- `GET /recipes/:id` - Obtiene una receta específica

---

## 📚 Referencias

- Estructura de receta debe coincidir con la respuesta de `POST /chat`
- Ver `TESTING_GUIDE.md` para ejemplos de otros endpoints
- Ver `src/services/RecipesService.js` para ver cómo el frontend consume el endpoint

---

¡Listo para implementar! 🚀

