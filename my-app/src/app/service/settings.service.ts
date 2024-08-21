import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Output, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private apiService: ApiService) { }

  getRobots(userID: string){
    return this.apiService.get('http://localhost:3000/robotList/'+ userID);
  }
  addRobot(userID: string,robotID: number, robotName: string, bigDogIP: string, armIP: string){
    return this.apiService.post('http://localhost:3000/addRobot', {userID, robotID, robotName, bigDogIP, armIP});
  }
  updateRobot(userID: string, robotID: number, robotName: string, bigDogIP: string, armIP: string){
    return this.apiService.put('http://localhost:3000/updateRobot', {userID, robotID, robotName, bigDogIP, armIP});
  }
  deleteRobot(userID: string, robotID: number){
    console.log('Deleting robot:', robotID, ' for user:', userID);
    return this.apiService.delete('http://localhost:3000/deleteRobot/'+ userID + '/' + robotID);
  }

  changeUsername(userID: string, newUsername: string){
    return this.apiService.put('http://localhost:3000/changeUsername', {userID, newUsername});
  }
  changeEmail(userID: string, newEmail: string){
    return this.apiService.put('http://localhost:3000/changeEmail', {userID, newEmail});
  }
  changePassword(userID: string, newPassword: string){
    return this.apiService.put('http://localhost:3000/changePassword', {userID, newPassword});
  }
  validatePassword(userID: string, password: string){
    return this.apiService.post('http://localhost:3000/validatePassword', {userID, password});
  }

  @Output() robotChange = new EventEmitter<void>();
  getRobotChange(){
    return this.robotChange;
  }
  changeRobot(){
    //robot has been changed, emit signal to layout component that robot list needs to be updated
    this.robotChange.emit();
  }


}
