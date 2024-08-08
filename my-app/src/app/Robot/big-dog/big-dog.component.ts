import { Component } from '@angular/core';
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

@Component({
  selector: 'app-big-dog',
  templateUrl: './big-dog.component.html',
  styleUrl: './big-dog.component.scss',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule, MatGridListModule, NavigationControlsComponent, CurrentBatteryComponent, MapComponent],
})
export class BigDogComponent {
    battery: number = 0;
    chargeFlag: string = "";
    EmergencyBtnStatus: string = "";
    constructor(private bigDogService: BigDogService) { }
    
    ngOnInit() {
      this.updateBigDogData()
    }

    updateBigDogData(){
      this.bigDogService.getBigDogData('http://localhost:3000/submitToDB').subscribe((data) => {
        const jsonData = JSON.parse(JSON.stringify(data));
        this.battery = jsonData.rows[0].battery;
        this.chargeFlag = jsonData.rows[0].chargeFlag==0 ? "Charging" : "Not Charging";
        this.EmergencyBtnStatus = jsonData.rows[0].emergencyFlag==0 ? "PRESSED" : "Not Pressed";
      });
      setTimeout(this.updateBigDogData, 5000)
    }
}
