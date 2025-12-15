#!/bin/bash

# Este script automatiza los comandos git add, git commit y git push
# en la rama 'main'.

# --- 1. Verificación de la rama ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️ Advertencia: Estás en la rama '$CURRENT_BRANCH'. El script hará push a 'main'."
fi

# --- 2. Solicitar el mensaje de Commit ---
read -p "Introduce el mensaje del commit (Ej: 'feat: add initial Client model'): " COMMIT_MESSAGE

# Si el mensaje está vacío, salir
if [ -z "$COMMIT_MESSAGE" ]; then
    echo "❌ Error: El mensaje del commit no puede estar vacío. Abortando."
    exit 1
fi

# --- 3. Ejecutar Comandos Git ---

echo "🚀 Agregando todos los cambios al staging..."
git add .

echo "📝 Realizando commit con el mensaje: '$COMMIT_MESSAGE'"
git commit -m "$COMMIT_MESSAGE"

if [ $? -ne 0 ]; then
    echo "⚠️ Advertencia: No hay cambios nuevos que commitear."
    # Forzar la salida si hay un error real de commit (ej. archivos sin seguimiento)
    # Sin embargo, a menudo git commit sin cambios produce un error 1,
    # por lo que permitimos continuar para el push si el último commit es reciente.
    read -p "¿Deseas continuar e intentar hacer push? (s/n): " CONTINUE_PUSH
    if [ "$CONTINUE_PUSH" != "s" ]; then
        echo "⛔ Proceso abortado."
        exit 0
    fi
fi

echo "📤 Subiendo cambios a GitHub (origin/main)..."
git push origin main

if [ $? -eq 0 ]; then
    echo "✅ ¡Subida a GitHub exitosa! Repositorio actualizado."
else
    echo "❌ Error al intentar subir a GitHub. Revisa la terminal para ver el problema de autenticación o conexión."
fi