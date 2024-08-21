import { Component, Input, numberAttribute } from '@angular/core';
import { BigDogComponent } from './big-dog/big-dog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { SettingsService } from '../service/settings.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.scss',
  standalone: true,
  imports: [BigDogComponent, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatSidenavModule, RouterLink, RouterOutlet],
})
export class RobotComponent {
  userID: string | null = "";
  robotName: string = "";
  robotID: number = 0;
  bigDogIP: string = "";
  armIP: string = "";
  @Input() id: string = "";
  displayBigDog: boolean = true;
  constructor(private SettingService: SettingsService, private router:Router) { 

  }

  ngOnInit(){
    this.userID = sessionStorage.getItem('key');
    if(this.userID == "" || this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
    else{
      if (this.id) {
        this.robotID = +this.id;
      }
      this.SettingService.getRobots(this.userID).subscribe((data) => {
        if(data){
          //get list of robots from db and create components with each robot's info
          let jsonData = JSON.parse(JSON.stringify(data));
          for(let robot of jsonData.rows) {
            if (robot.robotID == this.robotID) {
              this.robotName = robot.robotName;
              this.bigDogIP = robot.bigDogIP;
              this.armIP = robot.armIP;
            }
          }
        }
        else{
          alert('Failed to get robots');
        }
      });
    }
  }

  switchDisplay() {
    this.displayBigDog = !this.displayBigDog;
  }
}
