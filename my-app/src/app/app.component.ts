import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SettingsService } from './service/settings.service';
import { LoginService } from './service/login.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatButtonModule, MatToolbarModule, RouterLink, RouterLinkActive, MatIconModule, MatSidenavModule, MatListModule], 
  templateUrl: './app.component.html',
  styleUrl: '../styles.scss',
  
})
export class AppComponent {
  constructor(private router: Router, private SettingService: SettingsService, private LoginService: LoginService) {
    this.LoginService.getLoginStatus().subscribe(() => {
      this.SettingService.getRobots(sessionStorage.getItem('key')!).subscribe((data) => {
        if(data){
          //get list of robots from db and create components with each robot's info
          let jsonData = JSON.parse(JSON.stringify(data));
          for(let robot of jsonData.rows) {
            this.SettingService.addRobotToList(robot);
          }
          this.SettingService.changeRobot();
        }
        else{
          alert('Failed to get robots');
        }
      });
    })
      
  }

  ngOnInit(){
    if(sessionStorage.getItem('key')){
      this.SettingService.getRobots(sessionStorage.getItem('key')!).subscribe((data) => {
        if(data){
          //get list of robots from db and create components with each robot's info
          let jsonData = JSON.parse(JSON.stringify(data));
          for(let robot of jsonData.rows) {
            this.SettingService.addRobotToList(robot);
          }
          this.SettingService.changeRobot();
        }
        else{
          alert('Failed to get robots');
        }
      });
      this.SettingService.getProfile(sessionStorage.getItem('key')!).subscribe((data) => {
        if(data){
          let jsonData = JSON.parse(JSON.stringify(data));
          this.SettingService.changeUsernameInService(jsonData.rows[0].username);
          this.SettingService.changeEmailInService(jsonData.rows[0].email);
        }
        else{
          alert('Failed to get profile');
        }
      })
    }
    else{
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
  }
}
