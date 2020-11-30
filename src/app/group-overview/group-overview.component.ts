import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from '../group-page/group-page.service';

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
  users
  constructor(
    public configService: ConfigService,
    private formBuilder: FormBuilder,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService,
  ) {
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      key: '',
      value: ''}) 
    
    this.tableForm = this.formBuilder.group({
      value: ''
    })}

  ngOnInit(): void {
    this.showGroupResponse()
  }

  createGroup(userData) {
    this.configService.createGroup(userData.groupName, userData.key, userData.value)
      .subscribe(groupdata => {
        this.groupData = groupdata;
        console.log(this.groupData);
      })
    this.createGroupForm.reset()
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
    .subscribe(user => {
      this.users = user;
      console.log(this.users);
    })
  }
}
