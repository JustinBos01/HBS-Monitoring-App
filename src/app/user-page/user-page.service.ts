import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class UserPageService {
  items = []

  addToItems(user){
    this.items.push(user);
  }

  getItems() {
    return this.items;
  }

  clearItems() {
    this.items = [];
    return this.items;
  }
}