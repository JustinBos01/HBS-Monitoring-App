import { AfterViewInit, Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from './group-page.service';
import { GroupOverviewService } from '../group-overview/group-overview.service';
import { TopBarService } from '../top-bar/top-bar.service';
import { Router } from '@angular/router';
import { basename } from 'path';


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
  allGroupNames = [];
  userReceiptData;
  userReceiptImg = [];
  userReceiptProductsInfo = [];

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

  //get all users in the selected group
  getUsersOfGroup() {
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
      }
    )
  }

  //get all groups, also collects all group names for later functionalities
  showGroupResponse() {
    this.allGroupNames.length = 0;
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        this.getGroupInfosAmount()
        for (let group of this.groups){
          this.allGroupNames.push(group.group.name)
        }
      }
    )
  }

  //enable selected group
  enableGroup() {
    this.configService.enableGroup()
      .subscribe(_ => {
        window.location.reload()
      }
    ) 
  }

  //disable selected groups
  disableGroup() {
    this.configService.disableGroup()
      .subscribe(_ => {
        window.location.reload()
      }
    )
  }
  
  //change group infos, still a bug somewhere in this function
  changeGroupInfos() {
    this.groupPageService.groupInfosString.length = 0;
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        for (var index in group.groupInfos){
          //get all added key/value values
          this.keyChangeInfos = document.getElementById("key"+index);
          this.valueChangeInfos = document.getElementById("value"+index);
          this.keyChangeInfos = this.keyChangeInfos.value
          this.valueChangeInfos = this.valueChangeInfos.value
          //adds key/value values to infos collection
          this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
        }
      }
    }
    
    //execute change for group infos, this function can mean adding, changing or deleting groupinfos
    this.configService.changeGroupInfos()
    .subscribe(_ => {
      window.location.reload()
    })
  }
  
  //create new group infos, adds group infos to already existing group infos collection (which can be empty)
  createNewGroupInfos() {
    this.keyChangeInfos = '';
    this.valueChangeInfos = '';
    this.groupPageService.groupInfosString.length = 0;
    //gets existing group infos
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

    //gets new group infos
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
  
  //change password of a user
  changePassword(userId, correspondingUser) {
    this.newPassword = document.getElementById('passwordValue'+userId)
    this.configService.changePassword(correspondingUser, this.newPassword.value)
    .subscribe()
    
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
    })
  }

  //regroup single user
  regroupUsers(userId, correspondingUser) {
    if (this.newGroup != '') {
      this.newGroup = document.getElementById('group'+userId)
      this.configService.regroupUsers(correspondingUser, this.newGroup.value)
      .subscribe(_ => {
        this.getUsersOfGroup()
      })
    }
  }

  //regroup entire group
  regroupGroup(reGroupValue) {
    this.configService.regroupGroup(this.configService.chosenGroup, reGroupValue)
    .subscribe(_ => {
      this.router.navigate(['/overview'])
    })
  }

  //counts amount of new textboxes to create
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

  //gets existing group infos amount
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

  //duplicate group (doesn't copy users, does copy group infos)
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

  //delete all groupinfos of selected group
  deleteGroupInfos() {
    this.configService.deleteGroupInfos(localStorage.getItem('chosenGroup')).subscribe(_ => {
      window.location.reload()
    })
  }

  //filter users
  filterOnUsers(filterValue) {
    localStorage.setItem('filterValue', filterValue)
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
        this.user = this.user.filter(this.filterUsers)
      }
    )
  }

  //filter on username
  filterUsers(element, index, array) {
    return element.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }

  //go to receipts page
  userClick(clickedUser) {
    localStorage.setItem('chosenUser', clickedUser);
    this.router.navigate(['/receipts', clickedUser]);
  }
}
