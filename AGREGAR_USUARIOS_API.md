# 🔧 Script para Agregar Usuarios a la API del Profesor

## 📋 Método 1: Usando cURL (Terminal)

### Usuario Admin

```bash
curl -X POST https://api-dfs2-dm-production.up.railway.app/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Administrador HuertoHogar",
    "email": "admin@huertohogar.com",
    "password": "admin123",
    "rol": "Admin",
    "telefono": "+56912345678",
    "direccion": "Santiago, Chile"
  }'
```

### Usuario Vendedor

```bash
curl -X POST https://api-dfs2-dm-production.up.railway.app/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Vendedor HuertoHogar",
    "email": "vendedor@huertohogar.com",
    "password": "vendedor123",
    "rol": "Vendedor",
    "telefono": "+56987654321",
    "direccion": "Valparaíso, Chile"
  }'
```

### Usuario Cliente

```bash
curl -X POST https://api-dfs2-dm-production.up.railway.app/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Cliente HuertoHogar",
    "email": "cliente@huertohogar.com",
    "password": "cliente123",
    "rol": "Cliente",
    "telefono": "+56911223344",
    "direccion": "Concepción, Chile"
  }'
```

---

## 📋 Método 2: Usando PowerShell (Windows)

### Usuario Admin

```powershell
$body = @{
    nombre = "Administrador HuertoHogar"
    email = "admin@huertohogar.com"
    password = "admin123"
    rol = "Admin"
    telefono = "+56912345678"
    direccion = "Santiago, Chile"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api-dfs2-dm-production.up.railway.app/api/usuarios" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Usuario Vendedor

```powershell
$body = @{
    nombre = "Vendedor HuertoHogar"
    email = "vendedor@huertohogar.com"
    password = "vendedor123"
    rol = "Vendedor"
    telefono = "+56987654321"
    direccion = "Valparaíso, Chile"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api-dfs2-dm-production.up.railway.app/api/usuarios" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

### Usuario Cliente

```powershell
$body = @{
    nombre = "Cliente HuertoHogar"
    email = "cliente@huertohogar.com"
    password = "cliente123"
    rol = "Cliente"
    telefono = "+56911223344"
    direccion = "Concepción, Chile"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://api-dfs2-dm-production.up.railway.app/api/usuarios" `
  -Method Post `
  -Body $body `
  -ContentType "application/json"
```

---

## 📋 Método 3: Usando Postman o Thunder Client

1. **Método**: `POST`
2. **URL**: `https://api-dfs2-dm-production.up.railway.app/api/usuarios`
3. **Headers**:
   - `Content-Type: application/json`
4. **Body** (raw JSON):

```json
{
  "nombre": "Administrador HuertoHogar",
  "email": "admin@huertohogar.com",
  "password": "admin123",
  "rol": "Admin",
  "telefono": "+56912345678",
  "direccion": "Santiago, Chile"
}
```

---

## 🔍 Verificar que se Crearon

```bash
curl https://api-dfs2-dm-production.up.railway.app/api/usuarios
```

O en PowerShell:

```powershell
Invoke-RestMethod -Uri "https://api-dfs2-dm-production.up.railway.app/api/usuarios"
```

Deberías ver un array con los usuarios creados.

---

## ⚠️ Notas Importantes

1. **Campos requeridos**: Verifica qué campos requiere la API (puede variar)
2. **Formato de rol**: Puede ser "Admin", "Vendedor", "Cliente" o similar
3. **Validación de email**: La API puede requerir emails únicos
4. **Hash de password**: La API debería hashear la password automáticamente

---

## 🚀 Después de Crear Usuarios

1. Verifica que aparezcan en `/api/usuarios`
2. Cambia `USE_API_REAL = true` en `src/service/api.ts`
3. Recarga la aplicación
4. Intenta hacer login con las credenciales creadas

---

## 📝 Credenciales Sugeridas

```
ADMIN:
Email: admin@huertohogar.com
Password: admin123

VENDEDOR:
Email: vendedor@huertohogar.com
Password: vendedor123

CLIENTE:
Email: cliente@huertohogar.com
Password: cliente123
```

---

**¿Necesitas ayuda para ejecutar alguno de estos comandos?**
