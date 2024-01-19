import { Injectable } from '@angular/core';
import { ICategoria, ICategoriaPage } from '../model/model.interfaces';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {


  sUrl: string = API_URL + "/categoria";
  constructor(
    private http: HttpClient
  ) { }

  getOne(id: number): Observable<ICategoria> {
    return this.http.get<ICategoria>(this.sUrl + "/" + id);
  }


  getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<ICategoriaPage> {
    let sUrl_filter: string;
    if (!size) size = 10;
    if (!page) page = 0;
    if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
    } else {
      sUrl_filter = "";
    }
    return this.http.get<ICategoriaPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
  }

  removeOne(id: number | undefined): Observable<number> {
    if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
    } else {
      return new Observable<number>();
    }
  }

  newOne(Categoria: ICategoria): Observable<ICategoria> {
    return this.http.post<ICategoria>(this.sUrl, Categoria);
  }

  updateOne(Categoria: ICategoria): Observable<ICategoria> {
    return this.http.put<ICategoria>(this.sUrl, Categoria);
  }

  generateRandom(amount: number): Observable<number> {
    return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
  }

  empty(): Observable<number> {
    return this.http.delete<number>(this.sUrl + "/empty");
  }

}
