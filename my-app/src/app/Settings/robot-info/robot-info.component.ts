import { Component, Input, NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { EventEmitter, Output } from '@angular/core';
import { SettingsService } from '../../service/settings.service';
import { Router } from '@angular/router';
import * as fs from 'fs';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrl: './robot-info.component.scss', 
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, FormsModule, FontAwesomeModule, CommonModule],
})
export class RobotInfoComponent {
  // when the delete button is clicked, the robot will be deleted
  //when the + button is clicked, change fields to be editable, click again to send the info back to the server and make the fields uneditable
  
  @Input() RobotID: number = 0;
  @Input() RobotName: string = "";
  @Input() BigDogIP: string = "";
  @Input() ArmIP: string = "";
  @Input() saved: boolean = true; //flag to check if the robot info has been saved since changes made
  @Input() newRobot: boolean = false; //if true, the robot is new and has not been saved to the db
  @Input() imageFile: string = "";
  readonly: boolean = true;
  userID: string| null = "";
  file: File | null = null;
  fileInput: any;
  //filePath: string = "";

  constructor(private SettingService: SettingsService, private router: Router, private library: FaIconLibrary) {
    library.addIconPacks(fas);
  } 

  ngOnInit(){
    this.userID = sessionStorage.getItem('key');
    if(this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
  }

  formNowDirty(){
    this.saved = false;
  }

  onFileSelected(event: any){
    this.file = event.target.files[0];
  }

  updateData(){ 
    if(this.readonly){
      this.readonly = false; //sets area to editable
    }
    else{
      //send data to server
      if(this.userID == null){
        alert('Please log in');
        this.router.navigateByUrl('/login');
        return;
      }

      //save file locally
      console.log(this.file);
      /*if (this.file) {
        const fileData = new FormData();
        fileData.append('file', this.file);

        // Specify the folder path where you want to save the file
        const folderPath = 'src/assets';

        // Generate a unique file name
        const fileName = `${this.RobotID}_${this.BigDogIP}.png`;

        // Save the file to the specified folder
        fs.writeFile(`${folderPath}/${fileName}`, this.file, (err) => {
          if (err) {
            console.error('Failed to save file:', err);
            return;
          }

          console.log('File saved successfully:', fileName);
          this.filePath = `${folderPath}/${fileName}`;

          // Continue with the rest of your code
          // ...
        });
      }
     if(this.file){
        const reader = new FileReader();
        reader.readAsDataURL(this.file);
        reader.onload = () => {
          let fileName = `${this.RobotID}_${this.BigDogIP}.png`;
          console.log('File name:', fileName);
          console.log('File data:', reader.result as string);
          fs.writeFile(`src/assets/${fileName}`, reader.result as string, (err) => {
            if (err) {
              console.error('Failed to save file:', err);
              return;
            }
            console.log('File saved successfully:', fileName);
            this.filePath = `src/assets//${fileName}`;
  
            // Continue with the rest of your code
            // ...
          });
        }
      }*/
      
      
      

      console.log('RobotID:', this.RobotID, 'RobotName:', this.RobotName, 'BigDogIP:', this.BigDogIP, 'ArmIP:', this.ArmIP, 'FilePath: ');
      console.log(this.RobotName);
      if(this.newRobot){
        //add to db
        this.SettingService.addRobot(this.userID, this.RobotID, this.RobotName, this.BigDogIP, this.ArmIP).subscribe((data) => {
          if(data){
            this.saved = true;
            this.newRobot = false;
          }
          else{
            alert('Failed to add robot');
          }
        })
      }
      else{
        this.SettingService.updateRobot(this.userID, this.RobotID, this.RobotName, this.BigDogIP, this.ArmIP).subscribe((data) => {
          if(data){
            this.saved = true;
            this.newRobot = false;
          }
          else{
            alert('Failed to update robot info');
          }
        })
      }
      this.SettingService.changeRobot();
      this.readonly = true; //sets area to uneditable
    }};
  
  @Output() delete = new EventEmitter<number>();
  deleteRobot() {
    if (this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
    this.delete.emit(this.RobotID);
    if (this.newRobot){ //if the robot is a new robot and not in the db already, just delete it from the list
      this.delete.emit(this.RobotID);
    }
    else{ 
      this.SettingService.deleteRobot(this.userID, this.RobotID).subscribe((data) => {
        console.log('Data:', data);
        if(data){
          this.delete.emit(this.RobotID);
        }
        else{
          alert('Failed to delete robot');
        }
      });
    }
    
  }
}
