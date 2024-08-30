import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { 
    
  }
  get<JSON> (requestPath: string):Observable<JSON>{
    return this.httpClient.get<JSON>(requestPath, { withCredentials: true });
  }
  post<JSON>(requestPath: string, data: JSON):Observable<any>{
    return this.httpClient.post<JSON>(requestPath, data);
  }
  put<JSON>(requestPath: string, data: JSON):Observable<any>{
    return this.httpClient.put<JSON>(requestPath, data);
  }
  delete<JSON>(requestPath: string):Observable<any>{
    return this.httpClient.delete<JSON>(requestPath);
  }
}
