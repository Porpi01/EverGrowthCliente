import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';

import { NavigationEnd, Router } from '@angular/router';
import { SesionService } from './../../../service/Sesion.service';
import { UsuarioService } from './../../../service/Usuario.service';
import { IProducto, IUsuario } from 'src/app/model/model.interfaces';
import { PedidoService } from 'src/app/service/Pedido.service';
import { ValoracionService } from 'src/app/service/Valoracion.service';
import { CarritoService } from './../../../service/Carrito.service';
import { CategoriaService } from './../../../service/Categoria.service';
import { ProductoService } from './../../../service/Producto.service';
import { DetallePedidoService } from 'src/app/service/DetallePedido.service';

@Component({
  selector: 'app-Home',
  templateUrl: './Home.component.html',
  styleUrls: ['./Home.component.css']
})
export class HomeComponent implements OnInit {
  productosMasStock: IProducto[] = [];
  productosMenosStock: IProducto[] = [];

  dataMasStock: any;
  dataMenosStock: any;
  data: any = {};
  username: string = '';
  userSession: IUsuario | null = null;
  url: string = '';
  options: any;
  totalUsuarios: number = 0;
  totalPedidos: number = 0;
  totalValoraciones: number = 0;
  totalCarritos: number = 0;
  totalCategoria: number = 0;
  totalProducto: number = 0;
  totalDetalles: number = 0;
  

  constructor(
    private Router: Router,
    private SesionService: SesionService,
    private UsuarioService: UsuarioService,
    private PedidoService: PedidoService,
    private ValoracionService: ValoracionService,
    private CarritoService: CarritoService,
    private CategoriaService: CategoriaService,
    private ProductoService: ProductoService,
    private DetallePedidoService: DetallePedidoService,

    private http: HttpClient
  ) {
 

    this.Router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        this.url = ev.url;
      }
    })
  }


  ngOnInit() {
    this.username = this.SesionService.getUsername();
      if (this.username) {
      this.UsuarioService.getByUsername(this.username).subscribe({
        next: (user: IUsuario) => {
          this.userSession = user;
          console.log('User Session:', this.userSession);
  
          if (this.userSession.rol === false) {
            console.log('El usuario está autenticado como administrador.');
  
            this.obtenerDatosParaGrafico();
            this.getTotalUsuarios();
            this.geTotalCategorias();
            this.getTotalProductos();
            this.getTotalCarritos();
            this.getTotalPedidos();
            this.getTotalValoraciones();
            this.getTotalDetalles();
            this.obtenerProductosMasStock();
            this.obtenerProductosMenosStock();
          } else {
          }
        },
        error: (err: HttpErrorResponse) => {
          console.log(err);
        }
      });
    } else {
      console.log('Usuario no autenticado');
    }
  }
  

  obtenerDatosParaGrafico(): void {
    this.PedidoService.obtenerCantidadPedidosPorMes()
      .subscribe(data => {
        this.procesarDatos(data);
      });
  }

  procesarDatos(data: any): void {
    if (!data) {
      console.error("La respuesta del backend está vacía");
      return;
    }

    // Obtener los nombres de los meses y la cantidad de pedidos
    const cantidades = Object.values(data);

    // Crear el conjunto de datos para la gráfica
    this.data = {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      datasets: [{
        label: 'Cantidad de pedidos',
        backgroundColor: '#ef6461',
        data: cantidades
      }]
    };

    // Opciones adicionales del gráfico (si es necesario)
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    };
  }

  obtenerProductosMasStock(): void {
    this.ProductoService.getTop10ProductosMasStock()
      .subscribe({
        next: response => {
          console.log('Respuesta:', response); // Registra la respuesta para ver su estructura
  
          // Verifica si la respuesta es un array y no está vacía
          if (Array.isArray(response) && response.length > 0) {
            this.productosMasStock = response;
  
            // Actualiza el gráfico de datos
            this.dataMasStock = {
              labels: this.productosMasStock.map(producto => producto.nombre),
              datasets: [{
                data: this.productosMasStock.map(producto => producto.stock),
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF'
                ]
              }]
            };
  
         // Define las opciones del gráfico
         this.options = {
          responsive: true,
          maintainAspectRatio: false, // Ajusta esta opción según tus necesidades
          scales: {
            y: {
              beginAtZero: true
            },
            x: {
              beginAtZero: true
            }
          }
          // Agrega más opciones según sea necesario
        };
      } else {
            console.error('La respuesta está vacía o no es un array:', response);
          }
        },
        error: err => {
          console.error('Error al obtener los datos:', err);
        }
      });
  }


  obtenerProductosMenosStock(): void {
    this.ProductoService.getTop10ProductosMenosStock()
      .subscribe(productos => {
        this.productosMenosStock = productos;
        this.dataMenosStock = {
          labels: this.productosMenosStock.map(producto => producto.nombre),
          datasets: [{
            data: this.productosMenosStock.map(producto => producto.stock),
            backgroundColor: [
              '#FF8C00', // Naranja
              '#00CED1', // Azul claro
              '#9370DB', // Lavanda
              '#FF1493', // Rosa
              '#32CD32'  // Verde lima
            ]
          }]
        };
      });
  }










  getTotalUsuarios() {
    this.UsuarioService.getTotal().subscribe({
      next: (data: number) => {
        this.totalUsuarios = data;
      
      },
      error: (error) => {
        console.error('Error al obtener el total de usuarios:', error);
      }
    });
  }

  getTotalDetalles() {
    this.DetallePedidoService.getTotal().subscribe({
      next: (data: number) => {
        this.totalDetalles = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de detalles:', error);
      }
    });
  }


  getTotalPedidos() {
    this.PedidoService.getTotal().subscribe({
      next: (data: number) => {
        this.totalPedidos = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de pedidos:', error);
      }
    });
  }
  getTotalCarritos() {
    this.CarritoService.getTotal().subscribe({
      next: (data: number) => {
        this.totalCarritos = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de carritos:', error);
      }
    });
  }
  getTotalProductos() {
    this.ProductoService.getTotal().subscribe({
      next: (data: number) => {
        this.totalProducto = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de productos:', error);
      }
    });
  }
  getTotalValoraciones() {
    this.ValoracionService.getTotal().subscribe({
      next: (data: number) => {
        this.totalValoraciones = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de valoraciones:', error);
      }
    });
  }
  geTotalCategorias() {
    this.CategoriaService.getTotal().subscribe({
      next: (data: number) => {
        this.totalCategoria = data;
      },
      error: (error) => {
        console.error('Error al obtener el total de categorias:', error);
      }
    });
  }


}
