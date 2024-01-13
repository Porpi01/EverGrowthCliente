import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from 'src/environment/environment.component';
import { IUsuario, IUsuarioPage } from '../model/model.interfaces';

@Injectable()
export class UsuarioService {

   sUrl: string = API_URL + "/usuario";
constructor(
  private http: HttpClient
) { }

getOne(id: number): Observable<IUsuario> {
  return this.http.get<IUsuario>(this.sUrl + "/" + id);
}

getByUsername(username: string): Observable<IUsuario> {
  return this.http.get<IUsuario>(this.sUrl + "/byUsername/" + username);
}

getPage(size: number | undefined, page: number | undefined, orderField: string, orderDirection: string, strFilter?: string): Observable<IUsuarioPage> {
  let sUrl_filter: string;
  if (!size) size = 10;
  if (!page) page = 0;    
  if (strFilter && strFilter.trim().length > 0) {
      sUrl_filter = `&filter=${strFilter}`;
  } else {
      sUrl_filter = "";
  }
  return this.http.get<IUsuarioPage>(this.sUrl + "?size=" + size + "&page=" + page + "&sort=" + orderField + "," + orderDirection + sUrl_filter);
}

removeOne(id: number | undefined): Observable<number> {
  if (id) {
      return this.http.delete<number>(this.sUrl + "/" + id);
  } else {
      return new Observable<number>();
  }
}

newOne(oUser: IUsuario): Observable<IUsuario> {
  return this.http.post<IUsuario>(this.sUrl, oUser);
}

newOneForUsers(oUser: IUsuario): Observable<IUsuario> {
  return this.http.post<IUsuario>(this.sUrl + "/forusers", oUser);
}

updateOne(oUser: IUsuario): Observable<IUsuario> {
  return this.http.put<IUsuario>(this.sUrl, oUser);
}

generateRandom(amount: number): Observable<number> {
  return this.http.post<number>(this.sUrl + "/populate/" + amount, null);
}

getPageByRepliesNumberDesc(size: number | undefined, page: number | undefined): Observable<IUsuarioPage> {
  if (!size) size = 10;
  if (!page) page = 0;
  return this.http.get<IUsuarioPage>(this.sUrl + "/byRepliesNumberDesc?size=" + size + "&page=" + page);
}

empty(): Observable<number> {
  return this.http.delete<number>(this.sUrl + "/empty");
}

confirmAccount(token: string, pass:string): Observable<string> {
  
  return this.http.get<string>(this.sUrl + "/confirm-account?token=" + token + "&password=" + pass);
}



}
