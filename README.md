# Club Montería Natación Master — Landing Page

Sitio web oficial del club de natación en Montería, Córdoba (Colombia).

**Producción:** [monterianatacionmaster.netlify.app](https://monterianatacionmaster.netlify.app)

## Descripción

Landing estática, responsiva y optimizada para rendimiento. Presenta programas, profesores, galería, ubicación, PQRS, consulta de notas y contacto. Construida con HTML, CSS y JavaScript vanilla, desplegada en Netlify.

## Características

- Diseño responsivo con menú hamburguesa accesible
- Hero con video en escritorio; en móvil fondo azul (mejor rendimiento)
- Imágenes en WebP con carga diferida
- Consulta de notas con verificación por correo (EmailJS)
- Formulario PQRS (Formspree)
- Asistente virtual NatalIA (enlace externo)
- Galería, testimonios, nadador del trimestre
- SEO: meta tags, JSON-LD, `sitemap.xml`, `robots.txt`
- Google Tag Manager (carga diferida)
- Cabeceras de caché en `netlify.toml`

## Estructura del proyecto

```
Landing-MNM/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos fuente
│   └── styles.min.css      # Estilos minificados (producción)
├── js/
│   └── app.js              # Lógica del sitio (menú, notas, PQRS, etc.)
├── img/                    # Imágenes WebP
├── logo/                   # Logos (WebP + MNM.png para favicon/OG)
├── video/
│   ├── natacion-banner.mp4         # Hero escritorio
│   └── natacion-banner-mobile.mp4  # Hero móvil (no se carga por defecto)
├── documentos/
│   ├── EVALUACIONES MNM 2025.xlsx
│   └── EVALUACIONES MNM 2026.xlsx  # Datos para consulta de notas
├── scripts/                # Utilidades de mantenimiento (Python)
│   ├── optimize-images.py
│   ├── compress-video.py
│   ├── extract-css.py
│   └── extract-js.py
├── netlify.toml
├── robots.txt
├── sitemap.xml
└── README.md
```

## Secciones del sitio

| Sección | Descripción |
|---------|-------------|
| Inicio | Hero, vacacionales, CTA WhatsApp |
| Escuela | Misión, visión y valores |
| Programas | Adultos, niños, competitivo, Master |
| Profesores | Equipo de instructores |
| Testimonios | Opiniones de nadadores y familias |
| Nadador del trimestre | Reconocimiento destacado |
| Ubicación | Horarios y mapa (carga diferida) |
| Galería | Fotos del club |
| Asistente virtual | NatalIA |
| Descargas | Consulta de notas por documento |
| PQRS | Peticiones, quejas y sugerencias |
| Contacto | Redes y pie de página |

## Consulta de notas

1. El usuario ingresa documento y correo.
2. Se envía un código de verificación por EmailJS.
3. Tras validar el código, se busca el documento en `documentos/EVALUACIONES MNM 2026.xlsx`.
4. Se muestran las notas y se puede generar PDF o compartir.

> **Importante:** el archivo Excel debe estar en el repositorio (o en el deploy de Netlify) para que la consulta funcione en producción.

## Desarrollo local

```bash
git clone https://github.com/claumiseimbett1/Landing-MNM.git
cd Landing-MNM
python -m http.server 8765
```

Abre `http://localhost:8765` en el navegador.

No hay proceso de build obligatorio. El sitio sirve los archivos estáticos directamente.

## Despliegue

El sitio se despliega automáticamente en **Netlify** al hacer push a la rama `main`.

```bash
git add .
git commit -m "Descripción del cambio"
git push
```

## Scripts de mantenimiento

| Script | Uso |
|--------|-----|
| `scripts/optimize-images.py` | Convertir imágenes a WebP y redimensionar |
| `scripts/compress-video.py` | Comprimir videos del hero |
| `scripts/extract-css.py` | Extraer CSS inline y regenerar `.min.css` |
| `scripts/extract-js.py` | Extraer JS inline a `js/app.js` |

Tras editar `css/styles.css`, regenera el minificado:

```bash
python -c "import re; from pathlib import Path; css=Path('css/styles.css').read_text(encoding='utf-8'); m=re.sub(r'/\*.*?\*/','',css,flags=re.DOTALL); m=re.sub(r'\s+',' ',m); m=re.sub(r'\s*([{}:;,>+~])\s*',r'\1',m).strip(); Path('css/styles.min.css').write_text(m,encoding='utf-8')"
```

## Paleta de colores

| Variable | Color |
|----------|-------|
| Primario | `#134492` |
| Secundario | `#dede3c` |
| Terciario | `#1a3d70` |

## Contacto del club

- **Ubicación:** Piscina Villaolímpica, Montería, Córdoba
- **Teléfono / WhatsApp:** (+57) 314 480 9367
- **Email:** monteriamaster@gmail.com
- **Instagram:** [@club_natacion_mnm](https://instagram.com/club_natacion_mnm)
- **Facebook:** [MNMClubNatacion](https://web.facebook.com/MNMClubNatacion)

## Licencia

© 2025–2026 Club Montería Natación Master. Todos los derechos reservados.

Proyecto privado del club. Para cambios o sugerencias, contactar directamente al club.
