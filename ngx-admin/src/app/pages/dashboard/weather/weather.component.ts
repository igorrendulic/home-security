import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-weather',
  styleUrls: ['./weather.component.scss'],
  templateUrl: './weather.component.html',
})

export class WeatherComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }
    
  positionSuccess(position) {
      const latitude  = position.coords.latitude;
      const longitude = position.coords.longitude;
  }

  positionError() {
      // ignore
  }

  initWeather() {
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(this.positionSuccess, this.positionError);
      }
  }
}
