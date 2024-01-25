import { Component } from '@angular/core';
import { PrimeNGConfig } from "primeng/api";
import { MediaService } from './service/Media.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'EverGrowthCliente';
  constructor(
    private primengConfig: PrimeNGConfig,
  ) { }

  ngOnInit() {
    this.primengConfig.ripple = true;
  }

 
  
}

