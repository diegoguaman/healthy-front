# 📋 Especificación: Endpoint para Obtener Plan Diario por ID

## 🎯 Objetivo

Implementar un endpoint para obtener un plan diario específico por su ID, evitando tener que cargar todos los planes del usuario solo para obtener uno.

---

## 📡 Endpoint Requerido

### **GET** `/userDayPlans/:id`

Obtiene un plan diario específico del usuario autenticado por su ID.

---

## 🔐 Autenticación

**Requerida:** ✅ Sí

**Headers:**
```
Authorization: Bearer {JWT_TOKEN}
```

---

## 📥 Request

### Parámetros de URL

| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|-----------|-------------|
| `id` | string | ✅ Sí | ID del plan diario (MongoDB ObjectId) |

### Ejemplo de Request

```http
GET /userDayPlans/6915b2af13f42fee2e7c3d22
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📤 Response

### 200 OK - Plan encontrado

**Body:**
```json
{
  "_id": "6915b2af13f42fee2e7c3d22",
  "date": "2024-12-20T00:00:00.000Z",
  "userId": "507f191e810c19729de860ea",
  "meals": [
    {
      "time": "08:00:00",
      "type": "breakfast",
      "meal": {
        "name": "Desayuno saludable",
        "recipe": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Avena con frutas",
          "phrase": "Un desayuno nutritivo y energético",
          "preparationTime": 10,
          "urlImage": "https://example.com/images/avena-frutas.jpg",
          "ingredients": [
            "avena",
            "plátano",
            "fresas",
            "miel",
            "leche"
          ],
          "steps": [
            "Cocer la avena con leche",
            "Cortar las frutas",
            "Servir y añadir miel"
          ]
        }
      }
    },
    {
      "time": "13:00:00",
      "type": "lunch",
      "meal": {
        "name": "Almuerzo equilibrado",
        "recipe": {
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
          ]
        }
      }
    }
  ],
  "createdAt": "2024-12-20T10:30:00.000Z"
}
```

### 404 Not Found - Plan no encontrado

**Body:**
```json
{
  "message": "Plan no encontrado",
  "statusCode": 404
}
```

### 401 Unauthorized - Token inválido o expirado

**Body:**
```json
{
  "message": "No autorizado",
  "statusCode": 401
}
```

### 403 Forbidden - Plan pertenece a otro usuario

**Body:**
```json
{
  "message": "No tienes acceso a este plan",
  "statusCode": 403
}
```

---

## 🏗️ Estructura de Datos

### Objeto Plan Diario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | string | ✅ Sí | ID único del plan (MongoDB ObjectId) |
| `date` | string (ISO 8601) | ✅ Sí | Fecha del plan |
| `userId` | string | ✅ Sí | ID del usuario propietario |
| `meals` | array[Meal] | ✅ Sí | Array de comidas del día |
| `createdAt` | string (ISO 8601) | ❌ No | Fecha de creación del plan |

### Objeto Meal

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `time` | string (HH:mm:ss) | ✅ Sí | Hora de la comida |
| `type` | string | ✅ Sí | Tipo de comida: "breakfast", "lunch", "dinner", "snack" |
| `meal` | object | ✅ Sí | Objeto con información de la comida |

### Objeto Meal.meal

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | string | ✅ Sí | Nombre de la comida |
| `recipe` | object | ✅ Sí | Objeto receta completo |

### Objeto Recipe (dentro de meal.meal.recipe)

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `_id` | string | ✅ Sí | ID único de la receta |
| `name` | string | ✅ Sí | Nombre de la receta |
| `phrase` | string | ❌ No | Descripción corta |
| `preparationTime` | number | ❌ No | Tiempo de preparación en minutos |
| `urlImage` | string | ❌ No | URL de la imagen |
| `ingredients` | array[string] | ✅ Sí | Lista de ingredientes |
| `steps` | array[string] | ✅ Sí | Lista de pasos de preparación |

---

## 🔒 Validaciones Requeridas

1. **Autenticación:**
   - ✅ Verificar que el token JWT sea válido
   - ✅ Extraer el userId del token

2. **Autorización:**
   - ✅ Verificar que el plan pertenezca al usuario autenticado
   - ✅ Si no pertenece, devolver 403 Forbidden

3. **Validación de ID:**
   - ✅ Verificar que el ID sea un ObjectId válido de MongoDB
   - ✅ Si no es válido, devolver 400 Bad Request

4. **Existencia del Plan:**
   - ✅ Verificar que el plan exista en la base de datos
   - ✅ Si no existe, devolver 404 Not Found

---

## 💻 Ejemplos de Implementación

### Node.js + Express + Mongoose

```javascript
// routes/dayPlanRoutes.js
router.get('/userDayPlans/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id; // Del token JWT

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: 'ID de plan inválido',
        statusCode: 400
      });
    }

    // Buscar plan
    const plan = await DailyMealPlan.findOne({
      _id: id,
      userId: userId
    }).populate({
      path: 'meals.meal.recipe',
      model: 'Recipe'
    });

    if (!plan) {
      return res.status(404).json({
        message: 'Plan no encontrado',
        statusCode: 404
      });
    }

    res.status(200).json(plan);
  } catch (error) {
    console.error('Error fetching day plan:', error);
    res.status(500).json({
      message: 'Error al obtener el plan',
      statusCode: 500
    });
  }
});
```

### NestJS

```typescript
// day-plan.controller.ts
@Get('userDayPlans/:id')
@UseGuards(JwtAuthGuard)
async getDayPlanById(
  @Param('id') id: string,
  @Request() req: any
): Promise<DailyMealPlan> {
  if (!isValidObjectId(id)) {
    throw new BadRequestException('ID de plan inválido');
  }

  const plan = await this.dayPlanService.findOneById(id, req.user.id);
  
  if (!plan) {
    throw new NotFoundException('Plan no encontrado');
  }

  return plan;
}

