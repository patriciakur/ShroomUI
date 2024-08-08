import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss', 
  standalone: true,
  imports: [MatCardModule],
})
export class MapComponent {
  imgName= "/my-app/public/example.png"
  ngonInit() {
    // This function will be called when the component is loaded
  }
}
