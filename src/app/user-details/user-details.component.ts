import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { users } from '../users';
import { UserPageService } from '../user-page/user-page.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent implements OnInit {
  user;

  constructor(
    private route: ActivatedRoute,
    private userPageService: UserPageService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.user = users[+params.get('userId')];
    });
  }

  addToItems(user) {
    this.userPageService.addToItems(user);
    window.alert('Your user has been added to the items!');
  }

  getItems() {
    console.log(this.userPageService.items)
  }
}
