import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPageService } from '../user-page/user-page.service'
import { LoginPageService } from '../login-page/login-page.service'
import { ConfigService } from '../config/config.service';
import { TopBarService } from '../top-bar/top-bar.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  items;
  loginForm;
  superUserData;
  name;
  password;
  superUsers;

  constructor(
    private userPageService: UserPageService,
    private loginPageService: LoginPageService,
    private formBuilder: FormBuilder,
    public configService: ConfigService,
    public navigation: TopBarService,
  ) {
    this.loginForm = this.formBuilder.group({
      name: '',
      password: ''
    });
    
  }

  ngOnInit() {
    localStorage.setItem('superUserData.name', '');
    localStorage.setItem('superUserData.password', '');
    this.items = this.userPageService.getItems();
    this.navigation.hide();
    
  }


  onSubmit(userData) {
    this.loginPageService.superUserData = userData;
    console.log(this.loginPageService.superUserData.name)
    this.items = this.userPageService.clearItems();
    
    localStorage.setItem('superUserData.name', this.loginPageService.superUserData.name);
    localStorage.setItem('superUserData.password', this.loginPageService.superUserData.password);
    console.log(localStorage.getItem('superUserData.name'))
    console.log(localStorage.getItem('superUserData.password'))
  }
}
