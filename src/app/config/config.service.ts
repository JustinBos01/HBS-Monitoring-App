import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { LoginPageService } from '../login-page/login-page.service'
import { CreateUsersService } from '../create-users/create-users.service'
import { GroupPageService } from '../group-page/group-page.service'

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
  placeholderVar;
  chosenGroup;
  JsonString;
  chosenGroupInfos = [{key: '',
                       value: ''}]
  groupInfosValues = [{key: '',
                       value: ''}]
    
  constructor(
    private http: HttpClient,
    private createUsersService: CreateUsersService,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService) { 
      
    }
  
  
  getConfig() {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.get<Users[]>(configUrl);
  }

  getConfigResponse(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {"name": localStorage.getItem('superUserData.name'), group: {name: "Justin's groepje"}}});
  }

  getSuperUsers(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    return this.http.post<Users[]>(
      configUrl, { superuser: {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')}, group: {name: "superuser"}});
  }

  getGroups(): Observable<GroupData[]> {
    var configUrl = 'http://localhost:4200/budget/group/list';
    return this.http.post<GroupData[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')}
       });
  }

  getUsersOfGroup(senderGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/list';
    this.chosenGroup = senderGroup;
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : senderGroup}
       });
  }

  createGroup(groupname, key, value): Observable<GroupBody[]> {
    var configUrl = 'http://localhost:4200/budget/group/create';
    console.log(key, value)
    if ((key == null || key == '') && (value == null || value == '')){
      this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group": {"name" : groupname},
      "groupInfos"  : []
     }} else {
       this.JsonString = {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : groupname},
        "groupInfos"  : [ {"key" : key, "value" : value}]
       }
     }
    return this.http.post<GroupBody[]>(
      configUrl, this.JsonString);
  }

  changeGroupInfos(groupname): Observable<GroupInfos[]> {
    var configUrl = 'http://localhost:4200/budget/group/infos';
    this.JsonString = {
      "superuser"   : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"       : {"name" : groupname}, 
      "groupInfos"  : this.groupPageService.groupInfosString
     }

    console.log(this.JsonString)
    return this.http.post<GroupInfos[]>(
      configUrl, this.JsonString);
  }

  enableGroup(groupname): Observable<Group> {
    var configUrl = 'http://localhost:4200/budget/group/enable';
    
    return this.http.post<Group>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group"     : {"name" : groupname}
       });
  }

  disableGroup(groupname): Observable<Group[]> {
    var configUrl = 'http://localhost:4200/budget/group/disable';
    return this.http.post<Group[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group"     : {"name" : groupname}
       });
  }

  createMultipleUsers(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/create';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : localStorage.getItem('chosenGroup')},
      "users"     : this.createUsersService.userString
     }
     console.log(this.JsonString.group)
    return this.http.post<Users[]>(
      configUrl, this.JsonString);
  }

  createSuperUser(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/create';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : "superuser"},
      "users"     : this.createUsersService.userString
     }
    console.log(this.JsonString)
    return this.http.post<Users[]>(
    configUrl, this.JsonString);
  }

  changePassword(correspondingUser, newPassword): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/passwords';
    console.log(newPassword)
    console.log(correspondingUser)
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "users"     : [ {"name" : correspondingUser, "password" : newPassword} ]
     }
    
     return this.http.post<Users[]>(
      configUrl, this.JsonString);
  }

  regroupUsers(correspondingUser, newGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/regroupusers';
    console.log(newGroup)
    console.log(correspondingUser)
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "regroup"   : {"name" : newGroup},
      "users"     : [ {"name" : correspondingUser} ]
    }
    
    return this.http.post<Users[]>(configUrl, this.JsonString);
  }

  regroupGroup(groupName, newGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/regroupgroup';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : groupName},
      "regroup"   : {"name" : newGroup}
     }
    return this.http.post<Users[]>(configUrl, this.JsonString);
  }

  renameGroup(groupName, newName): Observable<Group[]> {
    var configUrl = 'http://localhost:4200/budget/group/rename';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : groupName},
      "regroup"   : {"name" : newName}
     }
     
    return this.http.post<Group[]>(configUrl, this.JsonString);
  }

  deleteEmptyGroups(groupName): Observable<Group[]> {
    //this.deleteGroupInfos(groupName).subscribe()
    console.log(localStorage.getItem('superUserData.name'))
    console.log(localStorage.getItem('superUserData.password'))
    var configUrl = 'http://localhost:4200/budget/group/delete';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : groupName}
     }
     
    return this.http.post<Group[]>(configUrl, this.JsonString);
  }

  deleteSingleEmptyGroup(groupName): Observable<Group[]> {
    var configUrl = 'http://localhost:4200/budget/group/delete';
    
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : groupName}
     }
     //console.log(groupName +'has been deleted')  
    return this.http.post<Group[]>(configUrl, this.JsonString);
  }

  deleteGroupInfos(groupName): Observable<Group[]> {
                
    var configUrl = 'http://localhost:4200/budget/group/infos';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : groupName},
      "infos"     : [ ]
     }
     
    return this.http.post<Group[]>(configUrl, this.JsonString);
  }
}