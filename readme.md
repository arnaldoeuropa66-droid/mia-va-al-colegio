# 🏫 Mia va al Colegio

> 🧸 App educativa para que los niños aprendan las letras y los números jugando con Mia.

[![PWA](https://img.shields.io/badge/PWA-instalable-blueviolet)](https://web.dev/progressive-web-apps/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Español](https://img.shields.io/badge/Idioma-Espa%C3%B1ol-red)]()

---

## 🎯 ¿Qué es?

**Mia va al Colegio** es una aplicación web progresiva (PWA) diseñada para que niños de 3 a 7 años aprendan:

- 🔤 **27 letras** del alfabeto español (incluida la Ñ)
- 🔢 **10 números** del 0 al 9
- 🎵 **Rimas originales** para cada letra y número
- 🎮 **Juego de adivinanzas** con voz
- 📊 **Progreso guardado** localmente y sincronizado

Todo con la ayuda de **Mia**, una mascota virtual que habla, anima y celebra cada logro.

---

## ✨ Características

### 🎤 Voz natural
- Voces del sistema en español (local y online)
- Selector manual de voz con indicador ⭐ local / ☁️ online
- Precarga del motor TTS al arrancar (respuesta instantánea)
- Filtro automático de voces problemáticas
- Ajustes de velocidad y tono

### 🎮 Gamificación
- 37 elementos (27 letras + 10 números)
- Sistema de estrellas y medallas
- Celebración con confeti al completar
- 4 niveles de progreso (5, 10, 20, 37 elementos)
- Juego de adivinanzas con 3 opciones

### 🎨 Personalización
- 5 mascotas: 🧸 🐼 🦊 🐨 🦄
- 3 temas visuales: 🏫 Escuela, 🌴 Selva, 🚀 Espacio
- Ajustes de voz individuales

### 📱 PWA completa
- Instalable en Android, iOS y escritorio
- Funciona **offline** (gracias al Service Worker)
- Icono personalizado en pantalla de inicio
- Auto-actualización con notificación visual

### 🔒 Privacidad y seguridad
- **Sin captura de audio** del menor (RGPD/LOPDGDD)
- Sin cuentas de usuario
- Sin cookies de terceros
- Progreso guardado localmente (`localStorage`)
- Cumple con el principio de minimización de datos

---

## 🚀 Cómo usarla

### Para usuarios
1. Abre [https://mia-va-al-colegio.pages.dev](https://mia-va-al-colegio.pages.dev)
2. Pulsa **"🚀 ¡Empezar!"**
3. ¡Listo! Empieza a aprender con Mia

### Para instalarla como app
- **Android (Chrome):** Menú ⋮ → **"Instalar aplicación"**
- **iOS (Safari):** Compartir ⬆️ → **"Añadir a pantalla de inicio"**
- **Escritorio (Chrome/Edge):** Icono ⊕ en la barra de direcciones

---

## 🛠️ Desarrollo

### Requisitos
- Navegador moderno (Chrome 80+, Safari 14+, Firefox 75+)
- Servidor local para desarrollo (por CORS y Service Worker)

### Ejecutar localmente

**Opción 1 — Python:**
```bash
cd mia-va-al-colegio
python -m http.server 8000