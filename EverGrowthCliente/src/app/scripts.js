

 $(document).ready(function () {
  var offcanvasToggle = $('[data-bs-toggle="offcanvas"]');
  var offcanvasToggleX = $('[data-bs-toggle="offcanvas2"]');
  
  offcanvasToggle.on('click', function () {
    var offcanvasTarget = $(this).data('bs-target');
    $(offcanvasTarget).toggleClass('show');
  });

  offcanvasToggleX.on('click', function () {
    var offcanvasToggle = $(this).data('bs-target');
        $(offcanvasToggle).toggleClass('show');
  });
});
document.addEventListener("DOMContentLoaded", function() {
  var verDetallesLinks = document.querySelectorAll('.ver-detalles');

  verDetallesLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault(); // Previene el comportamiento por defecto del enlace

      // Encuentra el contenedor de detalles del pedido
      var detallesPedido = this.closest('.pedido-item').querySelector('.detalles-pedido');

      // Muestra u oculta los detalles del pedido junto con la información detallada
      detallesPedido.classList.toggle('show');
    });
  });
});