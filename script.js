// Script Anti-Scraping y Notificación Toast
    function copiarContacto(tipo) {
        const usuarioCorreo = "ddfrubi15"; 
        const dominioCorreo = "gmail.com";
        const lada = "+52 ";
        const telParte1 = "55 5463 ";
        const telParte2 = "6710";
        const numeroTel = telParte1 + telParte2; 

        let textoACopiar = "";
        let mensajeToast = "";

        if (tipo === 'email') {
            textoACopiar = usuarioCorreo + "@" + dominioCorreo;
            mensajeToast = "📧 ¡Correo copiado: " + textoACopiar + "!";
        } else if (tipo === 'tel') {
            textoACopiar = lada + numeroTel;
            mensajeToast = "📱 ¡Teléfono copiado: " + textoACopiar + "!";
        }

        // Copiar al portapapeles
        navigator.clipboard.writeText(textoACopiar).then(() => {
            mostrarToast(mensajeToast);
        }).catch(err => {
            console.error('Error al copiar: ', err);
        });
    }

    function mostrarToast(mensaje) {
        const toast = document.getElementById("toast-notificacion");
        toast.innerText = mensaje;
        toast.classList.add("mostrar");

        // Ocultar automáticamente después de 3 segundos
        setTimeout(() => {
            toast.classList.remove("mostrar");
        }, 3000);
    }

    function abrirWhatsApp() {
        const telParte1 = "55 5463 ";
        const telParte2 = "6710";
        // Usas las variables que ya tienes ofuscadas de la Fase 1
        const miTelefono = telParte1 + telParte2; 
        
        // Le quitamos los espacios al número para que la URL funcione bien
        const numeroLimpio = miTelefono.replace(/\s+/g, ''); 
        
        // El mensaje predeterminado
        const mensaje = "Hola Diego, vi tu portafolio y me gustaría platicar contigo sobre un proyecto.";
        
        // Creamos el link oficial de WhatsApp y lo abrimos en otra pestaña
        const url = `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
    }
// =========================================
// CONFIGURACIÓN DE EFECTO MÁQUINA DE ESCRIBIR (Typed.js)
// =========================================

// 1. Frase Gancho (Hero Section) - Inicia de inmediato
const optionsHook = {
    strings: ['Construyendo lógica en el código y valor en los negocios'],
    typeSpeed: 50, // Milisegundos por letra
    startDelay: 500, // Retraso antes de iniciar
    showCursor: true,
    cursorChar: '|'
};
new Typed('#typed-hook', optionsHook);


// 2. Poema (Lado Creativo) - Inicia al hacer Scroll
const stringsPoema = [
    '"Confía en tu ser<br>Que mañana puede cambiar<br>Aprecia cada amanecer<br>Y has realidad lo que vayas a desear"'
];

const optionsPoema = {
    strings: stringsPoema,
    typeSpeed: 80,
    startDelay: 300,
    showCursor: false // Sin cursor para el poema, se ve más elegante
};

// Función para detectar cuando el poema es visible
const observadorPoema = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Solo inicia si el elemento es visible y NO se ha escrito ya
            if (!entry.target.classList.contains('typed-done')) {
                new Typed('#typed-poema', optionsPoema);
                entry.target.classList.add('typed-done'); // Evita que se repita
            }
            observer.unobserve(entry.target); // Deja de vigilar
        }
    });
}, { threshold: 0.5 }); // Inicia cuando el 50% es visible

// Vigilar el contenedor del poema
observadorPoema.observe(document.getElementById('typed-poema'));

// =========================================
// FORMULARIO DE CONTACTO (JavaScript simple, sin React)
// =========================================
const formContacto = document.getElementById('form-contacto');

if (formContacto) {
    const selectAsunto = document.getElementById('campo-asunto');
    const grupoAsuntoOtro = document.getElementById('grupo-asunto-otro');
    const selectPreferencia = document.getElementById('campo-preferencia');
    const grupoTelefono = document.getElementById('grupo-telefono');
    const grupoLinkedin = document.getElementById('grupo-linkedin');
    const btnEnviar = document.getElementById('btn-enviar');
    const textoOriginalBoton = btnEnviar.innerHTML;
    const alertaError = document.getElementById('contacto-error');
    const cajaExito = document.getElementById('contacto-exito');
    const textoExito = document.getElementById('contacto-exito-texto');
    const btnOtroMensaje = document.getElementById('btn-otro-mensaje');

    // Cómo se nombra cada medio dentro del mensaje de éxito
    const nombreMedio = {
        'Correo electrónico': 'correo',
        'WhatsApp': 'WhatsApp',
        'Llamada telefónica': 'teléfono',
        'LinkedIn': 'LinkedIn'
    };

    // Muestra u oculta un campo condicional.
    // Si está oculto también se desactiva: así no se envía vacío ni bloquea el envío por ser "obligatorio".
    function mostrarCampo(grupo, mostrar) {
        const input = grupo.querySelector('input');
        grupo.hidden = !mostrar;
        input.disabled = !mostrar;
        input.required = mostrar;
        if (!mostrar) input.value = '';
    }

    // "Otro" en Asunto -> aparece el campo para escribir el asunto
    selectAsunto.addEventListener('change', () => {
        mostrarCampo(grupoAsuntoOtro, selectAsunto.value === 'Otro');
    });

    // WhatsApp o Llamada -> pide teléfono | LinkedIn -> pide perfil
    selectPreferencia.addEventListener('change', () => {
        const medio = selectPreferencia.value;
        mostrarCampo(grupoTelefono, medio === 'WhatsApp' || medio === 'Llamada telefónica');
        mostrarCampo(grupoLinkedin, medio === 'LinkedIn');
    });

    // Envío a Formspree sin recargar la página
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        alertaError.hidden = true;
        btnEnviar.disabled = true;
        btnEnviar.innerHTML = '<i class="fa-solid fa-spinner fa-spin me-2"></i> Enviando...';

        try {
            const respuesta = await fetch(formContacto.action, {
                method: 'POST',
                body: new FormData(formContacto),
                headers: { 'Accept': 'application/json' }
            });

            if (!respuesta.ok) throw new Error('Formspree respondió con un error');

            // Mensaje de éxito personalizado según el medio que eligió
            const medio = nombreMedio[selectPreferencia.value] || 'correo';
            textoExito.textContent = `Gracias por escribirme. Revisaré tu mensaje y te contactaré por ${medio} lo más pronto posible.`;

            // Limpiar el formulario y regresar los campos condicionales a su estado inicial
            formContacto.reset();
            mostrarCampo(grupoAsuntoOtro, false);
            mostrarCampo(grupoTelefono, false);
            mostrarCampo(grupoLinkedin, false);

            formContacto.hidden = true;
            cajaExito.hidden = false;
        } catch (error) {
            console.error('Error al enviar el formulario:', error);
            alertaError.hidden = false;
        } finally {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = textoOriginalBoton;
        }
    });

    // "Enviar otro mensaje" -> vuelve a mostrar el formulario vacío
    btnOtroMensaje.addEventListener('click', () => {
        cajaExito.hidden = true;
        formContacto.hidden = false;
    });
}