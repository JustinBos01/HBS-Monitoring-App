import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginPageService } from './login-page/login-page.service'

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
  constructor(private http: HttpClient) { }
  

  getConfig() {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.get<Users[]>(configUrl);
  }

  getConfigResponse(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {name: "justin", password: "1jus.tin1"}, group: {name: "Justin's groepje"}});
  }

  getSuperUsers(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {name: "justin", password: "1jus.tin1"}, group: {name: "superuser"}});
  }

  getGroups(): Observable<GroupData[]> {
    var configUrl = 'http://localhost:4200/budget/group/list';
    return this.http.post<GroupData[]>(
      configUrl, {
        "superuser" : {"name" : "su0", "password" : "su0p"}
       });
  }

  getUsersOfGroup(senderGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    this.chosenGroup = senderGroup;
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : "su0", "password" : "su0p"},
        "group": {"name" : senderGroup}
       });
  }

  createGroup(superuserName, superuserPassword, groupname, key, value): Observable<GroupBody[]> {
    var configUrl = 'http://localhost:4200/budget/group/create';
    
    return this.http.post<GroupBody[]>(
      configUrl, {
        "superuser" : {"name" : superuserName, "password" : superuserPassword},
        "group": {"name" : groupname},
        "groupInfos"  : [ {"key" : key, "value" : value}]
       });
  }

  

  
}
//