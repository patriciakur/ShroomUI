import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RobotInfoComponent } from '../robot-info/robot-info.component';
import { SettingsService } from '../../service/settings.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [MatGridListModule, RobotInfoComponent, CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, FormsModule],
})
export class SettingsComponent {
  // when + is clicked, add a new RobotInfoComponent instance, create a new BigDogComponent instance add to side nav
  constructor(private SettingService: SettingsService, private router: Router) {}  
  userID: string | null = "";
  currentChild: any;
  nextRobotID: number = 0;
  robotList: any[] = [];
  newUsername: string = "";
  newEmail: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  currentPassword: string | null = "";

  ngOnInit(){
    this.userID = sessionStorage.getItem('key');
    if(this.userID == "" || this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
    else{
      this.SettingService.getRobots(this.userID).subscribe((data) => {
        if(data){
          //get list of robots from db and create components with each robot's info
          let jsonData = JSON.parse(JSON.stringify(data));
          for(let robot of jsonData.rows) {
            this.robotList.push(robot);
            this.nextRobotID++;
          }
        }
        else{
          alert('Failed to get robots');
        }
      });
    }
    
  }

  addRobot() {    
    this.currentChild = {
      "robotID": this.nextRobotID,
      "robotName": "",
      "bigDogIP": "",
      "armIP": "", 
      "saved": false,
      "newRobot": true
    };
    this.robotList.push(this.currentChild);
    this.nextRobotID += 1;
  }

  deleteRobot(robotID: number) {
    console.log('Deleting robot2:', robotID);
    this.robotList = this.robotList.filter(x => x.robotID !== robotID);
  }

  updateUsername(){
    this.SettingService.changeUsername(this.userID!, this.newUsername).subscribe((data) => {
      if(data){
        alert('Username updated');
      }
      else{
        alert('Failed to update username');
      }
    });
  }

  updateEmail(){
    this.SettingService.changeEmail(this.userID!, this.newEmail).subscribe((data) => {
      if(data){
        alert('Email updated');
      }
      else{
        alert('Failed to update email');
      }
    });
  }

  updatePassword(){
    if(this.newPassword == this.confirmPassword){
      this.SettingService.validatePassword(this.userID!, this.currentPassword!).subscribe((data1) => {
        if(data1){
          this.SettingService.changePassword(this.userID!, this.newPassword).subscribe((data2) => {

            if(data2){
              alert('Password updated');
            }
            else{
              alert('Failed to update password');
            }
          });
        }
        else{
          alert('Failed to update password');
        }
      });
    }
    else{
      alert('Passwords do not match');
    }
  }
  
}
