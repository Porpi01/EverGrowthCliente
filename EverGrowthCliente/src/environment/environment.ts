import { HttpHeaders } from "@angular/common/http";

export const API_URL: string = 'https://evergrowth-server-2.onrender.com';

export const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=UTF-8'
    })
};
