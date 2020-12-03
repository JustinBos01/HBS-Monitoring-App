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
  }

  removevalue(i){
    this.values.splice(i,1);
  }

  addvalue(amount) {
    this.values.length = 0
    for (var _i = 0; _i < amount; _i++) {
      this.values.push(_i);
      console.log(this.values.length)}
      
  }

  printValues() {
    console.log(document.getElementById("name0"))
  }

  createUsers() {
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    for (let index of this.values) {
      
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
      this.userDataString = this.userDataString + 'username: ' + String(this.createUsersService.userString[index].name) + '; password: ' + String(this.createUsersService.userString[index].password) + ';'
      if (index == this.values[this.values.length -1]){
      let file = new Blob([this.userDataString], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'NewPasswords.csv')}
    }
    this.configService.createMultipleUsers(localStorage.getItem('chosenGroup'))
    .subscribe(users => {
      this.users = users;
    })  
  }

  createSuperUsers(){
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    for (let index of this.values){
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
      this.superUserDataString = this.superUserDataString + 'username: ' + String(this.createUsersService.userString[index].name) + '; password: ' + String(this.createUsersService.userString[index].password) + ';'
      if (index == this.values[this.values.length -1]){
      let file = new Blob([this.superUserDataString], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'NewSuPasswords.csv')}
    }
    
    this.configService.createSuperUser()
    .subscribe(users => {
      this.users = users;
    })
  }
  
}