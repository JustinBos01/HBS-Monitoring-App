import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { config } from 'process';
import { ConfigService } from '../config/config.service';
import { CreateUsersService } from './create-users.service'
import { newlyCreatedUsers } from '../users';
import * as saveAs from 'file-saver';
import * as XLSX from 'xlsx';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';

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
  arrayBuffer:any;
  file:File;
  userImportAddition;

  randomFunc = {
    lower: this.getRandomLower,
    upper: this.getRandomUpper,
    number: this.getRandomNumber,
    symbol: this.getRandomSymbol
  }

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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all users has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all users has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
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

  //create users manually by entering a password/username for them
  createUsers() {
    this.userName = ''
    this.userPassword = ''
    this.userDataString = '';
    this.createUsersService.userString.length = 0;
    this.userDataStringExcel = '';
    this.superUserDataString = '';
    this.unableAddition.length = 0;
    this.allUsernames.length = 0;

    //get all usernames
    for (let index of this.allUsers.userNames) {
      this.allUsernames.push(index.name)
    }

    for (let index of this.values) {
      this.userName = document.getElementById("name"+index);
      this.userPassword = document.getElementById("password"+index);
      this.userName = this.userName.value;
      this.userPassword = this.userPassword.value;
      
      if (this.userName != '' && this.userPassword != '' && this.allUsernames.includes(this.userName) == false ){
        this.allUsernames.push(this.userName)
        this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
        this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[index].name) + ';' + String(this.createUsersService.userString[index].password) + ';\n'
      } else {
        this.unableAddition.push(this.userName)
      }
    }

    this.configService.createMultipleUsers()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for creating users has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for creating users has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
          if (this.userDataString.length != 0){
            //create excel file with new users
          let file = new Blob(['username;', 'password;\n', this.userDataString, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
          saveAs(file, 'NewPasswords.csv');
        }
      })
  }

  //create random users function
  createRandomUsers(tag) {
    this.createUsersService.userString.length = 0;
    this.idString = '';
    this.passwordString = '';
    this.userDataString = '';
    this.userDataStringExcel = '';
    this.unableAddition.length = 0;
    this.unableAdditionAmount = 0;
    var newMadeUID = []
    this.allUsernames.length = 0;
    
    //get all usernames
    for (let index of this.allUsers.userNames) {
      this.allUsernames.push(index.name)
    }

    //set index variable
    var i = 0;
    for (let index of this.values) {
      
      this.idString = '';
      this.passwordString = '';

      for (var _i = 0; _i < 6; _i++) {
        this.userCreationCode = this.getRandomInt(0, 10)
        this.idString = this.idString + String(this.userCreationCode)
      }

      this.passwordString = this.generatePassword(true, true, true, false, 7)
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
      i += 1;
    }

    i=0
    var newMadeUID = []
    var _i = 0

    //no duplicate names, this checks if a name has been entered in the db yet, will keep going until the entered amount has been added
    while (this.unableAdditionAmount != 0) {
        this.idString = '';
        this.passwordString = '';
        this.userString = [];
        for (var _ii = 0; _ii < 6; _ii++) {
          this.userCreationCode = this.getRandomInt(0, 10)
          this.idString = this.idString + String(this.userCreationCode)
        }
        
        this.passwordString = this.generatePassword(true, true, true, false, 7)
        //this.passwordString = Math.random().toString(36).slice(-7);
        this.randomUsernameString = tag + this.idString;

        if (this.allUsernames.includes(this.randomUsernameString) == false) {
          this.allUsernames.push(this.randomUsernameString)
          this.createUsersService.userString.push({name : this.randomUsernameString, password : this.passwordString });
          this.userDataString = this.userDataString + '' + String(this.createUsersService.userString[i].name) + ';' + String(this.createUsersService.userString[i].password.slice(0, 6)) + ';\n';
          this.userDataStringExcel = this.userDataStringExcel + '' + String(this.createUsersService.userString[i].name) + ';#' + String(this.createUsersService.userString[i].password.slice(0, 6)) + ';\n';
          this.unableAdditionAmount -= 1;
          i+= 1
        }
        _i += 1
    }
    
    this.configService.createMultipleUsers()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for creating users has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for creating users has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(users => {
        this.users = users;
        let file = new Blob(['username;', 'password;', 'Remove the "#" for your password;\n', this.userDataStringExcel, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
        saveAs(file, 'NewPasswords.csv')
      })
  }

  //create superuser function
  createSuperUsers(){
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    this.superUserDataString = '';
    this.userDataStringExcel = '';
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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for creating superusers has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for creating superusers has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(users => {
        this.users = users;
        let file = new Blob(['username;', 'password;\n', this.superUserDataString, 'Added to:;', localStorage.getItem('chosenGroup')], { type: 'text/csv;charset=utf-8' });
        saveAs(file, 'NewSuPasswords.csv')
      })
  }

  //randomize numbers for password/username
  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  //handle file import
  onFileChange(event: any) {
    this.unableAddition.length = 0;
    for (let index of this.allUsers.userNames) {
      this.allUsernames.push(index.name)
    }
    this.createUsersService.userString.length = 0

    // wire up file reader
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      throw new Error('Cannot use multiple files');
    }

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(target.files[0]);

    reader.onload = (e: any) => {
      // create workbook
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

      // selected the first sheet
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      /* save data */
      this.userString = XLSX.utils.sheet_to_json(ws);

      for (let i of this.userString){
        //remove # if it is the first index of the password string
        if (i.password[0] == '#') {
          i.password = i.password.substring(1, i.password.length)
        }

        //check for duplicate usernames
        if (this.allUsernames.includes(i.username) == false){
          this.createUsersService.userString.push({name: i.username, password: i.password})
        } else {
          this.unableAddition.push(i.username)
        }
      }
    }
  }

  //uploads imported file
  onSubmitted() {
    this.configService.createMultipleUsers()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for creating users through an import has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for creating users through an import has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe()
  }

  generatePassword(lower, upper, number, symbol, length) {
    let generatedPassword = '';
    const typesCount = lower + upper + number + symbol;
    const typesArr = [{lower}, {upper}, {number}, {symbol}].filter(item => Object.values(item)[0]);
    
    // Doesn't have a selected type
    if(typesCount === 0) {
      return '';
    }
    
    // create a loop
    for(let i=0; i<length; i+=typesCount) {
      typesArr.forEach(type => {
        const funcName = Object.keys(type)[0];
        generatedPassword += this.randomFunc[funcName]();
      });
    }
    
    const finalPassword = generatedPassword.slice(0, length);
    console.log(finalPassword)
    
    return finalPassword;
  }

  getRandomLower() {
    const lower = "abcdefghijkmnopqrstuvwxyz"
    return lower[Math.floor(Math.random() * lower.length)];
  }

  getRandomUpper() {
    const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
    return upper[Math.floor(Math.random() * upper.length)];
  }

  getRandomNumber() {
    const number = "123456789"
    return number[Math.floor(Math.random() * number.length)];
  }

  getRandomSymbol() {
    const symbols = '!@#$%^&*(){}[]=<>/,.'
    return symbols[Math.floor(Math.random() * symbols.length)];
  }

}
