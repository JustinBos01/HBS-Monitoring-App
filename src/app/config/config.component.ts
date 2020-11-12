import { Component, OnInit } from '@angular/core';
import { ConfigService, Config } from './config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';



export class Headers {
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {
  config: Config[];
  
  headers: Headers;
  
  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.showConfigResponse()
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Config[]) => this.config = [{
        
          id: (data as any).id,
          groupId: (data as any).groupId,
          name: (data as any).name,
          password: (data as any).password,
          syncOrder: (data as any).syncOrder,
      }]);
  }

  showConfigResponse() {
    this.configService.getConfigResponse()
      // resp is of type `HttpResponse<Config>`
      .subscribe(config => {
        //display its headers
        //const keys = resp.headers.keys();
        //this.headers = keys.map(key =>
        //  `${key}: ${resp.headers.get(key)}`);
  
        // access the body directly, which is typed as `Config`.
        this.config = config;
        console.log(this.config)
      })
  }
}

