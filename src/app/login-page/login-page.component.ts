import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UserPageService } from '../user-page/user-page.service'
import { LoginPageService } from '../login-page/login-page.service'
import { ConfigService } from '../config/config.service';
import { TopBarService } from '../top-bar/top-bar.service';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { GroupOverviewComponent } from '../group-overview/group-overview.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})

export class LoginPageComponent implements OnInit {
  items;
  loginForm;
  superUserData;
  superUsers;
  groups;
  errorLbl;
  user;

  constructor(
    private userPageService: UserPageService,
    private loginPageService: LoginPageService,
    private formBuilder: FormBuilder,
    public configService: ConfigService,
    public navigation: TopBarService,
    private router: Router,
  ) {
    this.loginForm = this.formBuilder.group({
      name: '',
      password: ''
    });
    
  }

  ngOnInit() {
    localStorage.clear()
    this.navigation.hide();
    
  }

  getUsersOfGroup(givenGroup) {
    this.configService.getUsersOfGroup(givenGroup)
    .pipe(catchError((error: HttpErrorResponse) => {
      if (error.error instanceof ErrorEvent) {
        //console.log("not "+givenGroup.name)
      } else {
        //console.log("not "+givenGroup.name)
      }
      return throwError(error)
    }))
    .subscribe(users => {
      console.log(users)
      // if (users.includes(localStorage.getItem('superUserData.name'))) {
      //   this.loginPageService.role = givenGroup.name;
      //   localStorage.setItem('role', givenGroup.name)
      //   window.alert(this.loginPageService.role)
      // }
      }
    )
  }

  getGroups(userData) {
    this.loginPageService.superUserData = userData;
    localStorage.setItem('superUserData.name', this.loginPageService.superUserData.name);
    localStorage.setItem('superUserData.password', this.loginPageService.superUserData.password);

    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        console.log(userData)
        if (error.error instanceof ErrorEvent) {
          this.errorLbl = true
        } else {
          this.errorLbl = true
        }
        return throwError(error)
      }))
      .subscribe(groups => {
        this.errorLbl = false
        this.groups = groups;
        for (let group of this.groups) {
          this.configService.getUsersOfGroup(group.group.name)
          .pipe(catchError((error: HttpErrorResponse) => {
            if (error.error instanceof ErrorEvent) {
            } else {
            }
            return throwError(error)
          }))
          .subscribe(users => {
            for (let i in users) {
              if (users[i].name == localStorage.getItem('superUserData.name')) {
                localStorage.setItem('role', group.group.name);
                return
              }
              
              }
              console.log(localStorage.getItem('role'))
            }
          )
        }
        this.router.navigate(['/overview'])
      }
    )
  }
}
