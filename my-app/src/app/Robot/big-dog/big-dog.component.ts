import { Component,Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list'; 
import { NavigationControlsComponent } from '../navigation-controls/navigation-controls.component';
import { CurrentBatteryComponent } from '../current-battery/current-battery.component';
import { MapComponent } from '../map/map.component';
import { BigDogService } from '../../service/big-dog.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { SettingsService } from '../../service/settings.service';
import { interval } from 'rxjs';
import { Buffer } from 'buffer';


@Component({
  selector: 'app-big-dog',
  templateUrl: './big-dog.component.html',
  styleUrl: './big-dog.component.scss',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatGridListModule, NavigationControlsComponent, CurrentBatteryComponent, MapComponent],
})
export class BigDogComponent {
    @Input() bigDogIP: string = "";
    battery: number = 0;
    chargeFlag: string = "";
    EmergencyBtnStatus: string = "";
    coordinates: {x: number, y: number} = {x: 0, y: 0};
    firstOnChangesPassed = false;
    robotID: string = "";
    userID: string | null = "";
    interval: any;
    imgData: string = "";
    xCoord: number = 0;
    yCoord: number = 0;
    degrees: number = 0;

    constructor(private bigDogService: BigDogService, private router: Router, private route: ActivatedRoute, private SettingService: SettingsService) {
      this.SettingService.getRobotChange().subscribe(() => {
        let robot = this.SettingService.getRobotinList(Number(this.robotID))
        this.bigDogIP = robot.bigDogIP;
        if(this.bigDogIP == null || this.bigDogIP == "") {
          alert('Please set the Big Dog IP in the settings');
          this.router.navigateByUrl('/settings');
          return;
        }
        else {
          this.updateBigDogData()
          this.interval = setInterval(() => {
            this.updateBigDogData();
          }, 5000);
        }
      })
    }
    
    ngOnInit() {
      this.userID = sessionStorage.getItem('key');
      if(this.userID == "" || this.userID == null){
        alert('Please log in');
        this.router.navigateByUrl('/login');
        return;
      }
      else{
        this.route.paramMap.subscribe(params => {
          this.robotID = params.get('id')!;
          this.bigDogIP = "";
          clearInterval(this.interval);
          let robot = this.SettingService.getRobotinList(Number(this.robotID))
          this.bigDogIP = robot.bigDogIP;
          if(this.bigDogIP == null || this.bigDogIP == "") {
            alert('Please set the Big Dog IP in the settings');
            this.router.navigateByUrl('/settings');
            return;
          }
          else {
            this.updateBigDogData()
            this.interval = setInterval(() => {
              this.updateBigDogData();
            }, 5000);
          }
        });
          this.bigDogService.getBigDogData('http://localhost:3000/getMap/'+this.userID+'/'+this.robotID).subscribe((data:any) => {
            this.imgData = 'data:image/png;base64,' + data;
          });
      } 
    }    

    updateBigDogData(){
      this.bigDogService.getBigDogData('http://localhost:3000/submitToDB/'+this.bigDogIP).subscribe((data) => {
        let jsonData = JSON.parse(JSON.stringify(data));
        this.battery = jsonData.rows[0].battery;
        this.chargeFlag = jsonData.rows[0].chargeFlag==0 ? "Charging" : "Not Charging";
        this.EmergencyBtnStatus = jsonData.rows[0].emergencyButton == 0 ? "PRESSED" : "Not Pressed";
      });

    }

    getCoordinates(event: {x: number, y: number}) {
      this.coordinates = event;
    }

    ngOnDestroy() {
      clearInterval(this.interval);
    }
}
