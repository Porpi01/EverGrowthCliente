import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IValoracion, IValoracionPage } from '../model/model.interfaces';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';

@Injectable()
export class ValoracionService {

  sUrl: string = API_URL + "/valoracion";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<IValoracion> {
    return this.http.get<IValoracion>(this.sUrl + "/" + id);
  }
 

  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, id_usuario: number , id_producto: number, strFilter?: string): Observable<IValoracionPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;

    let strUrlUser = "";
    if (id_usuario > 0) {
        strUrlUser = "&usuario=" + id_usuario;
    }

    let strUrlProduct = "";
    if (id_producto > 0) {
      strUrlProduct = "&producto=" + id_producto;
    }

    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
  
    return this.http.get<IValoracionPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection+strUrlUser + strUrlProduct  + sUrl_filter);
  }



  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(Valoracion: IValoracion): Observable<IValoracion> {
    return this.http.post<IValoracion>(this.sUrl, Valoracion);
  }

  updateOne(Valoracion: IValoracion): Observable<IValoracion> {
    return this.http.put<IValoracion>(this.sUrl, Valoracion);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }

}
