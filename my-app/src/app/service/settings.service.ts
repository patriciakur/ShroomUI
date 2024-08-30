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
    this.addRobotToList({userID, robotID, robotName, bigDogIP, armIP});
    return this.apiService.post('http://localhost:3000/addRobot', {userID, robotID, robotName, bigDogIP, armIP});
  }
  updateRobot(userID: string, robotID: number, robotName: string, bigDogIP: string, armIP: string){
    return this.apiService.put('http://localhost:3000/updateRobot', {userID, robotID, robotName, bigDogIP, armIP});
  }
  deleteRobot(userID: string, robotID: number){
    return this.apiService.delete('http://localhost:3000/deleteRobot/'+ userID + '/' + robotID);
  }

  getProfile(userID: string){
    return this.apiService.get('http://localhost:3000/getProfile/'+userID);
  }
  updateProfile(userID: string, newUsername: string, newEmail: string){
    return this.apiService.put('http://localhost:3000/updateProfile', {userID, newUsername, newEmail});
  }
  changePassword(userID: string, newPassword: string){
    return this.apiService.put('http://localhost:3000/changePassword', {userID, newPassword});
  }
  validatePassword(userID: string, password: string){
    return this.apiService.post('http://localhost:3000/validatePassword', {userID, password});
  }
  uploadImage(userID: string, robotID: number, fileName: string, image: Buffer){
    return this.apiService.post('http://localhost:3000/addMap', {userID, robotID, fileName, image});
  }
  getImage(userID: string, robotID: number){
    return this.apiService.get('http://localhost:3000/getMap/'+userID+'/'+robotID);
  }
  

  @Output() robotChange = new EventEmitter<void>();
  getRobotChange(){
    return this.robotChange;
  }
  changeRobot(){
    //robot has been changed, emit signal to layout component that robot list needs to be updated
    this.robotChange.emit();
  }

  robotList: any[] = [];
  getRobotList(){
    return this.robotList;
  }
  getRobotinList(robotID: number){
    return this.robotList.find(x => x.robotID === robotID);
  }
  setRobotList(list: any[]){
    this.robotList = list;
    this.changeRobot();
  }
  addRobotToList(robot: any){
    this.robotList.push(robot);
    this.changeRobot();
  }
  deleteRobotFromList(robotID: number){
    this.robotList = this.robotList.filter(x => x.robotID !== robotID);
    this.changeRobot();
  }
  updateRobotInList(robot: any){
    this.robotList = this.robotList.map(x => x.robotID === robot.robotID ? robot : x);
    this.changeRobot();
  }

  username: string = "";
  email: string = "";
  getUsername(){
    return this.username;
  }
  getEmail(){
    return this.email;
  }
  changeUsernameInService(username: string){
    this.username = username;
  }
  changeEmailInService(email: string){
    this.email = email;
  }
}

