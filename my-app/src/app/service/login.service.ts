import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private apiService: ApiService) {  }

  getLogins(requestPath: string){
    return this.apiService.get(requestPath);
  }

  signUp(requestPath: string, data: JSON){
    return this.apiService.post(requestPath, data);
  }
}
