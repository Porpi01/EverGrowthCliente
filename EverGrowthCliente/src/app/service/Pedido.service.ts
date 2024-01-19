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


  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<IPedidoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<IPedidoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
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

}
