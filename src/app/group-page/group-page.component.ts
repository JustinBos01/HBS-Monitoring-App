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
    console.log(this.chosenGroup)
    this.route.paramMap.subscribe(params => {
      this.user = this.configService.getUsersOfGroup(this.configService.chosenGroup)[+params.get('id')]
    });
    //this.getGroupInfosAmount()
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

  getUsersOfGroup() {
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
        console.log(this.user)
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

  reload() {
    window.location.reload()
  }

  changeGroupInfos(){
    this.keyChangeInfos = '';
    this.valueChangeInfos = '';
    this.groupPageService.groupInfosString.length = 0;
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        for (var index in group.groupInfos){
          console.log(index)
          
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

  // getGroupInfosAmount() {
  //   this.showGroupResponse()
  //   for (let group of this.groups) {
  //     console.log(group)
  //     if (group == this.chosenGroup) {
  //       for (let groupInfos of group) {
  //         this.groupInfosLength.push(groupInfos.key,  groupInfos.value)
  //         console.log(this.groupInfosLength)
  //       }
  //     }
  //   }
  //   console.log(this.groupInfosLength)
  // }

  addToGroupInfos(){
    document.getElementById('')
  }

  changeLabelName(lbl, val) {
    document.getElementById(lbl).innerHTML = val;
  } 
}
