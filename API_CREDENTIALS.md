# 🔐 Credenciales de Acceso - HuertoHogar

## 📋 Sistema de Autenticación Híbrido

La aplicación ahora utiliza un **sistema híbrido** que combina:

- ✅ **API Real**: Intenta autenticar contra `/api/usuarios` primero
- ✅ **Fallback Mock**: Si la API falla, usa credenciales locales

---

## 🔑 Credenciales de Prueba

### ADMINISTRADOR

```
📧 Email: admin@admin.com
🔑 Password: admin
👤 Rol: Admin
```

### VENDEDOR

```
📧 Email: vendedor@vendedor.com
🔑 Password: admin
👤 Rol: Vendedor
```

### CLIENTE

```
📧 Email: cliente@cliente.com
🔑 Password: admin
👤 Rol: Cliente
```

---

## 🌐 API Endpoints Disponibles

### Base URL

```
https://api-dfs2-dm-production.up.railway.app
```

### Endpoints Confirmados

#### 👥 Usuarios

- `GET /api/usuarios` - Obtener todos los usuarios
- `POST /api/usuarios` - Crear usuario
- `PUT /api/usuarios/:id` - Actualizar usuario
- `DELETE /api/usuarios/:id` - Eliminar usuario

#### 🛍️ Productos (HuertoHogar)

- `GET /api/huerto` - Obtener productos de HuertoHogar
- `GET /api/huerto/:id` - Obtener producto específico
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto
- `PUT /api/productos/:id/stock` - Actualizar stock

#### 📁 Categorías

- `GET /api/categorias` - Obtener todas las categorías
- `GET /api/categorias/:id` - Obtener categoría específica
- `POST /api/categorias` - Crear categoría
- `PUT /api/categorias/:id` - Actualizar categoría
- `DELETE /api/categorias/:id` - Eliminar categoría

#### 🛒 Carrito

- `GET /api/carritos` - Obtener carrito
- `POST /api/carritos` - Agregar item al carrito
- `PUT /api/carritos/:id` - Actualizar cantidad
- `DELETE /api/carritos/:id` - Eliminar item
- `DELETE /api/carritos/clear` - Limpiar carrito

#### 🏪 Tiendas

- `GET /api/tiendas` - Obtener todas las tiendas

---

## 🔄 Cómo Funciona el Sistema Híbrido

### Login

1. **Intento con API Real**:

   - Hace `GET /api/usuarios`
   - Busca el usuario por email
   - Valida la contraseña (por defecto: `admin`)
   - Genera un token basado en el usuario real

2. **Fallback a Mock**:
   - Si la API falla, usa credenciales locales
   - Genera un token mock
   - Permite continuar trabajando sin conexión

### Otros Servicios

- **Productos**: Consume `/api/huerto` (API real)
- **Categorías**: Consume `/api/categorias` (API real)
- **Carrito**: Consume `/api/carritos` (API real)
- **Órdenes**: Mock temporal (endpoint no disponible aún)

---

## 🚀 Próximos Pasos

1. ✅ **Login funcionando** con sistema híbrido
2. ✅ **Productos reales** desde la API
3. ✅ **Categorías reales** desde la API
4. ✅ **Carrito real** desde la API
5. ⏳ **Órdenes**: Pendiente de endpoint en la API

---

## 📝 Notas Importantes

- **Contraseña por defecto**: Todos los usuarios usan `admin` como contraseña
- **Token JWT**: Se almacena en memoria (no en localStorage)
- **Manejo de errores**: Fallback automático a datos mock
- **Timeout**: 15 segundos para peticiones a la API

---

## 🧪 Pruebas

Para probar el sistema:

1. **Abre la aplicación**: `http://localhost:3000`
2. **Ve a Login**: Click en "Iniciar Sesión"
3. **Usa las credenciales**: `admin@admin.com` / `admin`
4. **Verifica la consola**: Verás logs de las peticiones a la API

---

**Última actualización**: 2025-11-29
