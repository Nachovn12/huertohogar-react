# 🚀 Guía de Despliegue en GitHub Pages

Esta guía te ayudará a desplegar tu proyecto React en GitHub Pages.

## 📋 Requisitos Previos

- Tener Git instalado
- Tener una cuenta de GitHub
- Tener el repositorio creado en GitHub

## 🔧 Configuración Completada

Ya se han realizado las siguientes configuraciones en tu proyecto:

1. ✅ Instalado `gh-pages` como dependencia de desarrollo
2. ✅ Agregado el campo `homepage` en `package.json`
3. ✅ Agregados los scripts `predeploy` y `deploy` en `package.json`
4. ✅ Creado el workflow de GitHub Actions para despliegue automático

## 📝 Pasos para Desplegar

### Opción 1: Despliegue Automático con GitHub Actions (Recomendado)

1. **Verifica que tu repositorio esté en GitHub**

   ```bash
   git remote -v
   ```

   Si no tienes un remote configurado, agrégalo:

   ```bash
   git remote add origin https://github.com/Nachovn12/huertohogar-react.git
   ```

2. **Configura GitHub Pages en tu repositorio**

   - Ve a tu repositorio en GitHub
   - Click en **Settings** (Configuración)
   - En el menú lateral, click en **Pages**
   - En **Source**, selecciona **GitHub Actions**

3. **Haz commit y push de los cambios**

   ```bash
   git add .
   git commit -m "feat: configurar GitHub Pages y CI/CD"
   git push origin main
   ```

   (Si tu rama principal se llama `master`, usa `master` en lugar de `main`)

4. **Verifica el despliegue**
   - Ve a la pestaña **Actions** en tu repositorio de GitHub
   - Deberías ver el workflow "Deploy to GitHub Pages" ejecutándose
   - Una vez completado, tu sitio estará disponible en:
     **https://Nachovn12.github.io/huertohogar-react**

### Opción 2: Despliegue Manual

Si prefieres desplegar manualmente desde tu computadora:

```bash
npm run deploy
```

Este comando:

1. Ejecutará `npm run build` automáticamente (predeploy)
2. Desplegará la carpeta `build` a la rama `gh-pages`

**Nota:** Para el despliegue manual, también necesitas configurar GitHub Pages:

- Ve a **Settings** → **Pages**
- En **Source**, selecciona **Deploy from a branch**
- En **Branch**, selecciona **gh-pages** y carpeta **/ (root)**
- Click en **Save**

## 🔍 Verificación

Después del despliegue, tu aplicación estará disponible en:
**https://Nachovn12.github.io/huertohogar-react**

## 🛠️ Solución de Problemas

### El sitio no carga correctamente (páginas en blanco)

Si ves una página en blanco, verifica que:

1. El campo `homepage` en `package.json` sea correcto
2. Estés usando `BrowserRouter` con `basename` en tu aplicación

Si usas React Router, actualiza tu archivo principal (probablemente `src/index.tsx` o `src/App.tsx`):

```tsx
import { BrowserRouter } from "react-router-dom";

<BrowserRouter basename="/huertohogar-react">
  <App />
</BrowserRouter>;
```

### Error 404 en rutas

GitHub Pages no soporta rutas del lado del cliente por defecto. Soluciones:

1. **Usar HashRouter** (más simple):

   ```tsx
   import { HashRouter } from "react-router-dom";

   <HashRouter>
     <App />
   </HashRouter>;
   ```

2. **Agregar 404.html** (mantiene URLs limpias):
   Copia `public/index.html` a `public/404.html`

### El workflow de GitHub Actions falla

1. Verifica que GitHub Pages esté configurado para usar **GitHub Actions**
2. Revisa los logs en la pestaña **Actions** de tu repositorio
3. Asegúrate de que todas las dependencias estén en `package.json`

## 🔄 Actualizaciones Futuras

### Con GitHub Actions (Automático)

Simplemente haz push a la rama principal:

```bash
git add .
git commit -m "tu mensaje"
git push origin main
```

### Manual

```bash
npm run deploy
```

## 📚 Recursos Adicionales

- [Documentación de GitHub Pages](https://docs.github.com/es/pages)
- [Create React App - Deployment](https://create-react-app.dev/docs/deployment/#github-pages)
- [gh-pages package](https://www.npmjs.com/package/gh-pages)

## ✨ Comandos Útiles

```bash
# Ver el estado de Git
git status

# Ver los remotes configurados
git remote -v

# Ver las ramas
git branch -a

# Construir el proyecto localmente
npm run build

# Desplegar manualmente
npm run deploy

# Iniciar el servidor de desarrollo
npm start
```

---

**¡Tu proyecto está listo para ser desplegado en GitHub Pages! 🎉**
