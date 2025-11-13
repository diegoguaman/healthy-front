# 💻 Ejemplos de Implementación del Endpoint

## 📋 Resumen

Este documento contiene ejemplos prácticos de implementación del endpoint `/recipes/user/generated` para diferentes frameworks de backend.

---

## 🎯 Especificación Rápida

### Request
```
GET /recipes/user/generated
Headers: Authorization: Bearer {token}
```

### Response Exitosa (200)
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Pollo al ajillo",
    "phrase": "Un plato tradicional español",
    "preparationTime": 30,
    "urlImage": "https://example.com/image.jpg",
    "ingredients": ["pollo", "ajo", "aceite"],
    "steps": ["Paso 1", "Paso 2"],
    "createdAt": "2024-12-20T10:30:00.000Z",
    "userId": "507f191e810c19729de860ea"
  }
]
```

### Response Sin Recetas (200)
```json
[]
```

---

## 🟢 NestJS (TypeScript)

### Controller

```typescript
// recipes.controller.ts
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get('user/generated')
  @UseGuards(JwtAuthGuard)
  async getUserGeneratedRecipes(@Request() req) {
    const userId = req.user._id || req.user.id;
    return await this.recipesService.findGeneratedByUser(userId);
  }
}
```

### Service

```typescript
// recipes.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './schemas/recipe.schema';

@Injectable()
export class RecipesService {
  constructor(
    @InjectModel(Recipe.name) private recipeModel: Model<Recipe>,
  ) {}

  async findGeneratedByUser(userId: string): Promise<Recipe[]> {
    try {
      const recipes = await this.recipeModel
        .find({ 
          userId: userId,
          // Opcional: agregar campo para identificar recetas generadas
          // isGenerated: true 
        })
        .sort({ createdAt: -1 })
        .exec();

      return recipes || [];
    } catch (error) {
      throw new Error(`Error fetching generated recipes: ${error.message}`);
    }
  }
}
```

### Schema (Mongoose)

```typescript
// schemas/recipe.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Recipe extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  phrase?: string;

  @Prop()
  preparationTime?: number;

  @Prop()
  urlImage?: string;

  @Prop({ type: [String], required: true })
  ingredients: string[];

  @Prop({ type: [String], required: true })
  steps: string[];

  @Prop({ required: true })
  userId: string;

  @Prop({ default: false })
  isGenerated?: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
```

---

## 🔵 Express.js (JavaScript)

### Route

```javascript
// routes/recipes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Recipe = require('../models/Recipe');

router.get('/user/generated', authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    
    const recipes = await Recipe.find({ 
      userId: userId 
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json(recipes || []);
  } catch (error) {
    console.error('Error fetching generated recipes:', error);
    res.status(500).json({ 
      message: 'Error al obtener recetas generadas',
      error: error.message 
    });
  }
});

module.exports = router;
```

### Model (Mongoose)

```javascript
// models/Recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phrase: {
    type: String,
    default: null
  },
  preparationTime: {
    type: Number,
    default: null
  },
  urlImage: {
    type: String,
    default: null
  },
  ingredients: {
    type: [String],
    required: true
  },
  steps: {
    type: [String],
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isGenerated: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Recipe', recipeSchema);
```

### Middleware de Autenticación

```javascript
// middleware/auth.js
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: 'Token de autenticación requerido' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ 
        message: 'Token inválido o expirado' 
      });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };
```

---

## 🟡 Express.js (TypeScript)

### Route

```typescript
// routes/recipes.ts
import { Router, Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import Recipe from '../models/Recipe';

const router = Router();

router.get('/user/generated', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id || (req as any).user.id;
    
    const recipes = await Recipe.find({ 
      userId: userId 
    })
    .sort({ createdAt: -1 })
    .limit(50);

    res.status(200).json(recipes || []);
  } catch (error: any) {
    console.error('Error fetching generated recipes:', error);
    res.status(500).json({ 
      message: 'Error al obtener recetas generadas',
      error: error.message 
    });
  }
});

export default router;
```

---

## 🔴 Node.js Nativo

```javascript
// routes/recipes.js
const Recipe = require('../models/Recipe');
const { verifyToken } = require('../utils/jwt');

async function getUserGeneratedRecipes(req, res) {
  try {
    // Extraer token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Token de autenticación requerido' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({ 
        message: 'Token inválido o expirado' 
      });
    }

    const userId = decoded._id || decoded.id;

    // Buscar recetas
    const recipes = await Recipe.find({ 
      userId: userId 
    })
    .sort({ createdAt: -1 })
    .limit(50);

    // Asegurar que siempre devolvemos un array
    res.status(200).json(Array.isArray(recipes) ? recipes : []);
  } catch (error) {
    console.error('Error fetching generated recipes:', error);
    res.status(500).json({ 
      message: 'Error al obtener recetas generadas',
      error: error.message 
    });
  }
}

