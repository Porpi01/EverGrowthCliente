import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MediaService {

constructor(
  private http: HttpClient,
) { }

uploadFile(formData: FormData): Observable<any>{
  return this.http.post('https://evergrowth-server-2.onrender.com/media/cloudinary/', formData);
}
}