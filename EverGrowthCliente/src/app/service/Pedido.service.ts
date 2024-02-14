import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IPedido, IPedidoPage } from '../model/model.interfaces';

@Injectable()
export class PedidoService {

  sUrl: string = API_URL + "/pedido";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<IPedido> {
    return this.http.get<IPedido>(this.sUrl + "/" + id);
  }


  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_usuario:number,strFilter?: string): Observable<IPedidoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;

    let sUrl_usuario = "";
    if (id_usuario > 0) {
      sUrl_usuario = "&usuario=" + id_usuario;
    }

    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<IPedidoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection +  sUrl_usuario + sUrl_filter);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(Pedido: IPedido): Observable<IPedido> {
    return this.http.post<IPedido>(this.sUrl, Pedido);
  }

  updateOne(Pedido: IPedido): Observable<IPedido> {
    return this.http.put<IPedido>(this.sUrl, Pedido);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }

  makeProductPurhase(product_id: number, user_id: number, amount: number): Observable<IPedido> {
    return this.http.post<IPedido>(this.sUrl + '/realizarCompraProducto/' + product_id + '/' + user_id + '/' + amount, {});
}

getCompraByUsuarioId(usuarioId: number, size: number, page: number, direction: string, sort: string): Observable<IPedidoPage> {
  return this.http.get<IPedidoPage>(this.sUrl + '/usuario/' + usuarioId + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
createCompraUnicoCarrito(usuarioId: number, carritoId: number): Observable<IPedido> {
  return this.http.post<IPedido>(this.sUrl + '/realizarCompraUnicoCarrito/' + usuarioId + '/' + carritoId, {});
}

createCompraTodosCarritos(usuarioId: number): Observable<IPedido> {
  return this.http.post<IPedido>(this.sUrl + '/realizarCompraTodosCarritos/' + usuarioId, {});
}

createCompraProducto(productoId: number, usuarioId: number, cantidad: number): Observable<IPedido> {
  return this.http.post<IPedido>(this.sUrl+ '/realizarCompraProducto/' + productoId + '/' + usuarioId + '/' + cantidad, {});
}


}
