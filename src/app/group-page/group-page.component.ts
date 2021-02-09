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
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';


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
  confirmationCheck = false;
  receiptData = [];;

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
    this.getUserReceiptData()
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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all groups has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all groups has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for enabling a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for enabling a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        window.location.reload()
      }
    ) 
  }

  //disable selected groups
  disableGroup() {
    this.configService.disableGroup()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for disabling a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for disabling a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        window.location.reload()
      }
    )
  }
  
  //change group infos
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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing the group settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing the group settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        window.location.reload()
      })
  }
  
  //create new group infos, adds group infos to already existing group infos collection (which can be empty)
  createNewGroupInfos() {
    this.keyChangeInfos = '';
    this.valueChangeInfos = '';
    this.groupPageService.groupInfosString.length = 0;
    var index = 0
    //gets existing group infos
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        
        if (group.groupInfos != null) {
          for (var infos of group.groupInfos){
            if (infos.key != '' && infos.value != ''){
              this.keyChangeInfos = document.getElementById("key"+index);
              this.valueChangeInfos = document.getElementById("value"+index);
              this.keyChangeInfos = this.keyChangeInfos.value
              this.valueChangeInfos = this.valueChangeInfos.value
              
              if (this.keyChangeInfos != "" && this.valueChangeInfos != ""){
                this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
              }
              index += 1;
            }
          }
        }
      }
    }

    //gets new group infos
    for (var selectedIndex in this.addedValues) {
      this.keyChangeInfos = document.getElementById("newKey"+selectedIndex);
      this.valueChangeInfos = document.getElementById("newValue"+selectedIndex);
      this.keyChangeInfos = this.keyChangeInfos.value
      this.valueChangeInfos = this.valueChangeInfos.value
      this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
    }
    
    this.configService.changeGroupInfos()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing group settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing group settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
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
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing a password has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing a password has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(users => {
          this.user = users;
      })
  }

  //regroup single user
  regroupUsers(userId, correspondingUser) {
    if (this.newGroup != '') {
      this.newGroup = document.getElementById('group'+userId)
      this.configService.regroupUsers(correspondingUser, this.newGroup.value)
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for regrouping a user has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for regrouping a user has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(_ => {
          this.getUsersOfGroup()
        })
    }
  }

  //regroup entire group
  regroupGroup(reGroupValue) {
    this.configService.regroupGroup(this.configService.chosenGroup, reGroupValue)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for regrouping all users in a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for regrouping all users in a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
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
    this.chosenGroupInfos.length = 0
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
    this.getGroupInfosAmount();
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group": {"name" : newGroupName},
      "groupInfos"  : this.chosenGroupInfos
      }
    this.configService.duplicateGroup(this.JsonString)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for duplicating a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for duplicating a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.router.navigate(['/overview'])
      })
  }

  //delete all groupinfos of selected group
  deleteGroupInfos() {
    this.configService.deleteGroupInfos(localStorage.getItem('chosenGroup'))
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for delete a group's settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for delete a group's settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        window.location.reload()
      })
  }

  //filter users
  filterOnUsers(filterValue) {
    localStorage.setItem('filterValue', filterValue)
    this.configService.getUsersOfGroup(this.chosenGroup)
    .pipe(catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}.\n
        An error for filtering users has occurred`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
        An error for filtering users has occurred`;
      }
      window.alert(errorMessage);
      return throwError(error)
    }))
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

  getUserReceiptData() {
    this.configService.getReceiptsPerUser()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving the user's receipts has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving the user's receipts has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.receiptData = groups.receiptsPerUsers
        console.log(this.receiptData)
      }
    )
  }
}
