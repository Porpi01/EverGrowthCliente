/* // Seleccionar el botón del toggler y el offcanvas
const toggler = document.querySelectorAll('.navbar-toggler');
const offcanvas = document.querySelectorAll('.offcanvas');

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
}); */

 // Espera a que el documento esté completamente cargado
 $(document).ready(function () {
  // Selecciona el elemento del botón del navbar que activa el offcanvas
  var offcanvasToggle = $('[data-bs-toggle="offcanvas"]');
  var offcanvasToggleX = $('[data-bs-toggle="offcanvas2"]');
  
  // Agrega un evento de clic al botón del navbar
  offcanvasToggle.on('click', function () {
    // Obtiene el objetivo del offcanvas del atributo data-bs-target
    var offcanvasTarget = $(this).data('bs-target');

    // Abre o cierra el offcanvas según su estado actual
    $(offcanvasTarget).toggleClass('show');
  });

  offcanvasToggleX.on('click', function () {
    // Obtiene el objetivo del offcanvas del atributo data-bs-target
    var offcanvasToggle = $(this).data('bs-target');
    
    // Abre o cierra el offcanvas según su estado actual
    $(offcanvasToggle).toggleClass('show');
  });
});