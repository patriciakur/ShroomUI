import { Injectable, Output } from '@angular/core';
import { ApiService } from './api.service';
import { EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private apiService: ApiService) {  }

  login(requestPath: string, data: JSON){
    return this.apiService.post(requestPath, data);
  }

  signUp(requestPath: string, data: JSON){
    return this.apiService.post(requestPath, data);
  }

  @Output() loginChange = new EventEmitter<void>();
  getLoginStatus(){
    return this.loginChange;
  }
  loggedIn(){
    this.loginChange.emit();
  }

}
