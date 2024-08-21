import { Component, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../service/settings.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss', 
  standalone: true,
  imports: [MatCardModule],
})
export class MapComponent {
constructor(private router: Router, private SettingService:SettingsService, private route: ActivatedRoute) { }
@Output() onSelect = new EventEmitter<{x: number, y: number}>();
userID: string | null = "";
robotID: string = "";
ip: string = "";
imgSrc = 'assets/0f9bcac50e2ecfdf5ecd343f01209c13.png';

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
      this.ip = "";
      this.SettingService.getRobots(this.userID!).subscribe((data) => {
        if(data){
          //get list of robots from db and create components with each robot's info
          let jsonData = JSON.parse(JSON.stringify(data));
          for(let robot of jsonData.rows) {
            if (robot.robotID == this.robotID) {
              this.ip = robot.bigDogIP;
              if(this.ip == null || this.ip == "") {
                //alert('Please set the Big Dog IP in the settings');
                this.router.navigateByUrl('/settings');
                return;
              }
              else{
                // Assuming you have a variable named 'blobData' that contains the blob data
                const blob = new Blob([robot.bidDogData], { type: 'image/png' });
                this.imgSrc = URL.createObjectURL(blob);
              }
            }
          }
        }
        else{
          alert('Failed to get robots');
        }
      });
    })
  } 
}


  getPixelCoordinates(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    console.log('Clicked at:', x, y);
    //sets the x and y coordinates of the nav component
    this.onSelect.emit({x, y});
  }


}
