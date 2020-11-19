import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginPageService } from '../login-page/login-page.service'
import { CreateUsersService } from '../create-users/create-users.service'

export class Users {
  id: number;
  groupId: number;
  name: string;
  password: string;
  syncOrder: number;
}

export class Group {
  id: number;
  name: string;
  status: string;
}

export class GroupInfos {
  id: number;  
	groupId: number;
	key: string;
	value: string;
}

export class GroupData {
  group: Group;
  groupInfos: GroupInfos[];
}

export class GroupBody {
	Superuser: Users;
	Group: Group;
	Group_Infos: GroupInfos[];
}

@Injectable()
export class ConfigService {
  items = [];
  user = Users;
  group = Group;
  groupInfo = GroupInfos;
  groupData = GroupData;
  chosenGroup;
  JsonString;

  constructor(
    private http: HttpClient,
    private createUsersService: CreateUsersService,
    private loginPageService: LoginPageService) { }
  

  getConfig() {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.get<Users[]>(configUrl);
  }

  getConfigResponse(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {"name": this.loginPageService.superUserData.name, "password": this.loginPageService.superUserData.password}, group: {name: "Justin's groepje"}});
  }

  getSuperUsers(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {"name" : this.loginPageService.superUserData.name, "password" : this.loginPageService.superUserData.password}, group: {name: "superuser"}});
  }

  getGroups(): Observable<GroupData[]> {
    var configUrl = 'http://localhost:4200/budget/group/list';
    return this.http.post<GroupData[]>(
      configUrl, {
        "superuser" : {"name" : this.loginPageService.superUserData.name, "password" : this.loginPageService.superUserData.password}
       });
  }

  getUsersOfGroup(senderGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    this.chosenGroup = senderGroup;
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : this.loginPageService.superUserData.name, "password" : this.loginPageService.superUserData.password},
        "group": {"name" : senderGroup}
       });
  }

  createGroup(groupname, key, value): Observable<GroupBody[]> {
    var configUrl = 'http://localhost:4200/budget/group/create';
    
    return this.http.post<GroupBody[]>(
      configUrl, {
        "superuser" : {"name" : this.loginPageService.superUserData.name, "password" : this.loginPageService.superUserData.password},
        "group": {"name" : groupname},
        "groupInfos"  : [ {"key" : key, "value" : value}]
       });
  }

  createMultipleUsers(groupname): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/create';
    this.JsonString = {
      "superuser" : {"name" : this.loginPageService.superUserData.name, "password" : this.loginPageService.superUserData.password},
      "group"     : {"name" : groupname},
      "users"     :
        this.createUsersService.userString
      
     }
     console.log(this.JsonString.group, this.JsonString.superuser, this.JsonString.users)
    return this.http.post<Users[]>(
      configUrl, this.JsonString);
  } 
}
//