module.exports = { getUserGeneratedRecipes };
```

---

## 🟣 SQL (PostgreSQL/MySQL)

### Query SQL

```sql
-- Obtener recetas generadas del usuario
SELECT 
  id as "_id",
  name,
  phrase,
  preparation_time as "preparationTime",
  url_image as "urlImage",
  ingredients,
  steps,
  created_at as "createdAt",
  user_id as "userId"
FROM recipes
WHERE user_id = :userId
  AND is_generated = true
ORDER BY created_at DESC
LIMIT :limit OFFSET :offset;
```

### Implementación con Sequelize (Node.js)

```javascript
// controllers/recipesController.js
const { Recipe } = require('../models');
const { Op } = require('sequelize');

async function getUserGeneratedRecipes(req, res) {
  try {
    const userId = req.user.id;
    
    const recipes = await Recipe.findAll({
      where: {
        userId: userId,
        isGenerated: true
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    // Formatear respuesta para coincidir con estructura esperada
    const formattedRecipes = recipes.map(recipe => ({
      _id: recipe.id,
      name: recipe.name,
      phrase: recipe.phrase || null,
      preparationTime: recipe.preparationTime || null,
      urlImage: recipe.urlImage || null,
      ingredients: recipe.ingredients || [],
      steps: recipe.steps || [],
      createdAt: recipe.createdAt,
      userId: recipe.userId
    }));

    res.status(200).json(formattedRecipes || []);
  } catch (error) {
    console.error('Error fetching generated recipes:', error);
    res.status(500).json({ 
      message: 'Error al obtener recetas generadas',
      error: error.message 
    });
  }
}
```

---

## ✅ Validaciones Importantes

### 1. Siempre devolver un Array

```javascript
// ✅ CORRECTO
res.status(200).json(recipes || []);

// ❌ INCORRECTO
res.status(200).json(recipes); // Puede ser null/undefined
```

### 2. Validar Estructura de Receta

```javascript
// Validar que cada receta tenga los campos mínimos
const validatedRecipes = recipes.map(recipe => ({
  _id: recipe._id?.toString() || recipe.id?.toString(),
  name: recipe.name || '',
  phrase: recipe.phrase || null,
  preparationTime: recipe.preparationTime || null,
  urlImage: recipe.urlImage || null,
  ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
  steps: Array.isArray(recipe.steps) ? recipe.steps : [],
  createdAt: recipe.createdAt || new Date().toISOString(),
  userId: recipe.userId?.toString() || null
}));
```

### 3. Manejo de Errores

```javascript
try {
  // ... código de obtención de recetas
} catch (error) {
  // Log para debugging
  console.error('Error fetching generated recipes:', error);
  
  // Respuesta user-friendly
  res.status(500).json({ 
    message: 'Error al obtener recetas generadas',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno del servidor'
  });
}
```

---

## 🔍 Testing

### Test con Jest (NestJS)

```typescript
// recipes.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;
  let service: RecipesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: {
            findGeneratedByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
    service = module.get<RecipesService>(RecipesService);
  });

  it('should return array of recipes', async () => {
    const mockRecipes = [
      {
        _id: '123',
        name: 'Test Recipe',
        ingredients: ['ing1'],
        steps: ['step1'],
        userId: 'user123',
      },
    ];

    jest.spyOn(service, 'findGeneratedByUser').mockResolvedValue(mockRecipes);

    const req = { user: { _id: 'user123' } };
    const result = await controller.getUserGeneratedRecipes(req);

    expect(result).toEqual(mockRecipes);
    expect(service.findGeneratedByUser).toHaveBeenCalledWith('user123');
  });

  it('should return empty array when no recipes found', async () => {
    jest.spyOn(service, 'findGeneratedByUser').mockResolvedValue([]);

    const req = { user: { _id: 'user123' } };
    const result = await controller.getUserGeneratedRecipes(req);

    expect(result).toEqual([]);
  });
});
```

---

## 📝 Checklist de Implementación

- [ ] Endpoint `GET /recipes/user/generated` creado
- [ ] Middleware de autenticación aplicado
- [ ] Validación de token JWT implementada
- [ ] Query a base de datos implementada
- [ ] Filtrado por `userId` del token
- [ ] Response siempre devuelve array (vacío o con datos)
- [ ] Estructura de receta validada
- [ ] Manejo de errores implementado
- [ ] Tests unitarios creados
- [ ] Tests de integración creados
- [ ] Documentación actualizada

---

¡Listo para implementar! 🚀