// day-plan.service.ts
async findOneById(id: string, userId: string): Promise<DailyMealPlan> {
  const plan = await this.dayPlanModel
    .findOne({
      _id: id,
      userId: userId
    })
    .populate({
      path: 'meals.meal.recipe',
      model: 'Recipe'
    })
    .exec();

  return plan;
}
```

---

## 🔄 Compatibilidad con Frontend

### Lo que el Frontend Espera:

1. **Response debe ser un objeto plan directo:**
   - ✅ `{ _id, date, meals: [...] }`
   - ❌ `{ dailyMealPlan: { _id, date, meals: [...] } }` (solo para POST)

2. **Estructura de meals:**
   - El frontend maneja estas estructuras:
     - `meal.meal.recipe` (estructura anidada)
     - `meal.recipe` (estructura plana)
   - Cada meal debe tener al menos `time` y `type`

3. **Campos requeridos en recipe:**
   - `_id` es crítico para mostrar RecipeCard
   - `name`, `ingredients`, `steps` son requeridos
   - `urlImage`, `phrase`, `preparationTime` son opcionales

---

## ✅ Checklist de Implementación

- [ ] Endpoint `GET /userDayPlans/:id` implementado
- [ ] Autenticación JWT verificada
- [ ] Validación de ObjectId
- [ ] Verificación de propiedad del plan (userId)
- [ ] Populate de recetas en meals
- [ ] Manejo de errores (404, 403, 400, 500)
- [ ] Tests unitarios
- [ ] Tests de integración

---

## 📝 Notas

- Este endpoint es más eficiente que `GET /userDayPlans` cuando solo se necesita un plan específico
- El frontend actualmente hace un workaround: obtiene todos los planes y filtra por ID
- Una vez implementado este endpoint, el frontend se actualizará automáticamente para usarlo

---

¡Una vez implementado este endpoint, el frontend funcionará de manera más eficiente! 🚀

