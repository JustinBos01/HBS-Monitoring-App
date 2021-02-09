import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from '../group-page/group-page.service';
import { GroupOverviewService } from './group-overview.service'
import { Router } from '@angular/router';
import { TopBarService } from '../top-bar/top-bar.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-group-overview',
  templateUrl: './group-overview.component.html',
  styleUrls: ['./group-overview.component.css']
})
export class GroupOverviewComponent implements OnInit {
  superuserData
  createGroupForm;
  tableForm
  groupData;
  groups;
  newGroupName;
  users = [];
  chosenGroup;
  placeholderVar;
  undeletable = [];
  emptyGroups = [];
  statusFilter = "all";
  isEmpty: boolean;
  alteredFilter = 'all';
  givenFilterValue;
  totalUsers;
  allUsers;
  confirmationCheck = false;
  singleConfirmationCheck = false;
  isDisabled = false;
  allGroupNames = [];

  constructor(
    public navigation: TopBarService,
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService,
    private router: Router,
    private groupOverviewService: GroupOverviewService,
  ) {
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      key: '',
      value: ''}) 
    
    this.tableForm = this.formBuilder.group({
      value: ''
    })
  }

  ngOnInit(): void {
    localStorage.setItem('chosenGroup', '')
    localStorage.setItem('chosenUser', '')
    this.navigation.hide();
    this.showGroupResponse();
    this.getAllUsers();
    this.getAllGroupNames();
  }

  createGroup(userData) {
    //create empty group
    
    this.configService.createGroup(userData.groupName, "", "")
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for creating a new group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for creating a new group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groupdata => {
        this.groupData = groupdata;
        this.showGroupResponse()
        alert("The group: " + userData.groupName + " has been added")
      })
      
  }

  //get group data
  showGroupResponse() {
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
      })
    }

  getAllGroupNames() {
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all group names has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all group names has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.groups = groups;
        for(let groupName of this.groups) {
          this.allGroupNames.push(groupName.group.name)
        }
      })
    }

  //rename group
  renameGroup(groupId, oldName) {
    this.newGroupName = document.getElementById('group'+groupId)
    this.configService.renameGroup(oldName, this.newGroupName.value)
    .pipe(catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}.\n
        An error for renaming a group has occurred`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
        An error for renaming a group has occurred`;
      }
      window.alert(errorMessage);
      return throwError(error)
    }))
    .subscribe(_ => 
      {
        this.showGroupResponse();
      }
    )
  }

  //navigate to group page
  goToPage(givenGroupName, givenGroupId, event) {
    this.groupOverviewService.chosenGroup = givenGroupName;
    localStorage.setItem('chosenGroup', this.groupOverviewService.chosenGroup)
    localStorage.setItem('chosenGroupId', givenGroupId)
    this.router.navigate(['/groups', givenGroupId])
  }

  //go to paradata page
  goToParaDataPage(givenGroupName, givenGroupId, event) {
    this.groupOverviewService.chosenGroup = givenGroupName;
    localStorage.setItem('chosenGroup', this.groupOverviewService.chosenGroup)
    localStorage.setItem('chosenGroupId', givenGroupId)
    this.router.navigate(['/paradata-group', givenGroupId])
  }

  //delete all empty groups
  deleteGroups() {
    //get all empty groups
    for (let group of this.groups) {
      if (group.group.users == 0) {
        this.emptyGroups.push(group.group.name)
      } 
    }

    //empty groupinfos for groups with no users
    for (let empty of this.emptyGroups){
      this.configService.deleteGroupInfos(empty)
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for deleting a group's has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for deleting a group's settings has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(nv => 
          {
            //delete empty groups
            this.configService.deleteEmptyGroups(empty)
              .pipe(catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                  errorMessage = `Error: ${error.error.message}.\n
                  An error for deleting a group has occurred`;
                } else {
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
                  An error for deleting a group has occurred`;
                }
                window.alert(errorMessage);
                return throwError(error)
              }))
              .subscribe(nv =>
                {
                  if (empty == this.emptyGroups[this.emptyGroups.length - 1]){
                    //refresh data
                    this.showGroupResponse()
                  }
                }
              )
          }
        )
    }
  }

 
  //reload page
  reload() {
    window.location.reload();
  }

  //delete a single empty group (on interaction)
  deleteSingleEmptyGroup(groupName) {
    this.configService.deleteGroupInfos(groupName)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for deleting groups has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for deleting groups has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(nv => 
        {
          this.configService.deleteSingleEmptyGroup(groupName)
          .subscribe(_ => {
              this.showGroupResponse()
            }
          )
        }
      )
  }

  //filter groups
  filter(functionType, filterValue) {
    localStorage.setItem('filterValue', filterValue)
    this.alteredFilter = functionType
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for filtering has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for filtering has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        //get filter values
        if (this.alteredFilter == 'enabled' && filterValue != '') {
          functionType = 'enabled + filter'
        } else 
        if (this.alteredFilter == 'enabled' && filterValue == '') {
          functionType = 'enabled'
        } else 
        if (this.alteredFilter == 'disabled' && filterValue != '') {
          functionType = 'disabled + filter'
        } else 
        if (this.alteredFilter == 'disabled' && filterValue == '') {
          functionType = 'disabled'
        } else 
        if (this.alteredFilter == 'empty' && filterValue != '') {
          functionType = 'empty + filter'
        } else
        if (this.alteredFilter == 'empty' && filterValue == '') {
          functionType = 'empty'
        } else if (this.alteredFilter == 'all' && filterValue != '') {
          functionType = 'all + filter'
        } else if (this.alteredFilter == 'all' && filterValue == '') {
          functionType = 'all'
        }

        this.groups = groups;
        //decides what filter function to use, checks for filter type above for front-end, below for back-end
        if (functionType == 'enabled'){
          this.alteredFilter = 'enabled';
          this.groups = this.groups.filter(this.filterEnabled)
        } else
        if (functionType == 'disabled'){
          this.alteredFilter = 'disabled';
          this.groups = this.groups.filter(this.filterDisabled)
        } else
        if (functionType == 'empty'){
          this.alteredFilter = 'empty';
          this.groups = this.groups.filter(this.filterEmpty)
        } else
        if (functionType == "all") {
          this.alteredFilter = 'all';
          this.groups = this.groups.filter(this.revertFilter)
        } else
        if (functionType == 'enabled + filter') {
          this.groups = this.groups.filter(this.filterEnabled)
          this.groups = this.groups.filter(this.filterEnabledQuery)
        } else 
        if (functionType == 'disabled + filter') {
          this.groups = this.groups.filter(this.filterDisabled)
          this.groups = this.groups.filter(this.filterDisabledQuery)
        } else
        if (functionType == 'empty + filter') {
          this.groups = this.groups.filter(this.filterEmpty)
          this.groups = this.groups.filter(this.filterEmptyQuery)
        } else
        if (functionType == 'all + filter') {
          this.groups = this.groups.filter(this.filterNormal)
        }
      })
    }

  //all filter functions
  filterEnabled(element, index, array) {
    return element.group.status == "enabled"
  }

  filterDisabled(element, index, array) {
    return element.group.status == "disabled"
  }
  
  filterEmpty(element, index, array) {
    return element.group.users == 0
  }

  filterEnabledQuery(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }

  filterDisabledQuery(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }

  filterEmptyQuery(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }

  revertFilter(element, index, array) {
    return element
  }

  filterNormal(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }
  
  //get users of ALL groups
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
        this.allUsers = this.allUsers.userNames.length
      }
    )
  }

  
}