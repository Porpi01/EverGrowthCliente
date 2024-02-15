// Seleccionar el botón del toggler y el offcanvas
const toggler = document.querySelector('.navbar-toggler');
const offcanvas = document.querySelector('.offcanvas');

// Agregar un event listener al botón del toggler
toggler.addEventListener('click', function () {
  offcanvas.classList.toggle('show');
});

// Cerrar el offcanvas cuando se hace clic en un enlace del menú
const menuLinks = document.querySelectorAll('.navbar-nav .nav-link');
menuLinks.forEach(function (link) {
  link.addEventListener('click', function () {
    // Remover la clase 'show' del offcanvas al hacer clic en un enlace
    offcanvas.classList.remove('show');
  });
});