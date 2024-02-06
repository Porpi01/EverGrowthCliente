import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';
import { IProducto, IProductoPage } from '../model/model.interfaces';

@Injectable()
export class ProductoService {
  sUrl: string = API_URL + "/producto";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<IProducto> {
    return this.http.get<IProducto>(this.sUrl + "/" + id);
  }


  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_categoria:number, strFilter?: string): Observable<IProductoPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;

    let sUrl_categoria = "";
    if (id_categoria > 0) {
      sUrl_categoria = "&categoria=" + id_categoria;
    }
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<IProductoPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_categoria + sUrl_filter);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(Producto: IProducto): Observable<IProducto> {
    return this.http.post<IProducto>(this.sUrl, Producto);
  }

  updateOne(Producto: IProducto): Observable<IProducto> {
    return this.http.put<IProducto>(this.sUrl, Producto);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }

 
}