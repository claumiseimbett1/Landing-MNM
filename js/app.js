        // Funcionalidad del menú hamburguesa
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('navMenu');

        const heroVideo = document.getElementById('heroVideo');
        const videoOverlay = document.querySelector('.video-overlay');

        function shouldLoadHeroVideo() {
            if (window.matchMedia('(max-width: 768px)').matches) {
                return false;
            }
            const conn = navigator.connection;
            if (conn && (conn.saveData || conn.effectiveType === 'slow-2g' || conn.effectiveType === '2g')) {
                return false;
            }
            return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        }

        function initHeroVideoDeferred() {
            if (!heroVideo || !shouldLoadHeroVideo()) return;

            const source = document.createElement('source');
            source.type = 'video/mp4';
            source.src = window.matchMedia('(max-width: 768px)').matches
                ? 'video/natacion-banner-mobile.mp4'
                : 'video/natacion-banner.mp4';
            heroVideo.appendChild(source);
            heroVideo.load();

            const showVideo = () => {
                heroVideo.classList.add('is-visible');
                if (videoOverlay) videoOverlay.classList.add('is-visible');
            };

            heroVideo.addEventListener('loadeddata', showVideo, { once: true });
            heroVideo.play().catch(() => {});
        }

        if (heroVideo) {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(initHeroVideoDeferred, { timeout: 3500 });
            } else {
                window.addEventListener('load', () => setTimeout(initHeroVideoDeferred, 1500));
            }
        }

        const lazyMap = document.querySelector('.lazy-map');
        if (lazyMap && lazyMap.dataset.src) {
            const loadMap = () => {
                if (!lazyMap.dataset.loaded) {
                    lazyMap.src = lazyMap.dataset.src;
                    lazyMap.dataset.loaded = '1';
                }
            };
            if ('IntersectionObserver' in window) {
                const mapObserver = new IntersectionObserver((entries, observer) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            loadMap();
                            observer.disconnect();
                        }
                    });
                }, { rootMargin: '200px' });
                mapObserver.observe(lazyMap);
            } else {
                loadMap();
            }
        }

        // Popup promocional (horarios, matrícula gratis agosto)
        const promoPopup = document.getElementById('promoPopup');
        const promoPopupClose = document.getElementById('promoPopupClose');
        const promoPopupOverlay = document.getElementById('promoPopupOverlay');
        const bubbleHorarios = document.getElementById('bubbleHorarios');
        const PROMO_POPUP_KEY = 'mnm-promo-popup-closed';

        function cerrarPromoPopup() {
            if (!promoPopup) return;
            promoPopup.classList.remove('is-visible');
            promoPopup.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('promo-popup-open');
            document.body.style.overflow = '';
            sessionStorage.setItem(PROMO_POPUP_KEY, '1');
        }

        function abrirPromoPopup() {
            if (!promoPopup) return;
            promoPopup.classList.add('is-visible');
            promoPopup.setAttribute('aria-hidden', 'false');
            document.body.classList.add('promo-popup-open');
            document.body.style.overflow = 'hidden';
            promoPopupClose?.focus();
        }

        function initPromoPopup() {
            if (!promoPopup || sessionStorage.getItem(PROMO_POPUP_KEY)) return;

            const mostrar = () => setTimeout(abrirPromoPopup, 1200);

            if (document.readyState === 'complete') {
                mostrar();
            } else {
                window.addEventListener('load', mostrar, { once: true });
            }
        }

        promoPopupClose?.addEventListener('click', cerrarPromoPopup);
        promoPopupOverlay?.addEventListener('click', cerrarPromoPopup);
        bubbleHorarios?.addEventListener('click', abrirPromoPopup);

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && promoPopup?.classList.contains('is-visible')) {
                cerrarPromoPopup();
            }
        });

        initPromoPopup();

        function setMenuOpen(isOpen) {
            hamburger.classList.toggle('active', isOpen);
            navMenu.classList.toggle('active', isOpen);
            hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            hamburger.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        }

        hamburger.addEventListener('click', () => {
            setMenuOpen(!navMenu.classList.contains('active'));
        });

        // Cerrar menú al hacer click en un enlace
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                setMenuOpen(false);
            });
        });

        // Smooth scrolling para los enlaces de navegación
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });

        // Carga diferida de librerías pesadas (Excel, PDF, Email)
        const loadedLibs = { xlsx: false, jspdf: false, emailjs: false };

        function loadScript(src) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.async = true;
                script.onload = resolve;
                script.onerror = reject;
                document.body.appendChild(script);
            });
        }

        async function ensureXlsx() {
            if (!loadedLibs.xlsx) {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');
                loadedLibs.xlsx = true;
            }
        }

        async function ensureJsPdf() {
            if (!loadedLibs.jspdf) {
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
                loadedLibs.jspdf = true;
            }
        }

        // Configuración EmailJS — actualizar tras reconectar en dashboard.emailjs.com
        const EMAIL_SERVICE_ID = 'service_p9syk98';
        const EMAIL_TEMPLATE_ID = 'template_d138evr';
        const EMAIL_PUBLIC_KEY = '1ErOYdfGE3oKzXbzr';
        const WHATSAPP_NOTAS_URL = 'https://wa.me/573144809367?text=Hola,%20quiero%20consultar%20mis%20notas%20de%20natación.%20Mi%20documento%20es:%20';

        async function ensureEmailJs() {
            if (!loadedLibs.emailjs) {
                await loadScript('https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js');
                emailjs.init({ publicKey: EMAIL_PUBLIC_KEY });
                loadedLibs.emailjs = true;
            }
        }

        // Variables globales para Excel y verificación por email
        let workbook = null;
        let datosEncontrados = null;
        let codigoVerificacion = null;
        let datosFormulario = null;
        
        // Generar código de verificación de 6 dígitos
        function generarCodigoVerificacion() {
            return Math.floor(100000 + Math.random() * 900000).toString();
        }

        // Enviar código de verificación por email
        async function enviarCodigoVerificacion(email, codigo) {
            try {
                await ensureEmailJs();

                const emailLimpio = email.trim();
                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLimpio)) {
                    return { ok: false, error: 'Correo inválido' };
                }

                await emailjs.send(
                    EMAIL_SERVICE_ID,
                    EMAIL_TEMPLATE_ID,
                    {
                        to_email: emailLimpio,
                        email: emailLimpio,
                        user_email: emailLimpio,
                        reply_to: emailLimpio,
                        codigo_verificacion: codigo,
                        codigo: codigo,
                        message: `Tu código de verificación es: ${codigo}`,
                        institucion: 'Montería Natación Master',
                        documento: datosFormulario?.documento || ''
                    },
                    { publicKey: EMAIL_PUBLIC_KEY }
                );
                return { ok: true };
            } catch (error) {
                console.error('Error enviando email:', error);
                const detalle = error?.text || error?.message || String(error);
                return { ok: false, error: detalle };
            }
        }

        function mensajeErrorEnvioCodigo(errorDetalle) {
            const detalle = (errorDetalle || '').toLowerCase();

            if (detalle.includes('invalid grant') || detalle.includes('reconnect') || detalle.includes('412')) {
                return 'El correo del club está desconectado (error Gmail). Usa el botón de WhatsApp abajo para pedir tus notas, o intenta más tarde.';
            }

            if (detalle.includes('service id not found') || detalle.includes('template id')) {
                return 'El servicio de correo está en configuración. Usa WhatsApp para pedir tus notas mientras se restablece.';
            }

            if (detalle.includes('too many requests') || detalle.includes('429')) {
                return 'Demasiados intentos seguidos. Espera un minuto e intenta de nuevo.';
            }

            if (detalle.includes('forbidden') || detalle.includes('403')) {
                return 'No se pudo enviar el correo desde esta página. Usa WhatsApp para pedir tus notas.';
            }

            return 'No pudimos enviar el código por correo. Usa WhatsApp para pedir tus notas o intenta más tarde.';
        }

        function abrirWhatsAppNotas() {
            const documento = document.getElementById('documento')?.value.trim() || '';
            const mensaje = documento
                ? `${WHATSAPP_NOTAS_URL}${encodeURIComponent(documento)}`
                : WHATSAPP_NOTAS_URL;
            window.open(mensaje, '_blank', 'noopener,noreferrer');
        }

        // Cargar archivo Excel al iniciar
        async function cargarArchivoExcel() {
            try {
                await ensureXlsx();
                const response = await fetch('./documentos/EVALUACIONES MNM 2026.xlsx');
                const arrayBuffer = await response.arrayBuffer();
                workbook = XLSX.read(arrayBuffer, { type: 'array' });
                console.log('Archivo Excel cargado correctamente');
            } catch (error) {
                console.error('Error al cargar el archivo Excel:', error);
            }
        }

        // Buscar estudiante por documento en un nivel específico
        function buscarEstudianteEnNivel(documento, nivel) {
            if (!workbook) {
                console.error('Archivo Excel no cargado');
                return [];
            }

            const sheet = workbook.Sheets[nivel];
            if (!sheet) {
                console.error(`Hoja ${nivel} no encontrada`);
                return [];
            }

            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            const resultados = [];
            
            // Buscar en la columna F (índice 5) el documento - pueden ser múltiples registros
            for (let i = 1; i < data.length; i++) {
                if (data[i][5] && data[i][5].toString() === documento) {
                    resultados.push({
                        fila: i + 1,
                        datos: data[i],
                        encabezados: data[0],
                        nivel: nivel
                    });
                }
            }
            
            return resultados;
        }

        // Buscar estudiante por documento en todos los niveles
        function buscarEstudianteEnTodosLosNiveles(documento) {
            const niveles = ['NIVEL 1', 'NIVEL 2', 'NIVEL 3'];
            let todosLosResultados = [];
            
            for (const nivel of niveles) {
                const resultados = buscarEstudianteEnNivel(documento, nivel);
                todosLosResultados = todosLosResultados.concat(resultados);
            }
            
            return todosLosResultados.length > 0 ? todosLosResultados : null;
        }

        // Mostrar datos del estudiante
        function mostrarDatosEstudiante(resultados) {
            const datosDiv = document.getElementById('datosEstudiante');
            let html = '';
            
            // Si hay múltiples registros, mostrar cada uno por separado
            for (let r = 0; r < resultados.length; r++) {
                const resultado = resultados[r];
                const datos = resultado.datos;
                const encabezados = resultado.encabezados;
                
                html += `<div class="datos-estudiante" style="margin-bottom: 20px; ${r > 0 ? 'border-top: 2px solid var(--secondary-color); padding-top: 15px;' : ''}">`;
                
                if (resultados.length > 1) {
                    html += `<h3 style="color: var(--primary-color); margin-bottom: 15px;">Registro ${r + 1} de ${resultados.length}</h3>`;
                }
                
                // Información básica del estudiante
                html += '<h4>Información del Estudiante:</h4>';
                html += `<p><strong>Nivel:</strong> ${datos[1] || 'N/A'}</p>`;
                html += `<p><strong>Mes:</strong> ${datos[2] || 'N/A'}</p>`;
                html += `<p><strong>Nombre:</strong> ${datos[4] || 'N/A'}</p>`;
                html += `<p><strong>Documento:</strong> ${datos[5] || 'N/A'}</p>`;
                
                // Notas de evaluación con nombres específicos
                html += '<h4>Notas de Evaluación:</h4>';
                
                // Definir rangos de columnas según el nivel
                let columnaInicio = 6; // Columna G
                let columnaFin = 12;   // Columna M por defecto (Nivel 1 y 2)
                
                // Para Nivel 3, extender hasta columna S (índice 18)
                if (resultado.nivel === 'NIVEL 3') {
                    columnaFin = 18; // Columna S
                }
                
                // Mostrar notas de evaluación usando el rango correcto
                // Leer los nombres desde la fila 2 (data[1]) en las columnas correspondientes
                for (let i = columnaInicio; i <= columnaFin; i++) {
                    // Leer el nombre de la evaluación desde la fila 2 del Excel
                    const nombreEvaluacion = (function() {
                        // Buscar la fila 2 de la misma hoja para obtener el nombre
                        const sheet = workbook.Sheets[resultado.nivel];
                        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                        return data[1] && data[1][i] ? data[1][i] : `Evaluación ${i - 5}`;
                    })();
                    
                    if (datos[i] !== undefined && datos[i] !== null && datos[i] !== '') {
                        const nota = typeof datos[i] === 'number' ? datos[i].toFixed(1) : datos[i];
                        html += `<p><strong>${nombreEvaluacion}:</strong> ${nota}</p>`;
                    }
                }
                
                // Pase de Nivel (columna N, índice 13)
                if (datos[13] !== undefined && datos[13] !== null && datos[13] !== '') {
                    const paseNivel = typeof datos[13] === 'number' ? datos[13].toFixed(1) : datos[13];
                    html += `<p><strong>Pase de Nivel 4,7 ptos:</strong> ${paseNivel}</p>`;
                }
                
                // Nota de cambio de nivel (columna O, índice 14)
                html += '<h4>Evaluación de Nivel:</h4>';
                const cambioNivel = (datos[14] !== undefined && datos[14] !== null && datos[14] !== '') ? datos[14] : 'NO';
                html += `<p><strong>${encabezados[14] || 'Cambio de Nivel'}:</strong> ${cambioNivel}</p>`;
                
                html += '</div>';
            }
            
            datosDiv.innerHTML = html;
        }

        // Generar PDF con los datos
        async function generarPDF() {
            if (!datosEncontrados || datosEncontrados.length === 0) return;

            await ensureJsPdf();
            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Configurar fuente
            doc.setFont("helvetica");
            
            // Función para agregar logo (se convertirá automáticamente a base64)
            async function agregarLogo() {
                try {
                    // Cargar y agregar solo el logo principal MNM
                    const logoMNM = await fetch('./logo/MNM.png');
                    const logoMNMBlob = await logoMNM.blob();
                    const logoMNMBase64 = await new Promise(resolve => {
                        const reader = new FileReader();
                        reader.onload = () => resolve(reader.result);
                        reader.readAsDataURL(logoMNMBlob);
                    });
                    
                    // Agregar logo MNM (lado izquierdo)
                    doc.addImage(logoMNMBase64, 'PNG', 15, 10, 25, 25);
                    
                } catch (error) {
                    console.log('No se pudo cargar el logo:', error);
                }
            }
            
            // Agregar logo al inicio
            agregarLogo().then(() => {
                // Continuar con el resto del PDF
                generarContenidoPDF();
            }).catch(() => {
                // Si falla la carga del logo, continuar sin él
                generarContenidoPDF();
            });
            
            function generarContenidoPDF() {
                // Función auxiliar para agregar pie de página
                function agregarPieDePagina() {
                    const fontSize = doc.getFontSize();
                    doc.setFontSize(8);
                    doc.text('Montería Natación Master - Sistema de Notas', 20, 285);
                    doc.setFontSize(fontSize); // Restaurar tamaño original
                }
                
                // Título
                doc.setFontSize(18);
                doc.text('Reporte de Notas - Montería Natación Master', 50, 25);
                
                // Fecha
                doc.setFontSize(10);
                doc.text(`Fecha de generación: ${new Date().toLocaleDateString()}`, 20, 45);
                
                // Nota de autorización de datos
                doc.setFontSize(8);
                doc.setFont("helvetica", "italic");
                const textoAutorizacion = "NOTA: Al descargar este documento acepto la autorización del tratamiento de mis datos personales según la Ley 1581 de 2012";
                const lineasAutorizacion = doc.splitTextToSize(textoAutorizacion, 170);
                doc.text(lineasAutorizacion, 20, 52);
                
                // Restaurar fuente
                doc.setFont("helvetica", "normal");
                
                // Línea separadora
                const nuevaYLinea = 52 + (lineasAutorizacion.length * 4) + 5;
                doc.line(20, nuevaYLinea, 190, nuevaYLinea);
                
                // Agregar pie de página en primera página
                agregarPieDePagina();
                
                let yPosition = nuevaYLinea + 10;

                // Iterar sobre todos los registros encontrados
                for (let r = 0; r < datosEncontrados.length; r++) {
                    const resultado = datosEncontrados[r];
                    const datos = resultado.datos;
                    const encabezados = resultado.encabezados;
                    
                    // Si hay múltiples registros, agregar separación
                    if (r > 0) {
                        if (yPosition > 200) {
                            doc.addPage();
                            // Agregar pie de página en nueva página
                            agregarPieDePagina();
                            yPosition = 30;
                        } else {
                            yPosition += 20;
                            doc.line(20, yPosition - 10, 190, yPosition - 10);
                        }
                    }
                    
                    if (datosEncontrados.length > 1) {
                        doc.setFontSize(16);
                        doc.setFont("helvetica", "bold");
                        doc.text(`Registro ${r + 1} de ${datosEncontrados.length}`, 20, yPosition);
                        yPosition += 15;
                    }
                
                    // Información básica del estudiante
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text('Información del Estudiante:', 20, yPosition);
                    yPosition += 10;
                    
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    doc.text(`Nivel: ${datos[1] || 'N/A'}`, 20, yPosition);
                    yPosition += 8;
                    doc.text(`Mes: ${datos[2] || 'N/A'}`, 20, yPosition);
                    yPosition += 8;
                    doc.text(`Nombre: ${datos[4] || 'N/A'}`, 20, yPosition);
                    yPosition += 8;
                    doc.text(`Documento: ${datos[5] || 'N/A'}`, 20, yPosition);
                    yPosition += 15;
                    
                    // Notas de evaluación con nombres específicos
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text('Notas de Evaluación:', 20, yPosition);
                    yPosition += 10;
                    
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    
                    // Definir rangos de columnas según el nivel para PDF
                    let columnaInicio = 6; // Columna G
                    let columnaFin = 12;   // Columna M por defecto (Nivel 1 y 2)
                    
                    // Para Nivel 3, extender hasta columna S (índice 18)
                    if (resultado.nivel === 'NIVEL 3') {
                        columnaFin = 18; // Columna S
                    }
                    
                    // Mostrar notas de evaluación leyendo nombres desde fila 2
                    for (let i = columnaInicio; i <= columnaFin; i++) {
                        // Leer el nombre de la evaluación desde la fila 2 del Excel
                        const nombreEvaluacion = (function() {
                            const sheet = workbook.Sheets[resultado.nivel];
                            const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                            return data[1] && data[1][i] ? data[1][i] : `Evaluación ${i - 5}`;
                        })();
                        
                        if (datos[i] !== undefined && datos[i] !== null && datos[i] !== '') {
                            const notaPDF = typeof datos[i] === 'number' ? datos[i].toFixed(1) : datos[i];
                            const texto = `${nombreEvaluacion}: ${notaPDF}`;
                            const lineas = doc.splitTextToSize(texto, 170);
                            doc.text(lineas, 20, yPosition);
                            yPosition += lineas.length * 8;
                            
                            // Nueva página si es necesario
                            if (yPosition > 250) {
                                doc.addPage();
                                // Agregar pie de página en nueva página
                                agregarPieDePagina();
                                yPosition = 30;
                            }
                        }
                    }
                    
                    // Pase de Nivel (columna N, índice 13)
                    if (datos[13] !== undefined && datos[13] !== null && datos[13] !== '') {
                        const paseNivelPDF = typeof datos[13] === 'number' ? datos[13].toFixed(1) : datos[13];
                        const texto = `Pase de Nivel 4,7 ptos: ${paseNivelPDF}`;
                        const lineas = doc.splitTextToSize(texto, 170);
                        doc.text(lineas, 20, yPosition);
                        yPosition += lineas.length * 8;
                        
                        // Nueva página si es necesario
                        if (yPosition > 250) {
                            doc.addPage();
                            // Agregar pie de página en nueva página
                            agregarPieDePagina();
                            yPosition = 30;
                        }
                    }
                    
                    // Nota de cambio de nivel (columna O, índice 14)
                    yPosition += 10;
                    doc.setFontSize(14);
                    doc.setFont("helvetica", "bold");
                    doc.text('Evaluación de Nivel:', 20, yPosition);
                    yPosition += 10;
                    
                    doc.setFontSize(12);
                    doc.setFont("helvetica", "normal");
                    const nombreCampo = encabezados[14] || 'Cambio de Nivel';
                    const cambioNivelPDF = (datos[14] !== undefined && datos[14] !== null && datos[14] !== '') ? datos[14] : 'NO';
                    doc.text(`${nombreCampo}: ${cambioNivelPDF}`, 20, yPosition);
                    yPosition += 15;
                }
                
                // Descargar PDF
                const primerDato = datosEncontrados[0].datos;
                const nombreArchivo = `notas_${primerDato[5] || 'estudiante'}_${new Date().toISOString().split('T')[0]}.pdf`;
                doc.save(nombreArchivo);
            }
        }

        // Fallback WhatsApp cuando EmailJS/Gmail falla
        document.getElementById('btnWhatsAppNotas')?.addEventListener('click', abrirWhatsAppNotas);

        // Manejo del formulario principal - enviar código de verificación
        document.getElementById('downloadForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            await ensureEmailJs();
            
            const documento = document.getElementById('documento').value.trim();
            const email = document.getElementById('email').value.trim();
            const aceptarTratamiento = document.getElementById('aceptarTratamiento').checked;
            
            if (!documento) {
                alert('Por favor ingresa el número de documento');
                return;
            }

            if (!email) {
                alert('Por favor ingresa el correo electrónico');
                return;
            }

            if (!aceptarTratamiento) {
                alert('Debes autorizar el tratamiento de datos personales para continuar');
                return;
            }

            // Guardar datos del formulario
            datosFormulario = { documento, email };
            
            // Generar y enviar código
            codigoVerificacion = generarCodigoVerificacion();
            
            // Cambiar botón a estado de envío
            const btn = document.getElementById('btnEnviarCodigo');
            const textoOriginal = btn.textContent;
            btn.textContent = 'Enviando código...';
            btn.disabled = true;
            
            try {
                const resultado = await enviarCodigoVerificacion(email, codigoVerificacion);
                
                if (resultado.ok) {
                    // Mostrar formulario de verificación
                    document.getElementById('verificationForm').style.display = 'block';
                    alert('Código enviado a tu correo electrónico. Revisa también la carpeta de spam.');
                } else {
                    alert(mensajeErrorEnvioCodigo(resultado.error));
                }
            } catch (error) {
                alert('Error enviando el código. Intenta nuevamente.');
            } finally {
                // Restaurar botón
                btn.textContent = textoOriginal;
                btn.disabled = false;
            }
        });

        // Manejo del formulario de verificación
        document.getElementById('verificationForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const codigoIngresado = document.getElementById('codigoVerificacion').value.trim();
            
            if (!codigoIngresado) {
                alert('Por favor ingresa el código de verificación');
                return;
            }

            if (codigoIngresado !== codigoVerificacion) {
                alert('Código incorrecto. Verifica e intenta nuevamente.');
                return;
            }

            // Código correcto, proceder con la búsqueda
            // Ocultar resultados previos
            document.getElementById('resultadoBusqueda').style.display = 'none';
            document.getElementById('mensajeError').style.display = 'none';
            
            // Cargar Excel si no está cargado
            if (!workbook) {
                await cargarArchivoExcel();
            }
            
            // Buscar estudiante en todos los niveles
            const resultados = buscarEstudianteEnTodosLosNiveles(datosFormulario.documento);
            
            if (resultados) {
                datosEncontrados = resultados;
                mostrarDatosEstudiante(resultados);
                document.getElementById('resultadoBusqueda').style.display = 'block';
                
                // Actualizar el mensaje con el total de registros encontrados
                const tituloResultado = document.querySelector('#resultadoBusqueda h3');
                if (resultados.length > 1) {
                    tituloResultado.textContent = `Se encontraron ${resultados.length} registros en todos los niveles:`;
                } else {
                    tituloResultado.textContent = 'Información Encontrada:';
                }
                
                // Ocultar formulario de verificación
                document.getElementById('verificationForm').style.display = 'none';
            } else {
                document.getElementById('mensajeError').style.display = 'block';
                datosEncontrados = null;
            }
        });

        // Botón para reenviar código
        document.getElementById('btnReenviarCodigo').addEventListener('click', async function() {
            if (!datosFormulario) {
                alert('Error: No hay datos del formulario');
                return;
            }

            // Generar nuevo código
            codigoVerificacion = generarCodigoVerificacion();
            
            // Cambiar botón a estado de envío
            const btn = this;
            const textoOriginal = btn.textContent;
            btn.textContent = 'Reenviando...';
            btn.disabled = true;
            
            try {
                const resultado = await enviarCodigoVerificacion(datosFormulario.email, codigoVerificacion);
                
                if (resultado.ok) {
                    alert('Código reenviado a tu correo electrónico.');
                } else {
                    alert(mensajeErrorEnvioCodigo(resultado.error));
                }
            } catch (error) {
                alert('Error reenviando el código. Intenta nuevamente.');
            } finally {
                // Restaurar botón
                btn.textContent = textoOriginal;
                btn.disabled = false;
            }
        });

        // Manejar click del botón generar PDF
        document.getElementById('generarPDF').addEventListener('click', generarPDF);

        // Funciones para compartir
        function obtenerResumenResultado() {
            if (!datosEncontrados || datosEncontrados.length === 0) return null;
            
            // Obtener el último (más reciente) resultado
            const ultimoResultado = datosEncontrados[datosEncontrados.length - 1];
            const datos = ultimoResultado.datos;
            const encabezados = ultimoResultado.encabezados;
            
            // Crear resumen del último resultado
            const nombreEstudiante = datos[5] || 'Estudiante';
            const nivel = ultimoResultado.nivel;
            const fechaEvaluacion = datos[16] || 'Fecha no disponible';
            
            // Obtener notas más relevantes (últimas 3 evaluaciones)
            const notasRelevantes = [];
            for (let i = 10; i <= 12; i++) { // Columnas K, L, M (índices 10, 11, 12)
                if (datos[i] !== undefined && datos[i] !== null && datos[i] !== '') {
                    const nombreEval = encabezados[i] || `Evaluación ${i-5}`;
                    const nota = typeof datos[i] === 'number' ? datos[i].toFixed(1) : datos[i];
                    notasRelevantes.push(`${nombreEval}: ${nota}`);
                }
            }
            
            // Pase de nivel
            const paseNivel = datos[13] !== undefined && datos[13] !== null && datos[13] !== '' 
                ? (typeof datos[13] === 'number' ? datos[13].toFixed(1) : datos[13])
                : 'N/A';
                
            return {
                nombre: nombreEstudiante,
                nivel: nivel,
                fecha: fechaEvaluacion,
                notas: notasRelevantes,
                paseNivel: paseNivel
            };
        }

        // Manejar click del botón compartir WhatsApp
        document.getElementById('compartirWhatsApp').addEventListener('click', function() {
            const resumen = obtenerResumenResultado();
            if (!resumen) {
                alert('No hay resultados para compartir');
                return;
            }
            
            // Determinar puntaje requerido según el nivel
            let puntajeRequerido;
            const nivelNumero = resumen.nivel.toLowerCase();
            if (nivelNumero.includes('i') && !nivelNumero.includes('ii')) {
                puntajeRequerido = 4.7; // Nivel I
            } else if (nivelNumero.includes('ii') && !nivelNumero.includes('iii')) {
                puntajeRequerido = 4.7; // Nivel II  
            } else if (nivelNumero.includes('iii')) {
                puntajeRequerido = 4.9; // Nivel III
            } else {
                puntajeRequerido = 4.7; // Default
            }
            
            // Convertir pase de nivel a número para comparar
            const paseNivelNumerico = parseFloat(resumen.paseNivel);
            let mensajeFinal;
            
            if (!isNaN(paseNivelNumerico) && paseNivelNumerico >= puntajeRequerido) {
                mensajeFinal = `¡Felicitaciones, haz cambiado al siguiente nivel! 🎉🏆`;
            } else {
                mensajeFinal = `¡Sigue entrenando! 💪🏊‍♂️`;
            }
            
            let mensaje = `🏊‍♂️ *Montería Natación Master - Resultados*\n\n`;
            mensaje += `👤 *Estudiante:* ${resumen.nombre}\n`;
            mensaje += `📊 *Nivel:* ${resumen.nivel}\n`;
            mensaje += `🎯 *Pase de Nivel ${puntajeRequerido} ptos:* ${resumen.paseNivel}\n\n`;
            mensaje += `${mensajeFinal}\n\n`;
            mensaje += `#MNM #Natacion #Resultados`;
            
            const mensajeCodificado = encodeURIComponent(mensaje);
            const urlWhatsApp = `https://wa.me/?text=${mensajeCodificado}`;
            window.open(urlWhatsApp, '_blank');
        });

        // Manejar click del botón compartir Instagram
        document.getElementById('compartirInstagram').addEventListener('click', function() {
            const resumen = obtenerResumenResultado();
            if (!resumen) {
                alert('No hay resultados para compartir');
                return;
            }
            
            // Para Instagram, creamos un texto más corto y visual
            let mensaje = `🏊‍♂️ Resultados MNM - ${resumen.nombre}\n`;
            mensaje += `📊 Nivel ${resumen.nivel} | 📅 ${resumen.fecha}\n`;
            
            if (resumen.notas.length > 0) {
                mensaje += `📋 ${resumen.notas.slice(0, 2).join(' | ')}\n`;
            }
            
            mensaje += `🎯 Pase de Nivel: ${resumen.paseNivel}\n`;
            mensaje += `#MNM #Natacion #MonteriaSwim #Resultados #Entrenamiento`;
            
            // Instagram no tiene API directa para compartir, así que copiamos al portapapeles
            if (navigator.clipboard) {
                navigator.clipboard.writeText(mensaje).then(() => {
                    alert('¡Texto copiado al portapapeles!\nAhora puedes pegarlo en tu post de Instagram.');
                    // Abrir Instagram en nueva ventana
                    window.open('https://www.instagram.com/', '_blank');
                }).catch(() => {
                    // Fallback si no se puede copiar
                    mostrarModalTexto(mensaje);
                });
            } else {
                // Fallback para navegadores que no soportan clipboard
                mostrarModalTexto(mensaje);
            }
        });

        function mostrarModalTexto(texto) {
            const modal = document.createElement('div');
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            
            const contenido = document.createElement('div');
            contenido.style.cssText = `
                background: white;
                padding: 20px;
                border-radius: 10px;
                max-width: 80%;
                max-height: 80%;
                overflow-y: auto;
            `;
            
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            textarea.style.cssText = `
                width: 100%;
                height: 200px;
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            `;
            
            const botonCerrar = document.createElement('button');
            botonCerrar.textContent = 'Cerrar';
            botonCerrar.style.cssText = `
                background: #007bff;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            `;
            
            const instrucciones = document.createElement('p');
            instrucciones.textContent = 'Selecciona todo el texto, cópialo y pégalo en Instagram:';
            instrucciones.style.marginBottom = '10px';
            
            contenido.appendChild(instrucciones);
            contenido.appendChild(textarea);
            contenido.appendChild(botonCerrar);
            modal.appendChild(contenido);
            
            botonCerrar.onclick = () => {
                document.body.removeChild(modal);
                window.open('https://www.instagram.com/', '_blank');
            };
            
            modal.onclick = (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            };
            
            document.body.appendChild(modal);
            textarea.select();
        }

        // Animación de la galería tipo baraja
        const galleryTrack = document.querySelector('.gallery-track');
        const cards = document.querySelectorAll('.gallery-card');
        let currentIndex = 0;

        function updateGallery() {
            cards.forEach((card, index) => {
                const offset = index - currentIndex;
                card.style.transform = `translateX(${offset * 320}px) translateZ(${Math.abs(offset) * -100}px) rotateY(${offset * -15}deg)`;
                card.style.opacity = Math.abs(offset) > 2 ? '0' : '1';
            });
        }

        // Auto-rotar galería
        setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateGallery();
        }, 3000);

        // Click en las tarjetas de la galería
        cards.forEach((card, index) => {
            card.addEventListener('click', () => {
                currentIndex = index;
                updateGallery();
            });
        });

        updateGallery();

        // Optimización para anuncios en móviles
        const announcementsSection = document.querySelector('.announcements');
        const announcementsTrack = document.querySelector('.announcements-track');
        let touchStartY = 0;
        let touchEndY = 0;

        // Detectar si es dispositivo móvil
        const isMobile = window.innerWidth <= 768;

        if (isMobile) {
            // Pausar animación al tocar y mantener presionado
            announcementsSection.addEventListener('touchstart', (e) => {
                touchStartY = e.changedTouches[0].screenY;
                announcementsTrack.style.animationPlayState = 'paused';
            });

            // Reanudar animación al soltar
            announcementsSection.addEventListener('touchend', (e) => {
                touchEndY = e.changedTouches[0].screenY;
                // Solo reanudar si no fue un scroll vertical
                if (Math.abs(touchStartY - touchEndY) < 50) {
                    setTimeout(() => {
                        announcementsTrack.style.animationPlayState = 'running';
                    }, 1000);
                } else {
                    announcementsTrack.style.animationPlayState = 'running';
                }
            });

            // Ajustar velocidad según el tamaño de pantalla
            if (window.innerWidth <= 480) {
                announcementsTrack.style.animationName = 'mobileSlide';
                announcementsTrack.style.animationDuration = '24s';
            } else if (window.innerWidth <= 768) {
                announcementsTrack.style.animationName = 'slide';
                announcementsTrack.style.animationDuration = '5s';
            }
        }

        // Redimensionar ventana - ajustar animación
        window.addEventListener('resize', () => {
            const currentWidth = window.innerWidth;
            if (currentWidth <= 480) {
                announcementsTrack.style.animationName = 'mobileSlide';
                announcementsTrack.style.animationDuration = '24s';
            } else if (currentWidth <= 768) {
                announcementsTrack.style.animationName = 'slide';
                announcementsTrack.style.animationDuration = '5s';
            } else {
                announcementsTrack.style.animationName = 'slide';
                announcementsTrack.style.animationDuration = '6s';
            }
        });

        // Optimización para galería móvil
        const galleryMobileContainer = document.querySelector('.gallery-mobile-container');
        const galleryMobileHint = document.querySelector('.gallery-mobile-hint');

        if (galleryMobileContainer && window.innerWidth <= 768) {
            let isScrolling = false;

            galleryMobileContainer.addEventListener('scroll', () => {
                if (!isScrolling) {
                    galleryMobileHint.style.opacity = '0.5';
                    isScrolling = true;
                }

                // Ocultar hint después de scroll
                clearTimeout(galleryMobileContainer.scrollTimeout);
                galleryMobileContainer.scrollTimeout = setTimeout(() => {
                    galleryMobileHint.style.opacity = '1';
                    isScrolling = false;
                }, 1500);
            });

            // Scroll suave con momentum en iOS
            galleryMobileContainer.style.webkitOverflowScrolling = 'touch';
        }

        // Configuración del contador de ofertas especiales
        const offerConfig = {
            enabled: false, // Cambiar a true para mostrar
            startDate: 'auto', // Visible desde ahora para expectativas de agosto
            endDate: '2026-08-31', // Fin de la promo de agosto
            title: '💸 ¡MATRÍCULA GRATIS + TARIFAS EN OFF! 💸',
            description: '¡Ven y entrena con nosotros! Matrícula gratis y tarifas en off en agosto para 3 veces por semana. Plan ticket 7:00 AM para que entrenes temprano en horario de mañana. ¡Cupos limitados! Válido hasta el 31 de agosto de 2026 (aplican condiciones).'
        };

        // Función para inicializar el contador
        function initOfferCountdown() {
            const offerSection = document.querySelector('.special-offers');
            if (!offerSection) return;

            const offerEndDateSpan = document.getElementById('offer-end-date');

            if (!offerConfig.enabled) {
                offerSection.classList.add('hidden');
                offerSection.setAttribute('hidden', '');
                offerSection.setAttribute('aria-hidden', 'true');
                return;
            }

            offerSection.classList.remove('hidden');
            offerSection.removeAttribute('hidden');
            offerSection.setAttribute('aria-hidden', 'false');

            const now = new Date();
            
            // Configurar fecha de inicio automática
            let startDate;
            if (offerConfig.startDate === 'auto') {
                startDate = new Date();
                startDate.setHours(0, 0, 0, 0); // Inicio del día de hoy
            } else {
                startDate = new Date(offerConfig.startDate);
            }
            
            const endDate = new Date(offerConfig.endDate);
            
            // Verificar si la oferta está en el período válido
            if (now < startDate || now > endDate) {
                offerSection.classList.add('hidden');
                offerSection.setAttribute('hidden', '');
                offerSection.setAttribute('aria-hidden', 'true');
                return;
            }

            // Establecer fecha fin en el HTML
            if (offerEndDateSpan) {
                offerEndDateSpan.textContent = endDate.toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            }

            // Actualizar título si está configurado
            const titleElement = document.querySelector('.offer-title');
            if (titleElement && offerConfig.title) {
                titleElement.textContent = offerConfig.title;
            }

            const descriptionElement = document.querySelector('.offer-description');
            if (descriptionElement && offerConfig.description) {
                descriptionElement.textContent = offerConfig.description;
            }

            // Función para actualizar el contador
            function updateCountdown() {
                const currentTime = new Date().getTime();
                const target = endDate.getTime();
                const difference = target - currentTime;

                if (difference > 0) {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                    const daysEl = document.getElementById('days');
                    const hoursEl = document.getElementById('hours');
                    const minutesEl = document.getElementById('minutes');
                    const secondsEl = document.getElementById('seconds');
                    if (daysEl) daysEl.textContent = days.toString().padStart(2, '0');
                    if (hoursEl) hoursEl.textContent = hours.toString().padStart(2, '0');
                    if (minutesEl) minutesEl.textContent = minutes.toString().padStart(2, '0');
                    if (secondsEl) secondsEl.textContent = seconds.toString().padStart(2, '0');
                } else {
                    // Oferta expirada
                    offerSection.classList.add('hidden');
                    offerSection.setAttribute('hidden', '');
                    offerSection.setAttribute('aria-hidden', 'true');
                }
            }

            // Inicializar y actualizar cada segundo
            updateCountdown();
            setInterval(updateCountdown, 1000);
        }

        // Inicializar contador cuando la página cargue
        initOfferCountdown();

        // PQRS Form handling
        const pqrsForm = document.getElementById('pqrsForm');
        if (pqrsForm) {
            pqrsForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const submitBtn = this.querySelector('.pqrs-submit-btn');
                
                // Cambiar botón a estado de carga
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<span>Enviando...</span>';
                submitBtn.disabled = true;
                
                // Enviar formulario via Formspree
                fetch(this.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    if (response.ok) {
                        // Éxito
                        alert('¡Gracias! Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.');
                        this.reset();
                    } else {
                        throw new Error('Error en el envío');
                    }
                }).catch(error => {
                    // Error - intentar con mailto como fallback
                    console.log('Intentando fallback con mailto...');
                    const subject = encodeURIComponent(`PQRS - ${formData.get('tipo')}: ${formData.get('asunto')}`);
                    const body = encodeURIComponent(`
Nombre: ${formData.get('nombre')}
Email: ${formData.get('email')}
Teléfono: ${formData.get('telefono') || 'No proporcionado'}
Cédula: ${formData.get('cedula') || 'No proporcionado'}
Tipo: ${formData.get('tipo')}
Asunto: ${formData.get('asunto')}

Mensaje:
${formData.get('mensaje')}
                    `);
                    
                    window.location.href = `mailto:monteriamaster@gmail.com?subject=${subject}&body=${body}`;
                    alert('Se abrirá tu cliente de email para enviar el mensaje.');
                }).finally(() => {
                    // Restaurar botón
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
            });
        }

        // Función para crear efecto Ripple en botones
        function createRipple(event) {
            const button = event.currentTarget;
            
            // Solo aplicar si es un botón con efecto ripple
            if (!button.classList.contains('cta-button') && 
                !button.classList.contains('enrollment-button') && 
                !button.classList.contains('submit-button') && 
                !button.classList.contains('chatbot-main-button') && 
                !button.classList.contains('pqrs-submit-btn')) {
                return;
            }
            
            const ripple = document.createElement('span');
            const rect = button.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            button.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        }

        // Aplicar efecto ripple a todos los botones
        document.addEventListener('DOMContentLoaded', function() {
            // Botones con clase específica
            document.querySelectorAll('.cta-button, .enrollment-button, .submit-button, .chatbot-main-button, .pqrs-submit-btn').forEach(button => {
                button.addEventListener('click', createRipple);
            });
        });

        // ===== EFECTOS MODERNOS DE ALTO IMPACTO =====

        // 1. Header Dinámico - Cambia al hacer scroll
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });

        // 2. Scroll Animations - Fade-in al entrar en viewport
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar secciones
        document.addEventListener('DOMContentLoaded', function() {
            const sections = document.querySelectorAll('.section');
            sections.forEach(section => {
                observer.observe(section);
            });

            // Observar cards individuales
            const cards = document.querySelectorAll('.info-card, .program-card, .teacher-card, .testimonial-card');
            cards.forEach((card, index) => {
                // Delay escalonado para animación más suave
                card.style.transitionDelay = `${index * 0.1}s`;
                observer.observe(card);
            });
        });

        // 3. Tilt 3D Effect en Cards
        document.addEventListener('DOMContentLoaded', function() {
            const cards = document.querySelectorAll('.program-card, .info-card, .teacher-card, .testimonial-card');
            
            cards.forEach(card => {
                card.addEventListener('mousemove', function(e) {
                    if (!card.classList.contains('visible')) return;
                    
                    const rect = card.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    const centerX = rect.width / 2;
                    const centerY = rect.height / 2;
                    
                    const rotateX = (y - centerY) / 15;
                    const rotateY = (centerX - x) / 15;
                    
                    // Aplicar transform solo si la card es visible
                    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
                });
                
                card.addEventListener('mouseleave', function() {
                    if (card.classList.contains('visible')) {
                        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)';
                    }
                });
            });
        });

        // 4. Botón Back to Top
        document.addEventListener('DOMContentLoaded', function() {
            const backToTopButton = document.createElement('button');
            backToTopButton.className = 'back-to-top';
            backToTopButton.innerHTML = '↑';
            backToTopButton.setAttribute('aria-label', 'Volver arriba');
            backToTopButton.setAttribute('title', 'Volver arriba');
            document.body.appendChild(backToTopButton);

            // Mostrar/ocultar botón Back to Top
            window.addEventListener('scroll', function() {
                if (window.scrollY > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            });

            // Scroll suave al hacer clic
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        });
