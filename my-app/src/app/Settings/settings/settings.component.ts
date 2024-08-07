import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { RobotInfoComponent } from '../robot-info/robot-info.component';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  standalone: true,
  imports: [MatGridListModule, RobotInfoComponent],
})
export class SettingsComponent {
  // when + is clicked, add a new RobotInfoComponent instance, create a new BigDogComponent instance add to side nav

  constructor(private viewContainer: ViewContainerRef) {}  

  addRobot() {    
    this.viewContainer.createComponent(RobotInfoComponent);  
  }

  /*deleteRobot() {
    console.log('Robot deleted');
  }

  //@ViewChild('container', { read: ViewContainerRef, static: true }) container: ViewContainerRef;
  
  //private componentRefs = [];

  /*addRobot() {
    const componentRef = this.container.createComponent(RobotInfoComponent);
    this.componentRefs.push();
    componentRef.instance.selfRef = componentRef; // Passing reference of the component instance
    componentRef.instance.onDelete.subscribe(() => {
      this.deleteRobot(componentRef.instance);
    });
  }

  deleteRobot(componentRef :  RobotInfoComponent) {
    /*const index = this.componentRefs.indexOf(componentRef);
    if (index !== -1) {
      this.componentRefs.splice(index, 1);
      componentRef.destroy();
      
    }
  }*/

  
  
  

}
