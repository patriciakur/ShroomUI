import { Component, Output, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { map } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SettingsService } from '../../service/settings.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss', 
  standalone: true,
  imports: [MatCardModule, CommonModule],
})
export class MapComponent {
constructor(private router: Router, private SettingService:SettingsService, private route: ActivatedRoute) { }
@Output() onSelect = new EventEmitter<{x: number, y: number}>();
userID: string | null = "";
robotID: string = "";
ip: string = "";
@Input() imgData: string = "";;

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
      this.imgData = "";
    })
  } 
}


  getPixelCoordinates(event: MouseEvent) {
    const x = event.offsetX;
    const y = event.offsetY;
    //sets the x and y coordinates of the nav component
    this.onSelect.emit({x, y});
  }


}
