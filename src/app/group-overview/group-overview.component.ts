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
    this.navigation.hide();
    this.showGroupResponse()
  }

  createGroup(userData) {
    this.configService.createGroup(userData.groupName, userData.key, userData.value)
      .subscribe(groupdata => {
        this.groupData = groupdata;
        console.log(this.groupData);
        window.location.reload();
      })
      
  }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
      })
    }

  getUsersFromGroup(group) {
    this.configService.getUsersOfGroup(group);
    this.configService.items = group;
  }

  renameGroup(groupId, oldName) {
    this.newGroupName = document.getElementById('group'+groupId)
    console.log(this.newGroupName.value)
    this.configService.renameGroup(oldName, this.newGroupName.value)
    .subscribe()
  }

  selectGroup(givenGroup) {
    //console.log('werkt')
    //this.route.paramMap.subscribe(params => {
    //  this.chosenGroup = this.configService.getUsersOfGroup(givenGroup)[+params.get('id')]
    //});
  }

  goToPage(givenGroupName, givenGroupId, event) {
    
    this.groupOverviewService.chosenGroup = givenGroupName;
    localStorage.setItem('chosenGroup', this.groupOverviewService.chosenGroup)
    this.router.navigate(['/groups', givenGroupId])
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
              })
          })
    }
    
  }

  refresh() {
    this.configService.getConfigResponse()
  }

  reload() {
    window.location.reload();
  }

  deleteSingleEmptyGroup(groupName) {
    this.configService.deleteSingleEmptyGroup(groupName)
    .subscribe(nv => {
      window.location.reload();
    })
  }
}

 // if (group.group.name == this.groups[this.groups.length - 1].group.name) {
          //   this.configService.deleteGroupInfos(group.group.name).subscribe(nv => 
          //     {
          //       this.configService.deleteEmptyGroups(group.group.name, this.groups[this.groups.length - 1].group.name).subscribe(nv => 
          //         {
          //           window.location.reload()
          //         })
          //     })
          // } else { 
          //   try {
          //   this.configService.deleteGroupInfos(group.group.name).subscribe(nv => 
          //     {
          //       this.configService.deleteEmptyGroups(group.group.name, this.groups[this.groups.length - 1].group.name).subscribe()
          // })
          //   }
          //  catch {
          //   return
          // }

        //}