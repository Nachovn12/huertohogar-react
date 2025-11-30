# 🧪 GUÍA DE PRUEBAS - Sistema Híbrido

## ✅ Checklist de Pruebas

### 1. **Prueba de Login con API Real**

#### Pasos:

1. Abre la aplicación: `http://localhost:3000`
2. Click en "Iniciar Sesión"
3. Usa estas credenciales:
   ```
   Email: admin@admin.com
   Password: admin
   ```
4. Click en "Iniciar Sesión"

#### Resultado Esperado:

- ✅ Redirección a `/admin/dashboard`
- ✅ En consola: `GET /api/usuarios` (200 OK)
- ✅ En consola: `Login exitoso: { id: 1, nombre: "...", ... }`

---

### 2. **Prueba de Fallback a Mock**

#### Pasos:

1. Desconecta tu internet (o espera a que la API falle)
2. Intenta hacer login con:
   ```
   Email: admin@admin.com
   Password: admin
   ```

#### Resultado Esperado:

- ✅ Login exitoso (usando datos mock)
- ✅ En consola: `Error en login: ...`
- ✅ En consola: `Usando credenciales mock`
- ✅ Redirección a `/admin/dashboard`

---

### 3. **Prueba de Productos desde API**

#### Pasos:

1. Después de hacer login, ve a "Productos"
2. Verifica que se muestren productos

#### Resultado Esperado:

- ✅ Productos cargados desde `/api/huerto`
- ✅ Imágenes visibles
- ✅ Precios correctos
- ✅ Nombres de productos reales

---

### 4. **Prueba de Categorías desde API**

#### Pasos:

1. En la página de inicio, verifica la sección de categorías
2. Click en una categoría

#### Resultado Esperado:

- ✅ Categorías cargadas desde `/api/categorias`
- ✅ Filtrado de productos por categoría funciona

---

### 5. **Prueba de Carrito desde API**

#### Pasos:

1. Agrega un producto al carrito
2. Ve al carrito
3. Modifica la cantidad
4. Elimina un producto

#### Resultado Esperado:

- ✅ `POST /api/carritos` al agregar
- ✅ `PUT /api/carritos/:id` al modificar
- ✅ `DELETE /api/carritos/:id` al eliminar
- ✅ Carrito sincronizado con la API

---

### 6. **Prueba de Roles**

#### Admin (admin@admin.com):

- ✅ Acceso a `/admin/dashboard`
- ✅ Puede ver gestión de productos
- ✅ Puede ver gestión de usuarios
- ✅ Puede ver órdenes

#### Vendedor (vendedor@vendedor.com):

- ✅ Acceso a `/vendedor/dashboard`
- ✅ Puede ver productos
- ✅ Puede gestionar inventario

#### Cliente (cliente@cliente.com):

- ✅ Redirección a `/productos`
- ✅ Puede ver productos
- ✅ Puede agregar al carrito
- ✅ Puede hacer pedidos

---

## 🔍 Debugging en Consola del Navegador

### Comandos Útiles:

```javascript
// Ver el token actual
console.log(sessionStorage.getItem("huertohogar_token"));

// Ver el usuario actual
console.log(JSON.parse(sessionStorage.getItem("huertohogar_user")));

// Limpiar sesión manualmente
sessionStorage.clear();
```

---

## 📊 Logs Esperados

### Login Exitoso (API Real):

```
GET https://api-dfs2-dm-production.up.railway.app/api/usuarios
Status: 200 OK
Response: [{ id: 1, email: "admin@admin.com", ... }]
Login exitoso: { id: 1, nombre: "Administrador HuertoHogar", ... }
```

### Login Exitoso (Mock Fallback):

```
Error en login: AxiosError: Request failed with status code 404
Usando credenciales mock
Login exitoso: { id: 1, nombre: "Administrador HuertoHogar", ... }
```

### Productos desde API:

```
GET https://api-dfs2-dm-production.up.railway.app/api/huerto
Status: 200 OK
Response: [{ id: 1, nombre: "Tomate", precio: 1500, ... }]
```

---

## ⚠️ Errores Comunes

### Error: "Credenciales inválidas"

**Causa**: Email o password incorrectos
**Solución**: Usa `admin@admin.com` / `admin`

### Error: "Network Error"

**Causa**: API no disponible
**Solución**: El sistema debería hacer fallback automático a mock

### Error: "No autorizado"

**Causa**: Token expirado o inválido
**Solución**: Cierra sesión y vuelve a hacer login

---

## 🎯 Criterios de Éxito

- ✅ Login funciona con API real
- ✅ Login funciona con fallback a mock
- ✅ Productos se cargan desde API
- ✅ Categorías se cargan desde API
- ✅ Carrito funciona con API
- ✅ Redirección según rol funciona
- ✅ No hay errores en consola (excepto logs informativos)

---

## 📝 Reporte de Bugs

Si encuentras algún problema, anota:

1. **Pasos para reproducir**
2. **Resultado esperado**
3. **Resultado actual**
4. **Logs de consola**
5. **Captura de pantalla** (si aplica)

---

**Última actualización**: 2025-11-29
