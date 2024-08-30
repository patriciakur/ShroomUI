import { Component } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { SettingsService } from '../service/settings.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  standalone: true,
  imports: [MatButtonModule, MatToolbarModule, MatIconModule, MatSidenavModule, MatListModule, RouterLink, RouterLinkActive, RouterOutlet, CommonModule],
})
export class LayoutComponent {
  userID: string | null = "";
  robotList: any[] = [];
  topBarTitle: string = "Settings";

  constructor(private router: Router, private SettingService: SettingsService, private route: ActivatedRoute) { 
    this.SettingService.getRobotChange().subscribe(() => {
      this.robotList = this.SettingService.getRobotList();
    });
  }
  
  navigate(navName: string){
    this.topBarTitle = navName;
  }
}
