# Tandil Tech Week 2026

Página web de **Tandil Tech Week**, el encuentro de tecnología y startups que se hace en Tandil, Buenos Aires, Argentina, el **14 y 15 de octubre de 2026**.

La página tiene estética pixel art, con efecto CRT, lluvia estilo Matrix de fondo y varios easter eggs escondidos. Es un sitio estático: HTML, CSS y JavaScript puro, sin frameworks ni build.

> Esta página fue hecha con IA a partir de la página original de Tandil Tech Week.

## Cómo usarla

No hace falta instalar nada. Abrí `index.html` en el navegador.

Si preferís un servidor local:

```bash
# con Python
python3 -m http.server 8000

# o con Node
npx serve .
```

Después entrá a `http://localhost:8000`.

> Las fuentes (Press Start 2P y VT323) se cargan desde Google Fonts, así que hace falta conexión a internet para verlas bien.

## Estructura

```
.
├── index.html     # Contenido y estructura de la página
├── styles.css     # Estilos, temas y diseño responsive
├── script.js      # Interactividad, juegos y easter eggs
├── README.md
└── assets/        # Imágenes referenciadas por la página
    ├── icon.svg
    ├── carpincho.png
    ├── salame.webp
    └── payoneer-mark.png
```

La carpeta `assets/` tiene que estar al lado de `index.html`, porque el HTML y el JS referencian esos archivos. Sin ella el ícono, el carpincho, los salamines y el logo de Payoneer no se ven.

## Secciones de la página

| Sección | Qué muestra |
| --- | --- |
| **Hero** | Fecha del evento, accesos a redes y selector de tema |
| **Jornadas** | Hacking Day (14 oct, UNICEN) y Startup Day (15 oct, Distrito Avellaneda), con inscripción y mapa |
| **Organizan** | Picante, Relaw, Paisanos, HackTandil, Geonosis y Fardo |
| **Convocatoria y voces** | Espacio para speakers (próximamente) |
| **Acompañan** | Grupo Rotonda, The Red Guild y Payoneer |
| **Inscripciones** | Cuenta regresiva y links de registro en Luma |

## Temas

El selector de colores del hero cambia el tema y lo guarda en `localStorage`, así que se mantiene al recargar.

`bosque` (por defecto), `cueva`, `atardecer`, `cyberpunk`, `terraria`, `undertale`, `balatro` y `davediver`.

Cada tema es un bloque `html[data-theme="..."]` al principio de `styles.css`, que redefine las variables CSS (`--bg`, `--paper`, `--gold`, etc.). Para sumar uno nuevo:

1. Copiá uno de esos bloques en `styles.css` y cambiale el nombre y los colores.
2. Agregá un `<div class="swatch" data-theme="tu-tema" ...>` en el hero de `index.html`.

## Easter eggs

- **Título del hero:** clic en las letras de "14&15 OCT." y se caen.
- **Carpincho:** aparece cada tanto por el borde derecho. Si le hacés clic, se abre *Brick Breaker: Firewall Breakout*.
- **Konami Code:** `↑ ↑ ↓ ↓ ← → ← → B A` abre *Pac-Man: Hack the Pellets*.
- **Clicks rápidos:** spamear clics dispara una lluvia de salamines.
- **Terminal secreta:** el botón `~ terminal` de la barra superior abre una consola. Escribí `help` para ver los comandos.

Comandos de la terminal: `help`, `hack`, `play pacman`, `play brick`, `matrix`, `theme <nombre>`, `carpincho`, `salame`, `clear` y `whoami`.

## Cómo editar el contenido

- **Fechas de inscripción y del evento:** están en `script.js`, en la sección *Countdown* (`reg` y `evt`). El texto visible está en `index.html`, en la sección `#inscripciones`.
- **Links de inscripción:** son los de Luma, en `index.html`, en las secciones `#jornadas` e `#inscripciones`.
- **Organizadores y sponsors:** cada uno es una tarjeta en `index.html`. Los logos son símbolos SVG definidos al inicio del archivo, dentro del bloque `<!-- SVG sprite -->`.

## Accesibilidad

- El efecto CRT y las animaciones son decorativos y no bloquean el contenido.
- `styles.css` incluye reglas para la clase `.reduce-motion`, que desactiva animaciones y transiciones.
- Los enlaces externos usan `rel="noopener"`.

## Contacto

- Instagram: [@tandiltechweek](https://instagram.com/tandiltechweek)
- X: [@tandiltechweek](https://x.com/tandiltechweek)
