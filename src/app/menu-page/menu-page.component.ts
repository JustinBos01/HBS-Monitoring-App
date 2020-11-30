import { Component, OnInit } from '@angular/core';
import { TopBarService } from '../top-bar/top-bar.service'
import { LoginPageService } from '../login-page/login-page.service'

@Component({
  selector: 'app-menu-page',
  templateUrl: './menu-page.component.html',
  styleUrls: ['./menu-page.component.css']
})
export class MenuPageComponent implements OnInit {
  
  constructor( public navigation: TopBarService,
    public loginPageService: LoginPageService ) { 
    
  }
  SUData;
  ngOnInit(): void {
    this.navigation.hide();
    this.SUData = this.loginPageService.superUserData;
  }

}
