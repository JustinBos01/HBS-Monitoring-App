import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from '../group-page/group-page.service';
import { GroupOverviewService } from './group-overview.service'
import { Router } from '@angular/router';
import { TopBarService } from '../top-bar/top-bar.service';

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
    //localStorage.setItem('chosenGroup', '')
    this.navigation.hide();
    this.showGroupResponse()
  }

  createGroup(userData) {
    this.configService.createGroup(userData.groupName, userData.key, userData.value)
      .subscribe(groupdata => {
        this.groupData = groupdata;
        window.location.reload();
      })
      
  }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
      })
    }

  

  renameGroup(groupId, oldName) {
    this.newGroupName = document.getElementById('group'+groupId)
    this.configService.renameGroup(oldName, this.newGroupName.value)
    .subscribe()
  }

  

  goToPage(givenGroupName, givenGroupId, event) {
    this.groupOverviewService.chosenGroup = givenGroupName;
    localStorage.setItem('chosenGroup', this.groupOverviewService.chosenGroup)
    localStorage.setItem('chosenGroupId', givenGroupId)
    this.router.navigate(['/groups', givenGroupId])
  }

  goToParaDataPage(givenGroupName, givenGroupId, event) {
    this.groupOverviewService.chosenGroup = givenGroupName;
    localStorage.setItem('chosenGroup', this.groupOverviewService.chosenGroup)
    localStorage.setItem('chosenGroupId', givenGroupId)
    this.router.navigate(['/paradata-group', givenGroupId])
  }

  deleteGroups() {
    for (let group of this.groups) {
      if (group.group.users == 0){
        this.emptyGroups.push(group.group.name)
      } 
    }

    for (let empty of this.emptyGroups){
      this.configService.deleteGroupInfos(empty).subscribe(nv => 
        {
          this.configService.deleteEmptyGroups(empty).subscribe(nv => 
            {
              if (empty == this.emptyGroups[this.emptyGroups.length - 1]){
                window.location.reload()
              }
            }
          )
        }
      )
    }
  }

 

  reload() {
    window.location.reload();
  }

  deleteSingleEmptyGroup(groupName) {
    this.configService.deleteGroupInfos(groupName).subscribe(nv => 
      {
        this.configService.deleteSingleEmptyGroup(groupName)
        .subscribe(nv => {
          window.location.reload();
          }
        )
      }
    )
  }

  filter(functionType, filterValue) {
    localStorage.setItem('filterValue', filterValue)
    this.alteredFilter = functionType
    this.configService.getGroups()
      .subscribe(groups => {
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
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue')) || element.group.name.toUpperCase().includes(localStorage.getItem('filterValue'))
  }

  filterDisabledQuery(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue')) || element.group.name.toUpperCase().includes(localStorage.getItem('filterValue'))
  }

  filterEmptyQuery(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue')) || element.group.name.toUpperCase().includes(localStorage.getItem('filterValue'))
  }

  revertFilter(element, index, array) {
    return element
  }

  filterNormal(element, index, array) {
    return element.group.name.toLowerCase().includes(localStorage.getItem('filterValue')) || element.group.name.toUpperCase().includes(localStorage.getItem('filterValue'))
  }
  
  
}