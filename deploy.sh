#!/bin/bash

# 🚀 Script de Despliegue Rápido para GitHub Pages
# Este script automatiza el proceso de despliegue

echo "🚀 Iniciando despliegue a GitHub Pages..."
echo ""

# Verificar que estamos en un repositorio Git
if [ ! -d .git ]; then
    echo "❌ Error: No estás en un repositorio Git"
    echo "   Ejecuta: git init"
    exit 1
fi

# Verificar remote
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No tienes un remote configurado"
    echo "   Configura tu remote con:"
    echo "   git remote add origin https://github.com/Nachovn12/huertohogar-react.git"
    read -p "¿Deseas continuar de todos modos? (s/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        exit 1
    fi
fi

# Agregar todos los cambios
echo "📦 Agregando cambios..."
git add .

# Commit
read -p "📝 Mensaje del commit (Enter para usar mensaje por defecto): " commit_msg
if [ -z "$commit_msg" ]; then
    commit_msg="feat: configurar GitHub Pages y CI/CD"
fi

git commit -m "$commit_msg"

# Push
echo "⬆️  Subiendo cambios a GitHub..."
git push origin main || git push origin master

echo ""
echo "✅ ¡Listo! Tu sitio se está desplegando..."
echo "📍 URL: https://Nachovn12.github.io/huertohogar-react"
echo ""
echo "🔍 Verifica el progreso en:"
echo "   https://github.com/Nachovn12/huertohogar-react/actions"
echo ""
