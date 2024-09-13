import { Component, Output, Input, SimpleChanges, viewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
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

@Output() onSelect = new EventEmitter<{x: number, y: number, degrees: number}>();
userID: string | null = "";
robotID: string = "";
ip: string = "";
@Input() imgData: string = "";
@Input() xCoord: number = 0;
@Input() yCoord: number = 0;
@Input() degrees: number = 0;
canvasEl!: HTMLCanvasElement;
canvas: any;

newX: number = 0;
newY: number = 0;

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
    this.newX = event.offsetX;
    this.newY = event.offsetY;
  }

  getAngle(event: MouseEvent){
    const deltaX = event.offsetX - this.newX;
    const deltaY = this.newY - event.offsetY;
    let degrees = 0;
    if(deltaX == 0 && deltaY == 0){
      degrees = this.degrees;
    } 
    else{
      degrees = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    }
    const x= this.newX;
    const y= this.newY;
    //sets the x and y coordinates of the nav component
    this.onSelect.emit({x, y, degrees});
  }



  private cx!: CanvasRenderingContext2D;
  public ngAfterViewInit() {
    this.canvas = document.querySelector('#my-canvas')
    if (!(this.canvas instanceof HTMLCanvasElement)) return;
    this.canvasEl = this.canvas;
    this.cx = this.canvasEl.getContext('2d')!;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['imgData']){
      this.imgData = changes['imgData'].currentValue;
      let image = new Image();
      let pose = new Image();

      pose.src = './../../assets/pose.svg';
      image.src = this.imgData;

      this.canvasEl.width = image.width;
      this.canvasEl.height = image.height;

      this.cx.lineWidth = 3;
      this.cx.lineCap = 'round';
      this.cx.strokeStyle = '#000';
          
      
      image.onload = ()=> {
          this.cx.drawImage(image, 0, 0, image.width, image.height);
          this.cx.save();
          this.cx.translate(this.xCoord, this.yCoord); 
          this.cx.rotate(this.degrees * Math.PI / 180);
          this.cx.drawImage(pose, -7.5, -7.5,15,15);
          this.cx.restore();

      }
    }
  }
}
