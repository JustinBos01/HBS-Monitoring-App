import { Component, OnInit } from '@angular/core';
import { users } from '../users';

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
  
  onNotify() {
    window.alert("You don't have a status");
  }
}
