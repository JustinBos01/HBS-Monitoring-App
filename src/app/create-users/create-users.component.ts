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
  unableAddition = [];
  unableAdditionAmount = 0;
  allUsernames = [];
  allUsers;


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
    this.getAllUsers();
  }

  getAllUsers() {
    this.configService.getAllUsers()
    .subscribe(users => {
        this.allUsers = users;
      }
    )
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
    this.unableAddition.length = 0;

    for (let index of this.values) {
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      
      if (this.userName != '' && this.userPassword != '' && this.allUsernames.includes(this.userName) == false){
        this.allUsernames.push(this.userName)
        this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
        this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password) + ';\n'
      } else {
        this.unableAddition.push(this.userName)
      }
    }

    this.configService.createMultipleUsers()
    .subscribe(_ => {
      let file = new Blob(['username;', 'password;\n', this.userDataString, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
      if (this.userDataStringExcel != ''){
        saveAs(file, 'NewPasswords.csv');
      }
    })
  }

  createRandomUsers(tag) {
    this.createUsersService.userString.length = 0;
    this.idString = '';
    this.passwordString = '';
    this.userDataString = '';
    this.userDataStringExcel = '';
    this.unableAddition.length = 0;
    this.unableAdditionAmount = 0;
    var newMadeUID = []
    
    for (let index of this.allUsers.userNames) {
      this.allUsernames.push(index.name)
    }
    var i = 0;
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

      this.randomUsernameString = tag + this.idString;
      newMadeUID.push(this.randomUsernameString)
      if (this.allUsernames.includes(newMadeUID[newMadeUID.length-1]) == false && this.allUsernames.includes(this.randomUsernameString) == false){
        this.createUsersService.userString.push({name : this.randomUsernameString, password : this.passwordString });
        this.allUsernames.push(newMadeUID[newMadeUID.length-1])
        this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[i].name) + ';' + String(this.createUsersService.userString[i].password) + ';\n';
        this.userDataStringExcel = this.userDataStringExcel + '' + String(this.createUsersService.userString[i].name) + ';#' + String(this.createUsersService.userString[i].password) + ';\n';
      } else {
        this.unableAdditionAmount += 1
      }
      console.log(this.createUsersService.userString[0])
      i += 1;
    }

    i=0
    var newMadeUID = []
    var _i = 0

    while (this.unableAdditionAmount != 0) {
        this.idString = '';
        this.passwordString = '';
        this.userString = [];
        for (var _ii = 0; _ii < 6; _ii++) {
          this.userCreationCode = this.getRandomInt(0, 10)
          this.idString = this.idString + String(this.userCreationCode)
        }

        for (var _ii = 0; _ii < 6; _ii++) {
          this.userCreationCode = this.getRandomInt(0, 10)
          this.passwordString = this.passwordString + String(this.userCreationCode)
        }

        this.randomUsernameString = tag + this.idString;

        if (this.allUsernames.includes(this.randomUsernameString) == false) {
          this.allUsernames.push(this.randomUsernameString)
          this.createUsersService.userString.push({name : this.randomUsernameString, password : this.passwordString });
          this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[i].name) + ';' + String(this.createUsersService.userString[i].password.slice(0, 6)) + ';\n';
          this.userDataStringExcel = this.userDataStringExcel + '' + String(this.createUsersService.userString[i].name) + ';#' + String(this.createUsersService.userString[i].password.slice(0, 6)) + ';\n';
          this.unableAdditionAmount -= 1;
          i+= 1
        }
        console.log(this.userDataString)
        _i += 1
    }
    
    this.configService.createMultipleUsers()
    .subscribe(users => {
      this.users = users;
      let file = new Blob(['username;', 'password;', 'Remove the "#" for your password;\n', this.userDataStringExcel, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
      saveAs(file, 'NewPasswords.csv')
    })
  }

  createSuperUsers(){
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    this.superUserDataString = '';
    this.unableAddition.length = 0;
    this.allUsernames = [];
    
    for (let index of this.values){
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      
      if (this.userName != '' && this.userPassword != '' && this.allUsernames.includes(this.userName) == false){
        this.allUsernames.push(this.userName)
        this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
        this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password) + ';\n'
      } else {
        this.unableAddition.push(this.userName)
      }
      
    }

    this.configService.createSuperUser()
    .subscribe(users => {
      this.users = users;
      let file = new Blob(['username;', 'password;\n', this.superUserDataString, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
      if (this.userDataStringExcel != ''){
        saveAs(file, 'NewSuPasswords.csv')
      }
    })
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }
}