import { Component } from '@angular/core';
import { BigDogComponent } from './big-dog/big-dog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';


@Component({
  selector: 'app-robot',
  templateUrl: './robot.component.html',
  styleUrl: './robot.component.scss',
  standalone: true,
  imports: [BigDogComponent, MatToolbarModule, MatListModule, MatIconModule, MatButtonModule, MatSidenavModule],
})
export class RobotComponent {

}
