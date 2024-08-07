import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-current-battery',
  templateUrl: './current-battery.component.html',
  styleUrl: '../../../styles.scss',
  standalone: true,
  imports: [MatCardModule, ],
})
export class CurrentBatteryComponent {
  @Input() chargeFlag: string = "";
  @Input() battery: number = 0;
}
