import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import { BigDogService } from '../../service/big-dog.service';

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

  constructor(private bigDogService: BigDogService) { }

  submitToDB(requestPath: string, data: JSON, needsStatusCheck: boolean) {
    this.body = JSON.stringify({requestPath, data, needsStatusCheck});
    this.bigDogService.postBigDogData('localhost:3000/submitToDB', data);
  }
  navigateToCharge() {
    this.requestPath = "/cmd/charge";
    this.data = { "type": "1", "point" : "charging_pile"};
    this.needsStatusCheck = true;
    this.submitToDB(this.requestPath, this.data, this.needsStatusCheck);
    console.log(this.requestPath +" " + this.data +" " + this.needsStatusCheck);
  }
}
