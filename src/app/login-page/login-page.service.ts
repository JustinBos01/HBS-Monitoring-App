import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginPageService {
  superUserData;
  monitoring = true;
  caseManagement = false;
  role = '';
  constructor() { }
}