import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { config } from 'process';
import { ConfigService } from '../config/config.service';
import { CreateUsersService } from './create-users.service'
import { newlyCreatedUsers } from '../users';
import * as saveAs from 'file-saver';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})

export class CreateUsersComponent implements OnInit {
  createUsersForm;
  inputForm;
  userName;
  userPassword;
  userString;
  givenGroup;
  values = [];
  users;
  items;
  newlyCreatedUsers;
  superUserDataString = '';
  userDataString = '';
  userCreationCode;
  idString = '';
  passwordString = '';
  userDataStringExcel = '';
  randomUsernameString;
  tag;
  chosenGroup;

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private createUsersService: CreateUsersService
    ) {
    this.createUsersForm = this.formBuilder.group({
      userAmount: ''
    });

    this.inputForm = this.formBuilder.group({
      
    })
  }

  ngOnInit(): void {
    this.chosenGroup = localStorage.getItem('chosenGroup')
  }

  removevalue(i){
    this.values.splice(i,1);
  }

  addvalue(amount) {
    this.values.length = 0
    for (var _i = 0; _i < amount; _i++) {
      this.values.push(_i);
    }
  }

  createUsers() {
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    this.superUserDataString = '';
    for (let index of this.values) {
      
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
      this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password) + ';\n'
      if (index == this.values[this.values.length -1]){
      let file = new Blob(['username;', 'password;\n', this.userDataString], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'NewPasswords.csv')}
    }
    this.configService.createMultipleUsers()
    .subscribe(users => {
      this.users = users;
    })
  }

  createRandomUsers(tag) {
    this.createUsersService.userString.length = 0;
    this.idString = '';
    this.passwordString = '';
    this.userDataString = '';
    this.userDataStringExcel = '';
    for (let index of this.values) {
      this.idString = '';
      this.passwordString = '';
      for (var _i = 0; _i < 6; _i++) {
        this.userCreationCode = this.getRandomInt(0, 10)
        this.idString = this.idString + String(this.userCreationCode)
      }

      for (var _i = 0; _i < 6; _i++) {
        this.userCreationCode = this.getRandomInt(0, 10)
        this.passwordString = this.passwordString + String(this.userCreationCode)
      }
      
      this.randomUsernameString = tag + this.idString
      this.createUsersService.userString.push({name : this.randomUsernameString, password : this.passwordString })
      
      this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password.slice(0, 6)) + ';\n'
      this.userDataStringExcel = this.userDataStringExcel + '' + String(this.createUsersService.userString[index].name) + ';#' + String(this.createUsersService.userString[index].password.slice(0, 6)) + ';\n'
    }
    this.configService.createMultipleUsers()
    .subscribe(users => {
      this.users = users;
    })
    console.log(this.userDataString)
    let file = new Blob(['username;', 'password;', 'Remove the "#" for your password;\n', this.userDataStringExcel], { type: 'text/csv;charset=utf-8' });
    saveAs(file, 'NewPasswords.csv')
    
  }

  createSuperUsers(){
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    this.superUserDataString = '';
    for (let index of this.values){
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
      this.superUserDataString = this.superUserDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password) + ';\n'
      if (index == this.values[this.values.length -1]){
      let file = new Blob(['username;', 'password;\n', this.superUserDataString], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'NewSuPasswords.csv')}
    }

    this.configService.createSuperUser()
    .subscribe(users => {
      this.users = users;
    })
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}