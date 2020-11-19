import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service'



@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit {
  user;
  group;
  groupData;
  createGroupForm;
  superuserData
  
  groupName;
  key;
  value;
  constructor(
    public configService: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginPageService: LoginPageService
  ) { 
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      key: '',
      value: ''
  });}

  ngOnInit(): void {
    
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
        console.log(this.user)
    })
      
    console.log(this.user)
    this.route.paramMap.subscribe(params => {
      this.user = this.configService.getUsersOfGroup(this.configService.chosenGroup)[+params.get('id')]
    });
  }

  createGroup(userData) {
    this.superuserData = this.loginPageService.superUserData;
    console.log(this.superuserData.superuserName)
    this.configService.createGroup(userData.groupName, userData.key, userData.value)
      .subscribe(groupdata => {
        this.groupData = groupdata;
        console.log(this.groupData);
      })
    this.createGroupForm.reset()
    }

  createInput() {
    let row = document.createElement('div');
    row.innerHTML = `<br> <input type='number'>`
  }
    
}
