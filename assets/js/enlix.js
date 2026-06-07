/**
 * Enlix — Interactividad del sitio
 * Scroll compacto para la barra de navegación
 * Menú desplegable jerárquico adaptado a móviles.
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ */
  /*  1. NAVBAR — Compactación al hacer scroll                          */
  /* ------------------------------------------------------------------ */

  /**
   * Aplica o remueve la clase `scrolled` sobre la barra de navegación
   * según la posición vertical de la ventana.  El umbral está fijado
   * en 50 px para que el efecto se active temprano.
   */
  function updateNavbarOnScroll() {
    var navbar = document.querySelector('.enlix-navbar');
    if (!navbar) return;

    var threshold = 50;
    var method = window.scrollY > threshold ? 'add' : 'remove';
    navbar.classList[method]('scrolled');
  }

  /**
   * Versión con throttling de la función anterior.
   * Se ejecuta como mucho cada 100 ms para no saturar el hilo principal.
   */
  var throttledScroll = (function () {
    var waiting = false;
    return function () {
      if (waiting) return;
      waiting = true;
      window.requestAnimationFrame(function () {
        updateNavbarOnScroll();
        waiting = false;
      });
    };
  })();

  /* ------------------------------------------------------------------ */
  /*  2. MENÚ MÓVIL — Acordeón para los flyout anidados                 */
  /* ------------------------------------------------------------------ */

  /**
   * Útil para saber si estamos por debajo del breakpoint
   * Bootstrap `lg` (991.98 px).
   */
  function isMobile() {
    return window.innerWidth < 992;
  }

  /**
   * Configura el comportamiento táctil del menú en pantallas pequeñas:
   *   – Un clic/tap sobre una categoría (.flyout-link) abre o cierra su
   *     sublista (.flyout-sub) aplicando/removiendo la clase `is-open`.
   *   – Sólo una categoría puede estar abierta a la vez.
   *   – Al cerrar el menú hamburguesa se resetean todas las categorías.
   */
  function setupMobileMenu() {
    var nav = document.getElementById('enlixNav');
    if (!nav) return;

    /* --- Delegación de evento en el contenedor colapsable --- */
    nav.addEventListener('click', function (e) {
      if (!isMobile()) return;

      var link = e.target.closest('.flyout-link');
      if (!link) return;

      var item = link.closest('.flyout-item');
      if (!item || !item.querySelector('.flyout-sub')) return;

      e.preventDefault();

      var wasOpen = item.classList.contains('is-open');

      /* Cierra todas las demás categorías abiertas */
      nav.querySelectorAll('.flyout-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
      });

      /* Abre sólo la que se acaba de pulsar si no lo estaba */
      if (!wasOpen) {
        item.classList.add('is-open');
        /* Desplazamiento suave para que la categoría abierta quede visible */
        setTimeout(function () {
          item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 80);
      }
    });

    /* --- Al cerrar el menú colapsable se reinicia el acordeón --- */
    nav.addEventListener('hide.bs.collapse', function () {
      nav.querySelectorAll('.flyout-item.is-open').forEach(function (el) {
        el.classList.remove('is-open');
      });
    });
  }

  /* ------------------------------------------------------------------ */
  /*  3. ARRANQUE                                                       */
  /* ------------------------------------------------------------------ */

  function init() {
    /* Lee el estado inicial del scroll */
    updateNavbarOnScroll();
    /* Escucha el scroll con throttling */
    window.addEventListener('scroll', throttledScroll, { passive: true });
    /* Prepara el menú móvil */
    setupMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
