import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from './group-page.service';



@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit {
  createGroupForm;
  changeGroupInfosForm;
  newMadeGroupInfos;
  user;
  groups;
  chosenGroup = this.configService.chosenGroup;
  groupData;
  superuserData;
  changePasswordUser;
  newPassword;
  groupInfosLength = [{key: '',
                      value: ''}];
  groupInfosValues = [{key: '',
                      value: ''}];
  newGroup;
  changeGroup;
  chosenGroupInfos;
  
  enabledGroup;
  keyChangeInfos;
  valueChangeInfos;
  groupName;
  key;  
  value;

  constructor(
    public configService: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService,
  ) { 
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      key: '',
      value: ''})
    
    this.changeGroupInfosForm = this.formBuilder.group({
      keyChangeInfos: '',
      valueChangeInfos: ''
    })
    ;}

  ngOnInit(): void {
    this.showGroupResponse()
    this.getUsersOfGroup()
    //this.getChosenGroupInfos()
    
    this.route.paramMap.subscribe(params => {
      this.user = this.configService.getUsersOfGroup(this.configService.chosenGroup)[+params.get('id')]
    });
    //this.getGroupInfosAmount()
    console.log(this.configService.chosenGroupInfos)
    this.chosenGroupInfos = this.configService.chosenGroupInfos
    //this.getChosenGroupInfos()
    //this.getGroupInfosAmount()
    
  }

  
  print() {
    console.log(this.groups)
    
  }
  getUsersOfGroup() {
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
    })
  }

 

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
      })
    }

  enableGroup() {
    this.configService.enableGroup(this.configService.chosenGroup)
      .subscribe(groups => {
        this.enabledGroup = groups;
      })
    }

  disableGroup() {
    this.configService.disableGroup(this.configService.chosenGroup)
      .subscribe(groups => {
        this.enabledGroup = groups;
      })
    }

  
  
  printGroups() {
    console.log(this.groups)
    for (let group of this.groups) {
      console.log(this.groups)
      if (this.chosenGroup == group.group.name) {
        console.log(this.groups)
        for (let infos of group.groupInfos) {
          this.groupInfosValues.push({key: infos.key, value: infos.value})
        }
      }
    }
  }
  

  changeGroupInfos(){
    
    this.keyChangeInfos = '';
    this.valueChangeInfos = '';
    this.groupPageService.groupInfosString.length = 0;
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        for (var index in group.groupInfos){
          this.keyChangeInfos = document.getElementById("key"+index);
          this.valueChangeInfos = document.getElementById("value"+index);
          this.keyChangeInfos = this.keyChangeInfos.value
          this.valueChangeInfos = this.valueChangeInfos.value
          console.log(this.keyChangeInfos)
          console.log(this.valueChangeInfos)
          this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
        }
      }
    }

    
    this.configService.changeGroupInfos(this.configService.chosenGroup)
    .subscribe(newGroupInfos => {
      this.newMadeGroupInfos = newGroupInfos;
    })
  }
  
  changePassword(userId, correspondingUser) {
    this.newPassword = document.getElementById('passwordValue'+userId)
    this.configService.changePassword(correspondingUser, this.newPassword.value)
    .subscribe(users => {
      this.changePasswordUser = users;
    })
    
  
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
        console.log(this.user)
    })
  }

  regroupUsers(userId, correspondingUser) {
    this.newGroup = document.getElementById('group'+userId)
    this.configService.regroupUsers(correspondingUser, this.newGroup.value)
    .subscribe(users => {
      this.changeGroup = users;
    })
  }

  regroupGroup(reGroupValue) {
    this.configService.regroupGroup(this.configService.chosenGroup, reGroupValue)
    .subscribe(users => {
      this.changeGroup = users;
    })
  }

  //getGroupInfosAmount() {
  //  for (let group of this.groups) {
  //    if (group == this.chosenGroup) {
  //      for (let index of group.groupInfos) {
  //        this.configService.chosenGroupInfos.push({key: index.key, value: index.value})
  //        
  //      }
  //    }
  //  }
  //  console.log(this.groupInfosLength)
  //}

  addToGroupInfos(){
    document.getElementById('')
  }

  changeLabelName(lbl, val) {
    document.getElementById(lbl).innerHTML = val;
  }

  getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
