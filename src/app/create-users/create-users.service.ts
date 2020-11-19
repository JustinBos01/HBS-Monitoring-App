import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreateUsersService {
  userString = [{name: '',
                password: ''}];
  constructor() { }
}
