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
    this.SettingService.getRobotChange().subscribe(() => {
      if (this.id) {
        this.robotID = +this.id;
      }
      this.SettingService.getRobotinList(this.robotID).subscribe((data : any) => {
        this.robotName = data.robotName;
        this.bigDogIP = data.bigDogIP;
        this.armIP = data.armIP;
      })
    })
  }

  ngOnInit(){
    this.userID = sessionStorage.getItem('key');
    if(this.userID == "" || this.userID == null){
      alert('Please log in');
      this.router.navigateByUrl('/login');
      return;
    }
  }

  switchDisplay() {
    this.displayBigDog = !this.displayBigDog;
  }
}
