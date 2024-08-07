import { Routes } from '@angular/router';
import { RobotComponent } from './Robot/robot.component';
import { SettingsComponent } from './Settings/settings/settings.component';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path: '', redirectTo: '/login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: '', component: AppComponent, 
        children: [
            {path: 'robot', component: RobotComponent},
            {path: 'settings', component: SettingsComponent},
        ]
},

    
    
    //https://youtu.be/Dvqe0uIhBxQ?si=Tgj-D7pznzE7zFkY&t=655

];
