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


  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<ICarritoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<ICarritoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
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


}
