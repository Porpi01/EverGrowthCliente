

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