import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { config } from 'process';
import { ConfigService } from '../config/config.service';
import { CreateUsersService } from './create-users.service'

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrls: ['./create-users.component.css']
})

export class CreateUsersComponent implements OnInit {
  createUsersForm;
  inputForm;
  userName = '';
  userPassword = '';
  userString;
  givenGroup;
  values = [];
  users;
  items;

  constructor(
    private formBuilder: FormBuilder,
    private configService: ConfigService,
    private createUsersService: CreateUsersService
    ) {
    this.createUsersForm = this.formBuilder.group({
      userAmount: ''
    });

    this.inputForm = this.formBuilder.group({
      correspondingGroup: ''
    })
  }

  ngOnInit(): void {
  }

  removevalue(i){
    this.values.splice(i,1);
  }

  addvalue(){
    this.values.push(String(this.values.length));
    console.log(this.values.length)
  }

  printValues() {
    console.log(document.getElementById("name0"))
  }

  createUsers(Group) {
    this.userName = ''
    this.userPassword = ''
    this.createUsersService.userString.length = 0;
    for (let index of this.values){
      
      this.userName = document.getElementById("name"+index).value;
      this.userPassword = document.getElementById("password"+index).value;
      
      this.createUsersService.userString.push({name : this.userName, password : this.userPassword })
      
      
    }
    //this.createUsersService.userString = this.createUsersService.userString.replace(/["{]/g, '"{')
    //this.createUsersService.userString = this.createUsersService.userString.replace(/[}"]/g, '}"')
    console.log(this.createUsersService.userString)
    this.givenGroup = Group.correspondingGroup
    this.configService.createMultipleUsers(this.givenGroup)
    .subscribe(users => {
      this.users = users;
    })  
  }

  
}