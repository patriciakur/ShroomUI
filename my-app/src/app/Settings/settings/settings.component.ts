import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RobotSettingsComponent } from '../robot-settings/robot-settings.component';
import { UserSettingsComponent } from '../user-settings/user-settings.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [CommonModule, RobotSettingsComponent, UserSettingsComponent, MatToolbarModule, MatButtonModule],
})
export class SettingsComponent {
  constructor(private router: Router) {}  
  userID: string | null = sessionStorage.getItem('key');
  robotTab: boolean = true;
  

  ngOnInit(){
    if(this.userID == "" || this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }    
  }

  setRobotActive(){
    this.robotTab = true;
  }
  setUserActive(){
    this.robotTab = false;
  }
  

  
  
}
