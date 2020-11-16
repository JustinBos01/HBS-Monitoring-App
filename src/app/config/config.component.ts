import { Component, OnInit } from '@angular/core';
import { ConfigService, GroupData, Users } from './config.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { groups } from '../groups';



export class Headers {
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {
  users1: Users[];
  groups: GroupData[];
  headers: Headers;
  
  constructor(
    private configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.showConfigResponse()
    this.showGroupResponse()
  }

  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Users[]) => this.users1 = [{
          id: (data as any).id,
          groupId: (data as any).groupId,
          name: (data as any).name,
          password: (data as any).password,
          syncOrder: (data as any).syncOrder,
      }]);
  }

  showConfigResponse() {
    this.configService.getConfigResponse()
      .subscribe(users => {
        this.users1 = users;
        console.log(this.users1)
      })
  }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        console.log(this.groups)
      })
  }
}

