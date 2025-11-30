# 🔧 CONFIGURACIÓN DEL SISTEMA - HuertoHogar

## 📋 Estado Actual

**Modo Actual**: `MOCK` (Datos Locales)  
**Razón**: La API del profesor no tiene usuarios registrados y requiere autenticación

---

## 🎯 Cómo Funciona

### Flag de Configuración

En `src/service/api.ts` línea 11:

```typescript
const USE_API_REAL = false; // ← Cambiar a true cuando la API esté lista
```

### Comportamiento Según el Flag

#### `USE_API_REAL = false` (Actual) ✅

- ✅ **NO** intenta conectarse a la API
- ✅ **NO** genera errores 401
- ✅ Usa datos mock locales de HuertoHogar
- ✅ Login funciona con credenciales mock
- ✅ Productos mock se muestran correctamente

#### `USE_API_REAL = true` (Futuro)

- 🔄 Intenta conectarse a la API del profesor
- 🔄 Requiere usuarios en `/api/usuarios`
- 🔄 Requiere autenticación válida para `/api/huerto`
- 🔄 Fallback a mock si falla

---

## 👥 Usuarios Mock Disponibles

```
ADMINISTRADOR:
📧 Email: admin@admin.com
🔑 Password: admin
🎯 Rol: Admin

VENDEDOR:
📧 Email: vendedor@vendedor.com
🔑 Password: admin
🎯 Rol: Vendedor

CLIENTE:
📧 Email: cliente@cliente.com
🔑 Password: admin
🎯 Rol: Cliente
```

---

## 📦 Productos Mock

La aplicación incluye **9 productos** locales de HuertoHogar:

1. Manzanas Fuji
2. Naranjas Valencia
3. Plátanos Cavendish
4. Zanahorias Orgánicas
5. Espinacas Frescas
6. Pimientos Tricolores
7. Miel Orgánica
8. Quinua Orgánica
9. Leche Entera

---

## 🔄 Cuándo Cambiar a API Real

Cambiar `USE_API_REAL = true` cuando:

1. ✅ `/api/usuarios` tenga usuarios registrados
2. ✅ Exista un endpoint de login que devuelva JWT válido
3. ✅ `/api/huerto` acepte el JWT del login
4. ✅ O `/api/huerto` sea público (sin autenticación)

---

## 🚀 Cómo Probar

### Modo Mock (Actual)

```bash
1. npm start
2. Abrir http://localhost:3000
3. Click en "Iniciar Sesión"
4. Email: admin@admin.com
5. Password: admin
6. ✅ Deberías ver productos mock sin errores
```

### Logs Esperados

```
📦 Modo MOCK - Usando usuarios locales de HuertoHogar
✅ Login exitoso con datos MOCK
📦 Modo MOCK activado - Usando productos locales de HuertoHogar
✅ 9 productos mock cargados
```

---

## ⚠️ Problemas Conocidos de la API

1. **`/api/usuarios`** → Retorna `[]` (vacío)
2. **`/api/huerto`** → Requiere autenticación (401)
3. **No existe endpoint de login** que devuelva JWT válido

---

## 📝 Notas para el Profesor

Para integrar con la API real, necesitamos:

1. **Endpoint de Login**:

   ```
   POST /api/auth/login
   Body: { email, password }
   Response: { token: "jwt-token", user: {...} }
   ```

2. **Usuarios en la Base de Datos**:

   - Al menos un usuario admin en `/api/usuarios`

3. **Autenticación en `/api/huerto`**:
   - Aceptar el JWT del login
   - O hacer el endpoint público

---

## 🎉 Ventajas del Sistema Actual

- ✅ Funciona sin depender de la API
- ✅ No genera errores 401 en consola
- ✅ Desarrollo y testing sin problemas
- ✅ Fácil cambiar a API real (un solo flag)
- ✅ Productos se muestran correctamente

---

**Última actualización**: 29 de noviembre de 2025
