import { Injectable } from '@angular/core';
import { ICarrito, ICarritoPage } from '../model/model.interfaces';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {


  sUrl: string = API_URL + "/carrito";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<ICarrito> {
    return this.http.get<ICarrito>(this.sUrl + "/" + id);
  }

  getTotal(): Observable<number> {
    return this.http.get<number>(this.sUrl + "/total");
  }

  countCarritos(): Observable<number> {
    return this.http.get<number>(this.sUrl + "/cantidad");
  }

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_producto: number, id_usuario: number, strFilter?: string): Observable<ICarritoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;

    let strUrlProducto = "";
    if (id_producto > 0) {
      strUrlProducto = "&producto=" + id_producto;
    }

    let strUrlUsuario = "";
    if (id_usuario > 0) {
      strUrlUsuario = "&usuario=" + id_usuario;
    }
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<ICarritoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlUsuario + strUrlProducto + sUrl_filter);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(Carrito: ICarrito): Observable<ICarrito> {
    return this.http.post<ICarrito>(this.sUrl, Carrito);
  }

  updateOne(Carrito: ICarrito): Observable<ICarrito> {
    return this.http.put<ICarrito>(this.sUrl, Carrito);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }
  addToCart(idUsuario: number, idProducto: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/agregarProducto?idUsuario=${idUsuario}&idProducto=${idProducto}", null);
  }

  getCarritosByUsuario(usuarioId: number, size: number, page: number, sort: string, direction: string): Observable<ICarritoPage> {
    return this.http.get<ICarritoPage>(this.sUrl + '/usuario/' + usuarioId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
  }

  getCarritoByUsuarioAndPRoducto(usuarioId: number, productoId: number): Observable<ICarrito> {
    return this.http.get<ICarrito>(this.sUrl + '/usuario/' + usuarioId + '/producto/' + productoId);
  }

  deleteCarritoByUsuario(usuarioId: number): Observable<number> {
    return this.http.delete<number>(this.sUrl + '/usuario/' + usuarioId);
  }

  getCosteCarrito(id: number): Observable<number> {
    return this.http.get<number>(this.sUrl + '/coste/' + id);
  }

  getCosteCarritoByUsuario(usuarioId: number): Observable<number> {
    return this.http.get<number>(this.sUrl + '/costetotal/' + usuarioId);
  }

}
