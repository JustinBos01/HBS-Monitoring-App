import { Component, OnInit } from '@angular/core';
import { ConfigService, GroupData, Users } from './config.service';


export class Headers {
}

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.css']
})

export class ConfigComponent implements OnInit {
  users: Users[];
  public groups: GroupData[];
  headers: Headers;
  items = [];
  
  constructor(
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.showConfigResponse()
    this.showGroupResponse()
    this.getItems()
  }
  
  showConfig() {
    this.configService.getConfig()
      .subscribe((data: Users[]) => this.users = [{
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
        this.users = users;
      })
  }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
      })
    }

  

  getUsersFromGroup(group) {
    this.configService.getUsersOfGroup(group)
    this.configService.items = group
  }

  getItems() {
    return this.configService.items;
  }
}

