import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SettingsService } from '../../service/settings.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrl: './user-settings.component.scss',
  standalone: true,
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, FormsModule, CommonModule, MatButtonModule],
})

export class UserSettingsComponent {
  userID: string | null = sessionStorage.getItem('key');
  newUsername: string = "";
  newEmail: string = "";
  newPassword: string = "";
  confirmPassword: string = "";
  currentPassword: string | null = "";

  constructor(private SettingService: SettingsService, private router: Router) { }

  ngOnInit(){
    this.newUsername = this.SettingService.getUsername();
    this.newEmail = this.SettingService.getEmail();
  }

  updateProfile(){
    this.SettingService.updateProfile(this.userID!, this.newUsername, this.newEmail).subscribe((data) => {
      if(data){
        alert('Profile has been updated');
        this.SettingService.changeUsernameInService(this.newUsername);
        this.SettingService.changeEmailInService(this.newEmail);
      }
      else{
        alert('Failed to update profile');
      }
    });
  }

  updatePassword(){
    if(this.newPassword == this.confirmPassword){
      this.SettingService.validatePassword(this.userID!, this.currentPassword!).subscribe((data1) => {
        if(data1){
          this.SettingService.changePassword(this.userID!, this.newPassword).subscribe((data2) => {

            if(data2){
              alert('Password updated');
            }
            else{
              alert('Failed to update password');
            }
          });
        }
        else{
          alert('Failed to update password');
        }
      });
    }
    else{
      alert('Passwords do not match');
    }
  }
}
