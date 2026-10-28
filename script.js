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
        '"Confía en tu ser<br>Que mañana puede cambiar<br>Aprecia cada amanecer<br>Y haz realidad lo que vayas a desear"'
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

// =========================================
// ANIMACIÓN: APARICIÓN SUAVE AL HACER SCROLL
// =========================================
// Qué elementos se animan. Para agregar o quitar algo, solo edita esta lista.
const selectoresRevelar = [
    'section:not(.hero-section) h2',   // títulos de sección
    '#habilidades p.small',            // leyenda de los puntitos
    '#sobre-mi .card',
    '#habilidades .card',
    '#experiencia .exp-card',
    '#proyectos .card',
    '#formacion .card',
    '#formacion .form-subtitulo'
];

const prefiereMenosMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Solo se anima si el navegador lo soporta y la persona no pidió menos movimiento.
// Si algo falla, los elementos simplemente se quedan visibles como siempre.
if ('IntersectionObserver' in window && !prefiereMenosMovimiento) {
    const elementos = document.querySelectorAll(selectoresRevelar.join(', '));

    const observadorRevelar = new IntersectionObserver((entradas, observador) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('visible');
                observador.unobserve(entrada.target); // se anima una sola vez
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    elementos.forEach(el => {
        // Efecto "cascada": las tarjetas de una misma fila aparecen una tras otra
        const columna = el.closest('[class*="col-"]');
        if (columna && columna.parentElement) {
            const posicion = Array.from(columna.parentElement.children).indexOf(columna);
            el.style.animationDelay = `${(posicion % 4) * 100}ms`;
        }

        el.classList.add('revelar');
        observadorRevelar.observe(el);
    });
}

// =========================================
// LADO CREATIVO: PARTÍCULAS TIPO TINTA
// (todo va dentro de una función para no chocar con otras variables del archivo)
// =========================================
(() => {
    const seccion = document.getElementById('lado-creativo');
    const lienzo = document.getElementById('lienzo-particulas');
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Si falta algo o la persona pidió menos movimiento, no se dibuja nada
    if (!seccion || !lienzo || !lienzo.getContext || reducirMovimiento) return;

    const ctx = lienzo.getContext('2d');
    const colores = ['242, 235, 213', '213, 232, 242', '255, 255, 255']; // crema, azul clarito, blanco
    const RADIO_MOUSE = 90;      // qué tan cerca debe pasar el mouse para empujar las partículas
    const FUERZA_MOUSE = 1.2;    // qué tan fuerte las empuja
    let particulas = [];
    let ancho = 0;
    let alto = 0;
    let animacionId = null;
    const mouse = { x: -9999, y: -9999 };

    function crearParticula() {
        return {
            x: Math.random() * ancho,
            y: Math.random() * alto,
            radio: 1 + Math.random() * 2.2,
            vy: 0.15 + Math.random() * 0.35,          // velocidad hacia arriba
            vx: (Math.random() - 0.5) * 0.2,          // pequeño desvío lateral
            alfa: 0.15 + Math.random() * 0.35,        // transparencia
            color: colores[Math.floor(Math.random() * colores.length)]
        };
    }

    // Ajusta el lienzo al tamaño de la sección (nítido también en pantallas retina)
    function ajustarLienzo() {
        const escala = window.devicePixelRatio || 1;
        alto = seccion.offsetHeight;
        lienzo.width = ancho * escala;
        lienzo.height = alto * escala;
        ctx.setTransform(escala, 0, 0, escala, 0, 0);
    }

    // Crea las partículas: 1 por cada 18px de ancho, máximo 90 (en celular salen menos)
    function reiniciar() {
        ancho = seccion.offsetWidth;
        ajustarLienzo();
        const cantidad = Math.min(90, Math.round(ancho / 18));
        particulas = Array.from({ length: cantidad }, crearParticula);
    }

    function dibujar() {
        ctx.clearRect(0, 0, ancho, alto);

        for (const p of particulas) {
            // Se apartan del mouse
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const distancia = Math.hypot(dx, dy);
            if (distancia > 0 && distancia < RADIO_MOUSE) {
                p.x += (dx / distancia) * FUERZA_MOUSE;
                p.y += (dy / distancia) * FUERZA_MOUSE;
            }

            // Flotan hacia arriba
            p.y -= p.vy;
            p.x += p.vx;

            // Si salen por arriba, regresan por abajo; si salen por un lado, entran por el otro
            if (p.y < -10) { p.y = alto + 10; p.x = Math.random() * ancho; }
            if (p.x < -10) p.x = ancho + 10;
            else if (p.x > ancho + 10) p.x = -10;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radio, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color}, ${p.alfa})`;
            ctx.fill();
        }

        animacionId = requestAnimationFrame(dibujar);
    }

    function iniciar() {
        if (!animacionId) animacionId = requestAnimationFrame(dibujar);
    }

    function detener() {
        cancelAnimationFrame(animacionId);
        animacionId = null;
    }

    // Solo se anima mientras la sección está en pantalla (ahorra batería y procesador)
    new IntersectionObserver(([entrada]) => {
        if (entrada.isIntersecting) iniciar();
        else detener();
    }).observe(seccion);

    // Posición del mouse relativa a la sección
    seccion.addEventListener('mousemove', (e) => {
        const r = seccion.getBoundingClientRect();
        mouse.x = e.clientX - r.left;
        mouse.y = e.clientY - r.top;
    });
    seccion.addEventListener('mouseleave', () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    // Si cambia el ancho (girar el celular, cambiar tamaño de ventana) se recrean las partículas;
    // si solo cambia el alto (por ejemplo, mientras se escribe el poema) solo se ajusta el lienzo
    new ResizeObserver(() => {
        if (seccion.offsetWidth !== ancho) reiniciar();
        else if (seccion.offsetHeight !== alto) ajustarLienzo();
    }).observe(seccion);

    reiniciar();
})();