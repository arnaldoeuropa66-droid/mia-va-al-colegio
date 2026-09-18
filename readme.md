# 🏫 Mia va al Colegio

<div align="center">

![Mia va al Colegio](icon-192.png)

**🧸 Aplicación web educativa para niños de 3 a 6 años**

*¡Aprende letras, sílabas, palabras, números y pronunciación jugando con Mia!*

[![PWA](https://img.shields.io/badge/PWA-instalable-6BCB77?style=for-the-badge)](https://web.dev/progressive-web-apps/)
[![Offline](https://img.shields.io/badge/Offline-funciona-4FC3F7?style=for-the-badge)](https://developer.mozilla.org/es/docs/Web/Progressive_web_apps)
[![Español](https://img.shields.io/badge/Idioma-Español-FF6B6B?style=for-the-badge)](https://github.com/)
[![Sin anuncios](https://img.shields.io/badge/Sin%20anuncios-100%25-FFD93D?style=for-the-badge)](https://github.com/)

</div>

---

## 📖 Descripción

**Mia va al Colegio** es una PWA (Progressive Web App) educativa diseñada para acompañar a niños de 3 a 6 años en sus primeros pasos con la lectura, la escritura y la pronunciación.

A través de un enfoque **multisensorial** (voz, imagen, color, rima y movimiento), los niños aprenden:

- 🔤 Las **letras** de la A a la Z (incluida la Ñ)
- 🔢 Los **números** del 0 al 9
- 🔗 Las **sílabas** (MA, ME, MI, MO, MU, PA, PE, PI, PO, PU...)
- 📝 **Palabras** completas (MAMÁ, PAPÁ, GATO, SOL...)
- 🗣️ La **pronunciación de la S** con palabras, trabalenguas y discriminación auditiva

Todo con **voz personalizable**, **mascota elegible**, **3 temas visuales** y **progreso guardado en la nube**.

---

## ✨ Características principales

### 🎓 Contenido educativo
| Sección | Contenido |
|---|---|
| **📖 Aprender** | 27 letras + 10 números con iconos, rimas y voz |
| **🔤 Sílabas** | 25 sílabas combinadas con rimas |
| **📝 Palabras** | 26 palabras básicas del entorno infantil |
| **🗣️ Ejercicios de S** | 28 palabras con S + 5 trabalenguas + 20 palabras para discriminar |
| **🎮 Juego** | Adivina la letra/número por el sonido |

### 🎨 Personalización
- **6 mascotas**: Oso, Perro, Gato, Zorro, Koala, León
- **3 temas visuales**: 🏫 Escuela, 🌴 Selva, 🚀 Espacio (modo oscuro)
- **Voz ajustable**: velocidad (0.3–1.0) y tono (0.8–2.0)
- **Selector de voz**: elige entre todas las voces instaladas

### 🏆 Motivación
- ⭐ Estrellas al acertar
- 🏅 4 medallas por hitos (5, 10, 20, 37 elementos)
- 🎉 Celebración con confeti y fuegos artificiales al completar todo
- 📊 Progreso detallado por sección

### 📱 Técnico
- ✅ **PWA instalable** en Android e iOS
- ✅ **Funciona offline** tras la primera visita
- ✅ **Optimizado para dedos pequeños** (botones ≥52px)
- ✅ **Responsive** (móvil, tablet, escritorio)
- ✅ **Sincronización en la nube** (Cloudflare Workers)
- ✅ **Sin anuncios, sin compras, sin enlaces externos**
- ✅ **Sin recogida de datos personales**

---

## 🚀 Demo

🔗 **Prueba la app en vivo**: [https://tu-dominio.com](https://tu-dominio.com)

> Reemplaza el enlace con tu URL real de Cloudflare Pages.

---

## 📦 Instalación

### Como PWA (recomendado para usuarios)

#### Android (Chrome)
1. Abre la URL de la app en Chrome
2. Pulsa el menú ⋮ → **"Añadir a pantalla de inicio"**
3. Confirma → se instalará como app nativa

#### iOS (Safari)
1. Abre la URL en Safari
2. Pulsa el botón **Compartir** 📤
3. Selecciona **"Añadir a pantalla de inicio"**
4. Confirma → se instalará como app

#### Escritorio (Chrome/Edge)
1. Abre la URL
2. Pulsa el icono de **instalar** en la barra de direcciones
3. Confirma

### Como desarrollador (local)

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/mia-colegio.git
cd mia-colegio

# Sirve los archivos con cualquier servidor local
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx serve

# Opción 3: PHP
php -S localhost:8000
