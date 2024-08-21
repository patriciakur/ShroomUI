import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { SimpleChanges } from '@angular/core';
import { BigDogService } from '../../service/big-dog.service';
import { Router } from '@angular/router';
import { SettingsService } from '../../service/settings.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navigation-controls',
  templateUrl: './navigation-controls.component.html',
  styleUrl: './navigation-controls.component.scss',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatFormFieldModule, FormsModule, MatInputModule],
})
export class NavigationControlsComponent {
  ip: string = "";
  requestPath: string = "";
  data: any = {};
  needsStatusCheck: boolean = false;
  body: any = {};
  @Input() Coordinates: {x: number, y: number} = {x: 0, y: 0};
  xCoord: number = 0;
  yCoord: number = 0;
  theta: number = 0;
  userID: string | null = "";
  robotID: string = "";
  

  constructor(private bigDogService: BigDogService, private router: Router, private SettingService: SettingsService, private route: ActivatedRoute) { }


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
  

  submitToDB(requestPath: string, data: JSON, needsStatusCheck: boolean) {
    this.body = JSON.parse(JSON.stringify({requestPath, data, needsStatusCheck, ip: this.ip}));
    this.bigDogService.postBigDogData('http://localhost:3000/submitToDB', this.body).subscribe((res) => {
    })
  }
  navigateToCharge() {
    this.requestPath = "/cmd/charge";
    this.data = { "type": "1", "point" : "charging_pile"};
    this.needsStatusCheck = true;
    this.submitToDB(this.requestPath, this.data, this.needsStatusCheck);
  }
  navigateToCoordinates() {
    this.theta = Math.atan2(this.yCoord, this.xCoord); 

    this.requestPath = "/cmd/nav";
    this.data = { "x": this.xCoord, "y": this.yCoord, "theta": this.theta};
    this.needsStatusCheck = true;

    this.submitToDB(this.requestPath, this.data, this.needsStatusCheck);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['Coordinates']) {
      this.xCoord = changes['Coordinates'].currentValue.x;
      this.yCoord = changes['Coordinates'].currentValue.y;
    }
  }

}
