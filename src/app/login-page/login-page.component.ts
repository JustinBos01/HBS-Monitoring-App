import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPageService } from '../user-page/user-page.service'
import { LoginPageService } from '../login-page/login-page.service'
import { ConfigService } from '../config/config.service';

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
  ) {
    this.loginForm = this.formBuilder.group({
      name: '',
      password: ''
    });
  }

  ngOnInit() {
    this.items = this.userPageService.getItems();
    this.configService.getSuperUsers()
        .subscribe(users => {
          this.superUsers = users;
        })
    }

  onSubmit(userData) {
    this.loginPageService.superUserData = userData;
    console.log(this.loginPageService.superUserData)
    this.items = this.userPageService.clearItems();
    this.loginForm.reset();
    console.warn('Thanks for using our application', userData.name);
  }
}
