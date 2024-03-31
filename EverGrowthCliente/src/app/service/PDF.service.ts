import { Injectable } from '@angular/core';
import { IDetallePedido, IPedido, IUsuario } from '../model/model.interfaces';
import { PedidoService } from 'src/app/service/Pedido.service';
import { UsuarioService } from 'src/app/service/Usuario.service';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';
import { jsPDF } from "jspdf";
import { CarritoService } from './Carrito.service';


@Injectable({
  providedIn: 'root'
})
export class PDFService {

  constructor(

    private DetallePedidoService: DetallePedidoService,
    private CarritoService: CarritoService
  ) { }

  imprimirFactura(id_pedido: number): void {
    this.DetallePedidoService.getDetallesPorPedido(id_pedido).subscribe({
      next: (response: any) => {
        if (response && response.content) {
          const detallesPedido: IDetallePedido[] = response.content;
          console.log('Detalles de pedido:', detallesPedido);
          const doc = new jsPDF();
          doc.setFont('Arial');
          doc.setFontSize(12);
          this.cabecera(doc, detallesPedido);
          this.contenido(doc, detallesPedido);
          this.pieDePagina(doc, doc.getNumberOfPages());
          console.log('Número de páginas:', doc.getNumberOfPages());

          doc.save('factura.pdf');
        } else {
          console.error('No se encontraron detalles de pedido en la respuesta');
        }
      },
      error: (error: any) => {
        console.error('Error al obtener detalles de pedido:', error);
      }
    });
  }

  private cabecera(doc: any, detallesPedido: IDetallePedido[]): void {
    const gris = "#ccc";
    doc.setDrawColor(gris);
    doc.line(10, 18, 200, 18);
    doc.setFont('Arial', 'bold');
    const logoImg = new Image();
    logoImg.src = "http://localhost:8085/media/Logo-removebg-preview%20(1).png";
    doc.addImage(logoImg, 'PNG', 10, 25, 50, 15);
    doc.setFontSize(11);
    doc.text(135, 27, "EverGrowth");
    doc.text(135, 31, "Calle Pouet del Valenciano, 46190,");
    doc.text(135, 35, "Riba-roja de Túria, Valencia, España");
    doc.text(135, 39, "monica@evergrowth.com");
    doc.text(135, 43, "643291778");
    doc.setDrawColor(gris);
    doc.line(10, 50, 200, 50);
  }

  private contenido(doc: any, detallesPedido: IDetallePedido[]): void {
    const gris = "#ccc";
    let index = 0;
    let total = 0;

    const fechaPedido = new Date(detallesPedido[0].pedidos.fecha_pedido);
    const fechaPedidoFormateada = fechaPedido.toLocaleDateString();
    doc.setFontSize(11);
    doc.setFont('Arial', 'normal');
    doc.text(`Fecha de pedido: ${fechaPedidoFormateada}`, 10, 60 + index * 120);
    doc.text(`Número de factura:  ${detallesPedido[0].pedidos.factura}`, 10, 64 + index * 120);

    doc.setFontSize(13);
    doc.setFont('Arial', 'bold');
    doc.text(10, 75 + index * 120, "Datos del cliente");
    doc.setFont('Arial', 'normal');
    doc.setFontSize(11);
    doc.text(`${detallesPedido[0].pedidos.user.nombre} ${detallesPedido[0].pedidos.user.apellido1}  ${detallesPedido[0].pedidos.user.apellido2}`, 10, 81 + index * 120);
    doc.text(`${detallesPedido[0].pedidos.user.direccion}`, 10, 85 + index * 120);
    doc.text(`${detallesPedido[0].pedidos.user.telefono}`, 10, 89 + index * 120);
    doc.text(`${detallesPedido[0].pedidos.user.email}`, 10, 93 + index * 120);
    doc.line(10, 100 + index * 120, 200, 100 + index * 120);
    doc.setFontSize(11);
    doc.setFont('Arial', 'bold');
    doc.text("CÓDIGO", 10, 105 + index * 120);
    doc.text("CONCEPTO", 45, 105 + index * 120);
    doc.text("PRECIO", 120, 105 + index * 120);
    doc.text("CANTIDAD", 150, 105 + index * 120);
    doc.text("IMPORTE", 180, 105 + index * 120);


    detallesPedido.forEach(detalle => {
      const importe = detalle.productos.precio * detalle.cantidad;
      total += importe;

      doc.setFontSize(11);
      doc.setFont('Arial', 'normal');

      const y = 109 + index * 10; // Espacio entre los productos

      doc.text(`${detalle.productos.id}`, 10, y);
      doc.text(`${detalle.productos.nombre}`, 45, y);
      doc.text(`${detalle.productos.descripcion}`, 45, y + 4);
      doc.text(`${detalle.productos.precio} €`, 120, y);
      doc.text(`${detalle.cantidad}`, 150, y);
      doc.text(importe.toFixed(2) + "€", 180, y);
      doc.setFont('Arial', 'bold');

      index++;
    });

     // Calcular el IVA del 0%
     const iva = 21;
     const totalConIVA = total * (1 + iva / 100);
 
     // Mostrar el total con el IVA
     doc.setFontSize(11);
     doc.setFont('Arial', 'bold');
     doc.text("BASE IMPONIBLE: ", 135, 140 + index * 10); // Ajusta la posición vertical según el número de productos
     doc.text( total.toFixed(2) + "€", 180, 140 + index * 10); // Ajusta la posición vertical según el número de productos

     doc.text("IVA (21%):", 135, 145 + index * 10); // Ajusta la posición vertical según el número de productos
     doc.text((totalConIVA - total).toFixed(2) + "€", 180, 145 + index * 10); // Ajusta la posición vertical según el número de productos

     doc.text("TOTAL CON IVA:", 135, 150 + index * 10); // Ajusta la posición vertical según el número de productos
     doc.text(totalConIVA.toFixed(2) + "€", 180, 150 + index * 10); // Ajusta la posición vertical según el número de productos
 
   

  }
  private pieDePagina(doc: any, numeroPaginas: number): void {
    const gris = "#ccc";

    // Formas de pago
    const formasPago = `
      Formas de Pago:
  
      Aceptamos los siguientes métodos de pago:
      - Tarjeta de crédito
      - Transferencia bancaria
      - PayPal
    `;

    // Agregar pie de página a cada página
    for (let i = 1; i <= numeroPaginas; i++) {
      doc.setPage(i);
      doc.setFontSize(11);
      doc.setFont('Arial', 'normal');
      doc.text("Términos y Condiciones:\n\n1. Los productos adquiridos a través de esta factura están sujetos a disponibilidad.\n2. Los precios indicados pueden estar sujetos a cambios sin previo aviso.\n3. Las devoluciones solo se aceptarán dentro de los 15 días posteriores a la compra.\n4. Los productos devueltos deben estar en condiciones originales y sin usar.\n\n¡Gracias por su compra!", 10, 200, { maxWidth: 190 });

      // Agregar formas de pago
      doc.text(formasPago, 10, 243, { maxWidth: 190 });
      doc.setDrawColor(gris);
      doc.line(10, 240, 200, 240);

      // Agregar número de página
      doc.text(`Página ${i} de ${numeroPaginas}`, 160, 278);
      console.log('Número de página:', i);
    }
  }
}