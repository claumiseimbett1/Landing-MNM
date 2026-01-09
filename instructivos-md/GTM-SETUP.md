# 🔧 Configuración de Google Tag Manager (GTM) - Club Montería Natación Master

## ✅ Estado Actual

La página ya está preparada con Google Tag Manager. Solo necesitas completar la configuración con tu ID de GTM.

## 📋 Pasos para Configurar Google Tag Manager

### 1. Crear una cuenta de Google Tag Manager

1. Ve a [Google Tag Manager](https://tagmanager.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Haz clic en "Crear cuenta"
4. Completa el formulario:
   - **Nombre de la cuenta**: Club Montería Natación Master
   - **País**: Colombia
   - **Nombre del contenedor**: clubnatacionmnm.com
   - **Plataforma del contenedor**: Web
5. Acepta los Términos y condiciones
6. Copia el **ID de contenedor** (formato: GTM-XXXXXXX)

### 2. Instalar el ID de GTM en el sitio web

Reemplaza `GTM-XXXXXXX` en el archivo `index.html` en dos lugares:

#### A) En la sección `<head>` (aproximadamente línea 50):
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

#### B) Después de la etiqueta `<body>` (aproximadamente línea 2179):
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### 3. Configurar Google Analytics en GTM (Recomendado)

En lugar de tener Google Analytics directamente en el código, es mejor gestionarlo a través de GTM:

1. En GTM, ve a **Tags** → **Nueva**
2. Haz clic en **Configuración de etiqueta** → **Google Analytics: GA4 Configuration**
3. Ingresa tu **ID de medición de GA4**: `G-5P1JFJP1Y2`
4. Configura el **Activador**: "All Pages"
5. Guarda y publica

### 4. Configurar Google Search Console

1. Ve a [Google Search Console](https://search.google.com/search-console/)
2. Agrega tu propiedad: `https://clubnatacionmnm.com`
3. Selecciona el método de verificación: **Etiqueta HTML**
4. Copia el código de verificación (ejemplo: `<meta name="google-site-verification" content="abc123xyz..." />`)
5. Reemplaza `REEMPLAZA_CON_TU_CODIGO_DE_VERIFICACION` en el archivo `index.html` con tu código real
6. Haz clic en **Verificar** en Google Search Console

### 5. Enviar Sitemap a Google Search Console

1. Una vez verificada la propiedad, ve a **Sitemaps**
2. Ingresa: `sitemap.xml`
3. Haz clic en **Enviar**
4. Espera a que Google indexe tu sitio (puede tardar unos días)

### 6. Configurar Eventos de Conversión (Opcional pero Recomendado)

En GTM, puedes configurar eventos para rastrear:
- Envíos de formulario de contacto
- Clicks en botones de WhatsApp
- Descargas de notas
- Interacciones con el chatbot

**Ejemplo - Evento de Formulario de Contacto:**
1. En GTM, crea un nuevo **Tag** → **Google Analytics: GA4 Event**
2. Nombre del evento: `form_submission`
3. Configuración: Usa tu ID de GA4
4. Activador: Crea un activador personalizado para cuando se envíe el formulario

## 🔍 Verificación

Para verificar que GTM está funcionando correctamente:

1. Instala la extensión [Tag Assistant Legacy](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) para Chrome
2. Visita tu sitio web
3. Haz clic en la extensión
4. Deberías ver "Google Tag Manager" en la lista de etiquetas cargadas

## 📊 Beneficios de Usar GTM

- ✅ Gestión centralizada de todas las etiquetas
- ✅ No necesitas editar código HTML cada vez
- ✅ Preview mode para probar cambios antes de publicar
- ✅ Versiones y rollback fácil
- ✅ Mejor rendimiento del sitio
- ✅ Control de permisos para tu equipo

## 🚨 Notas Importantes

1. **No elimines Google Analytics directo todavía**: Mantén el código de GA4 actual hasta que verifiques que funciona correctamente a través de GTM
2. **Publica cambios en GTM**: Después de configurar tags, siempre haz clic en **Enviar** y **Publicar**
3. **Prueba en modo Preview**: Usa el modo Preview de GTM antes de publicar cambios en producción
4. **Actualiza el sitemap**: Si cambias contenido importante, actualiza la fecha en `sitemap.xml`

## 📝 Checklist de Configuración

- [ ] Crear cuenta de Google Tag Manager
- [ ] Obtener ID de contenedor GTM (GTM-XXXXXXX)
- [ ] Reemplazar GTM-XXXXXXX en index.html (2 lugares)
- [ ] Configurar Google Analytics en GTM
- [ ] Configurar Google Search Console
- [ ] Obtener código de verificación de Search Console
- [ ] Reemplazar placeholder de verificación en index.html
- [ ] Verificar sitio en Search Console
- [ ] Enviar sitemap.xml a Search Console
- [ ] Verificar que GTM funciona con Tag Assistant
- [ ] Configurar eventos de conversión (opcional)
- [ ] Publicar configuración en GTM

---

**Última actualización**: 2025-01-17
**Soporte**: Para dudas sobre GTM, consulta la [documentación oficial](https://support.google.com/tagmanager)
