import { Component } from '@angular/core';
import { RobotInfoComponent } from '../robot-info/robot-info.component';
import { Router } from '@angular/router';
import { SettingsService } from '../../service/settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-robot-settings',
  templateUrl: './robot-settings.component.html',
  styleUrl: './robot-settings.component.scss',
  standalone: true,
  imports: [RobotInfoComponent, CommonModule],
})
export class RobotSettingsComponent {
  constructor(private SettingService: SettingsService, private router: Router) {
    this.SettingService.getRobotChange().subscribe(() => {
      this.robotList = this.SettingService.getRobotList();
    });
  }  
  userID: string | null = null;
  nextRobotID: number = 0;
  robotList: any[] = [];

  ngOnInit(){
    this.userID = sessionStorage.getItem('key');
    this.robotList = this.SettingService.getRobotList();
  }

  addRobot() {    
    let currentChild = {
      "robotID": this.nextRobotID,
      "robotName": "",
      "bigDogIP": "",
      "armIP": "", 
      "saved": false,
      "newRobot": true,
      "imageFile": ""
    };
    this.robotList.push(currentChild);
    this.nextRobotID += 1;
  }

  deleteRobot(robotID: number) {
    this.SettingService.deleteRobotFromList(robotID);
  }
}
