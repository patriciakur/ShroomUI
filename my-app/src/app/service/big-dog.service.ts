import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class BigDogService {

  constructor(private apiService: ApiService) {  }

  getBigDogData(requestPath: string){
    return this.apiService.get(requestPath);
  }

  postBigDogData(requestPath: string, data: JSON){
    return this.apiService.post(requestPath, data);
  }


}
