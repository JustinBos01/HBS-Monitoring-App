import { AfterViewInit, Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from './group-page.service';
import { GroupOverviewService } from '../group-overview/group-overview.service';
import { TopBarService } from '../top-bar/top-bar.service';
import { Router } from '@angular/router';


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
  values = [];
  enabledGroup;
  keyChangeInfos;
  valueChangeInfos;
  groupName;
  key;  
  value;
  addedValues = [];
  JsonString;
  keyValues = [{
    key: '',
    value: ''
  }]

  constructor(
    public configService: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService,
    private groupOverviewService: GroupOverviewService,
    public navigation: TopBarService,
    private router: Router,
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
    this.navigation.hide()
    this.chosenGroup = localStorage.getItem('chosenGroup')
  }

  getUsersOfGroup() {
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
      }
    )
  }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        this.getGroupInfosAmount()
      }
    )    
  }

  enableGroup() {
    this.configService.enableGroup()
      .subscribe(_ => {
        window.location.reload()
      }
    ) 
  }

  disableGroup() {
    this.configService.disableGroup()
      .subscribe(_ => {
        window.location.reload()
      }
    )
  }
  
  changeGroupInfos() {
    this.groupPageService.groupInfosString.length = 0;
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        for (var index in group.groupInfos){
          this.keyChangeInfos = document.getElementById("key"+index);
          this.valueChangeInfos = document.getElementById("value"+index);
          this.keyChangeInfos = this.keyChangeInfos.value
          this.valueChangeInfos = this.valueChangeInfos.value
          this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
        }
      }
    }
    
    this.configService.changeGroupInfos()
    .subscribe(_ => {
      window.location.reload()
    })
  }
  
  createNewGroupInfos() {
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
          this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
        }
      }
    }

    for (var index in this.addedValues) {
      this.keyChangeInfos = document.getElementById("newKey"+index);
      this.valueChangeInfos = document.getElementById("newValue"+index);
      this.keyChangeInfos = this.keyChangeInfos.value
      this.valueChangeInfos = this.valueChangeInfos.value
      this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
    }
    
    this.configService.changeGroupInfos()
    .subscribe(_ => {
      window.location.reload();
    })
  }
  
  
  changePassword(userId, correspondingUser) {
    this.newPassword = document.getElementById('passwordValue'+userId)
    this.configService.changePassword(correspondingUser, this.newPassword.value)
    .subscribe()
    
  
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
    })
  }

  regroupUsers(userId, correspondingUser) {
    this.newGroup = document.getElementById('group'+userId)
    this.configService.regroupUsers(correspondingUser, this.newGroup.value)
    .subscribe(_ => {
      window.location.reload()
    })
  }

  regroupGroup(reGroupValue) {
    this.configService.regroupGroup(this.configService.chosenGroup, reGroupValue)
    .subscribe(_ => {
      this.router.navigate(['/overview'])
    })
  }

  addvalue(amount) {
    this.values.length = 0;
    this.addedValues.length = 0;
    for (let groupInfos in this.chosenGroupInfos) {
      this.values.push(groupInfos)
    }
    for (var _i = 0; _i < amount; _i++) {
      this.values.push(_i);
      this.addedValues.push(_i);
    }
  }

  getGroupInfosAmount() {
    
    for (let group of this.groups) {
      
      if (group.group.name == this.chosenGroup) {
        try {
          for (let index of group.groupInfos) {
            if (index.key != '' && index.value != ''){
              this.chosenGroupInfos.push({key: index.key, value: index.value})
            }
          }
        }
        catch {console.log('no infos available')}
      }
    }
  }

  changeLabelName(lbl, val) {
    document.getElementById(lbl).innerHTML = val;
  }

  getRandomNumberBetween(min,max){
    return Math.floor(Math.random()*(max-min+1)+min);
  }

  duplicateGroup(newGroupName) {
    this.chosenGroupInfos.length = 0;
    this.getGroupInfosAmount();
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group": {"name" : newGroupName},
      "groupInfos"  : this.chosenGroupInfos
      }
    this.configService.duplicateGroup(this.JsonString).subscribe(_ => {
      this.router.navigate(['/overview'])
    })
  }

  deleteGroupInfos() {
    this.configService.deleteGroupInfos(localStorage.getItem('chosenGroup')).subscribe(_ => {
      window.location.reload()
    })
  }

  goToParaDataPage(givenUserName, givenUserId, event) {
    localStorage.setItem('chosenUser', givenUserName)
    this.router.navigate(['/paradata-user', givenUserId])
    console.log(givenUserName, givenUserId)
  }


  filterOnUsers(filterValue) {
    localStorage.setItem('filterValue', filterValue)
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
        this.user = this.user.filter(this.filterUsers)
      }
    )
  }

  filterUsers(element, index, array) {
    return element.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }
}
