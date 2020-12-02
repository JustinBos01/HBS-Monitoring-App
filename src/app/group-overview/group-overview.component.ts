import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { FormBuilder, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from '../group-page/group-page.service';
import { GroupOverviewService } from './group-overview.service'
import { Router } from '@angular/router';


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
  constructor(
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
}
