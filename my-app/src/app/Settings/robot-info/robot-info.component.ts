import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewContainerRef } from '@angular/core';
import { ComponentRef } from '@angular/core';
import { EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-robot-info',
  templateUrl: './robot-info.component.html',
  styleUrl: './robot-info.component.scss', 
  standalone: true,
  imports: [MatCardModule, MatDividerModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
})
export class RobotInfoComponent {
  // when the delete button is clicked, the robot will be deleted
  //when the + button is clicked, change fields to be editable, click again to send the info back to the server and make the fields uneditable

  constructor(private viewContainer: ViewContainerRef) {} 

  deleteRobot() {
    this.viewContainer.remove();
  }
  /*@Output() onDelete = new EventEmitter<void>();
  selfRef: ComponentRef<RobotInfoComponent>;
  constructor(private viewContainer: ViewContainerRef) {
    this.selfRef = this.viewContainer.createComponent(RobotInfoComponent);
  }

  deleteRobot() {
    this.onDelete.emit();
  }*/
}
