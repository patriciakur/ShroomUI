import { Routes } from '@angular/router';
import { RobotComponent } from './Robot/robot.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './layout/layout.component';
import { UserSettingsComponent } from './Settings/user-settings/user-settings.component';
import { RobotSettingsComponent } from './Settings/robot-settings/robot-settings.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: '', component: LayoutComponent, 
        children: [
            {path: 'robot/:id', component: RobotComponent
            },
            {path: 'settings', component: SettingsComponent,
                children: [
                    {path: 'robot-settings', component: RobotSettingsComponent},
                    {path: 'user-settings', component: UserSettingsComponent}
                ]
            },
        ]
    },

    
    
    //https://youtu.be/Dvqe0uIhBxQ?si=Tgj-D7pznzE7zFkY&t=655

];
