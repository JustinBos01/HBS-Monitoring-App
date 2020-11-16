import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPageService } from '../user-page/user-page.service'

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent {
  items;
  loginForm;

  constructor(
    private userPageService: UserPageService,
    private formBuilder: FormBuilder,
  ) {
    this.loginForm = this.formBuilder.group({
      name: '',
      password: ''
    });
  }

  ngOnInit() {
    this.items = this.userPageService.getItems();
  }

  onSubmit(userData) {
    // Process checkout data here
    this.items = this.userPageService.clearItems();
    this.loginForm.reset();
    console.log(userData)
    console.warn('Thanks for using our application', userData.name);
  }
 }
