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

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<IDetallePedidoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<IDetallePedidoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
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


}
