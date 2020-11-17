import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit {
  user;
  group;
  groupData;
  createGroupForm;
  superuserName;
  superuserPassword;
  groupName;
  key;
  value;
  constructor(
    public configService: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { 
    this.createGroupForm = this.formBuilder.group({
      superuserName: '',
      superuserPassword: '',
      groupName: '',
      key: '',
      value: ''
  });}

  ngOnInit(): void {
    
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
    .subscribe(users => {
        this.user = users;
        console.log(this.user)
    })
      
    console.log(this.user)
    this.route.paramMap.subscribe(params => {
      this.user = this.configService.getUsersOfGroup(this.configService.chosenGroup)[+params.get('id')]
    });
  }

  createGroup() {
    this.configService.createGroup(this.superuserName, this.superuserPassword, this.groupName, this.key, this.value)
      .subscribe(groupdata => {
        this.groupData = groupdata;
        console.log(this.groupData);
      })
    }
}
