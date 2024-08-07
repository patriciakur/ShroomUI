import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss', 
  standalone: true,
  imports: [MatCardModule],
})
export class MapComponent {

}
