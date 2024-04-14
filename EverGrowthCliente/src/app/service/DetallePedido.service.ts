import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IDetallePedido, IDetallePedidoPage } from '../model/model.interfaces';

@Injectable()
export class DetallePedidoService {

  sUrl: string = API_URL + "/detallePedido";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<IDetallePedido> {
    return this.http.get<IDetallePedido>(this.sUrl + "/" + id);
  }
  getTotal(): Observable<number> {
    return this.http.get<number>(this.sUrl + "/total");
  }
  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_pedido:number , id_producto:number, strFilter?: string): Observable<IDetallePedidoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;

    let strUrlPedido = "";
    if (id_pedido > 0) {
        strUrlPedido = "&pedido=" + id_pedido;
    }

    let strUrlProducto = "";
    if (id_producto > 0) {
      strUrlProducto = "&producto=" + id_producto;
    }
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<IDetallePedidoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + strUrlPedido + strUrlProducto + sUrl_filter);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(DetallePedido: IDetallePedido): Observable<IDetallePedido> {
    return this.http.post<IDetallePedido>(this.sUrl, DetallePedido);
  }

  updateOne(DetallePedido: IDetallePedido): Observable<IDetallePedido> {
    return this.http.put<IDetallePedido>(this.sUrl, DetallePedido);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }

  getDetallesPorPedido(id_pedido: number): Observable<IDetallePedido[]> {
    return this.http.get<IDetallePedido[]>(this.sUrl + "/pedido/" + id_pedido);
  }

  getDetallesPorPedidoId(id_pedido: number, size: number, page: number, sort: string, direction: string): Observable<IDetallePedidoPage> {
    return this.http.get<IDetallePedidoPage>(this.sUrl + '/bypedido/' + id_pedido + '?size=' + size + '&page=' + page + '&sort=' + sort + ',' + direction);
}
}
