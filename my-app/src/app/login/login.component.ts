
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  isSignDivVisible: boolean = true;
  signUpObj: signUpModule = new signUpModule();
  loginObj: loginModule = new loginModule();

  constructor(private LoginService: LoginService, private router: Router) { }
  onRegister(){
    let signUpDataText = '{"name": "' + this.signUpObj.name + '", "email": "' + this.signUpObj.email + '", "password": "' + this.signUpObj.password + '"}';
    let signUpData = JSON.parse(signUpDataText);
    this.LoginService.signUp('http://localhost:3000/users', signUpData).subscribe((data) => {
      if(data){
        const userData = JSON.parse(data);
        sessionStorage.setItem('key', userData.id);
      }
      else{
        alert('Registration Failed');
      }
    });
  }

  onLogin(){
    let loginDataText = '{"username": "' + this.loginObj.user + '", "password": "' + this.loginObj.password + '"}';
    let loginData = JSON.parse(loginDataText);
    this.LoginService.login('http://localhost:3000/users/login', loginData).subscribe((data) => {
      if(data){
        const userData = JSON.parse(data);
        sessionStorage.setItem('key', userData.id);
        this.LoginService.loggedIn();
        this.router.navigateByUrl('/settings');
      }
      else{
        alert('Incorrect Username or Password');
      }
    });
  }
}



export class signUpModule{
  name: string;
  email: string;
  password: string;
  constructor(){
    this.name = "";
    this.email = "";
    this.password = "";
  }
}

export class loginModule{
  user: string;
  password: string;
  constructor(){
    this.user = "";
    this.password = "";
  }
}