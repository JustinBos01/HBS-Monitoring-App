import { AfterViewInit, Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from './group-page.service';
import { GroupOverviewService } from '../group-overview/group-overview.service';



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
  chosenGroup = localStorage.getItem('chosenGroup');
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
  chosenGroupInfos = [];
  
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
    private groupOverviewService: GroupOverviewService,
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
    // this.route.paramMap.subscribe(params => {
    //   this.user = this.configService.getUsersOfGroup(this.configService.chosenGroup)[+params.get('id')]
    // });
    
    this.chosenGroup = localStorage.getItem('chosenGroup')
  }

  
  print() {
    console.log(this.groups)
  }

  getUsersOfGroup() {
    console.log(this.chosenGroup)
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
        if (!this.user){
        alert("There seems to be no users in this group")}
        })
  }

 

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        this.getGroupInfosAmount()
      })
      
    }

  enableGroup() {
    this.configService.enableGroup()
      .subscribe(groups => {
        this.enabledGroup = groups;
        window.location.reload()
      })
      
    }

  disableGroup() {
    this.configService.disableGroup()
      .subscribe(groups => {
        this.enabledGroup = groups;
        window.location.reload()
      })
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

    
    this.configService.changeGroupInfos()
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

  getGroupInfosAmount() {
    
    for (let group of this.groups) {
      
      if (group.group.name == this.chosenGroup) {
        try {
          for (let index of group.groupInfos) {
            this.chosenGroupInfos.push({key: index.key, value: index.value})
          }
        }
        catch {console.log('no infos available')}
        
      }
    }
    console.log(this.chosenGroupInfos)
  }


  changeLabelName(lbl, val) {
    document.getElementById(lbl).innerHTML = val;
  }

  getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }
}
