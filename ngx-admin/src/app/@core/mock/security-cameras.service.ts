import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of as observableOf, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Camera, SecurityCamerasData } from '../data/security-cameras';

@Injectable()
export class SecurityCamerasService extends SecurityCamerasData {

  constructor(private http:HttpClient) {
    super();
  }

  private cameras: Camera[] = [];

  getCamerasData(): Observable<Camera[]> {
    this.cameras = [];
    
    this.http.get<string[]>(environment.serverUrl + "/cam_list").subscribe(data => {
      if (data) {
        data.forEach(cam_name => {
          let cam = {
            title: cam_name,
            source: environment.serverUrl + "/video_feed/" + cam_name,
          };
          this.cameras.push(cam);

          return observableOf(this.cameras);
        });
      }
    });
    return observableOf(this.cameras);
  }
}
