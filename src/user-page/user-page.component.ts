import { Component, OnInit } from '@angular/core';
import { users } from '/HBS-App/src/app/users';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent{
  users = users;
  add() {
    window.alert('The user has been added')
  }
}
