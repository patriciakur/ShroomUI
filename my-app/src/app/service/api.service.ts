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
    return this.httpClient.get<JSON>(requestPath);
  }
  post<JSON>(requestPath: string, data: JSON):Observable<any>{
    return this.httpClient.post<JSON>(requestPath, data);
  }
}
