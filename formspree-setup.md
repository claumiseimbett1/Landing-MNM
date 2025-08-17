# 📧 Configuración de Formspree para PQRS

## 🚀 **Pasos para activar el envío de emails**

### **Paso 1: Registrarse en Formspree**
1. Ir a [https://formspree.io](https://formspree.io)
2. Hacer clic en "Get Started Free"
3. Registrarse con el email: **monteriamaster@gmail.com**
4. Verificar el email

### **Paso 2: Crear un nuevo formulario**
1. En el dashboard, hacer clic en "New Form"
2. Configurar:
   - **Form Name**: PQRS Club Natación MNM
   - **Email**: monteriamaster@gmail.com
   - **Send confirmation emails to submitters**: Activar
3. Hacer clic en "Create Form"

### **Paso 3: Obtener el Form ID**
1. Copiar el Form ID que aparece (ejemplo: `mxxxxxxx`)
2. En el código HTML, reemplazar `YOUR_FORM_ID` con el ID real:

```html
<!-- Cambiar esta línea: -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">

<!-- Por esta (con tu ID real): -->
<form action="https://formspree.io/f/mxxxxxxx" method="POST">
```

### **Paso 4: Configurar reCAPTCHA (Opcional)**
1. En Formspree dashboard → Settings
2. Activar "Enable reCAPTCHA"
3. Esto previene spam automático

## 📋 **Configuración actual implementada**

El formulario ya está configurado con:
- ✅ **Método POST** para envío directo
- ✅ **Campos requeridos** validados
- ✅ **Email de destino**: monteriamaster@gmail.com
- ✅ **Asunto automático** con tipo de PQRS
- ✅ **Redirección** después del envío
- ✅ **Fallback** a mailto si falla Formspree
- ✅ **Validación JavaScript** antes del envío

## 🔄 **Alternativas si no quieres usar Formspree**

### **Opción 1: EmailJS (Gratuito hasta 200 emails/mes)**
1. Registrarse en [https://emailjs.com](https://emailjs.com)
2. Conectar con Gmail (monteriamaster@gmail.com)
3. Configurar template de email
4. Reemplazar el JavaScript actual

### **Opción 2: Netlify Forms (Si usas Netlify hosting)**
1. Cambiar el form tag a:
```html
<form name="pqrs" method="POST" data-netlify="true">
```

### **Opción 3: PHP Script (Requiere servidor web)**
Si tienes hosting con PHP, puedo crear un script PHP para enviar emails.

## ✅ **Estado actual**

- 🟡 **PQRS configurado** pero necesita Form ID de Formspree
- 🟢 **Fallback funcional** con mailto
- 🟢 **Validación completa** implementada
- 🟢 **UI responsive** y profesional

## 🚨 **Próximo paso crítico**

**Completar la configuración de Formspree** reemplazando `YOUR_FORM_ID` con el ID real para activar el envío automático de emails a monteriamaster@gmail.com

Una vez configurado, el formulario enviará emails automáticamente sin necesidad de que el usuario abra su cliente de email.