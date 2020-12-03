import { Component, OnInit } from '@angular/core';
import { TopBarService } from '../top-bar/top-bar.service'
import { LoginPageService } from '../login-page/login-page.service'
import { ConfigService } from '../config/config.service'

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  SUData;
  enabledGroups = [];
  groups;
  constructor( public navigation: TopBarService,
    public loginPageService: LoginPageService, 
    public configService: ConfigService) { 
    
  }
  
  ngOnInit(): void {
    this.navigation.hide();
    this.SUData = this.loginPageService.superUserData;
    this.getUsers()
  }

  getUsers() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        for (let selectedGroup of this.groups){
          if (selectedGroup.group.status == 'enabled') {
            this.enabledGroups.push(selectedGroup)

          }
        }
      })
    
  }

}
