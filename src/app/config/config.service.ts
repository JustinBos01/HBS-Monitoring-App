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
  
  //get all data functions
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

  getAllUsers(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/listall';
    return this.http.post<Users[]>(
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

  duplicateGroup(JsonString): Observable<GroupBody[]> {
    var configUrl = 'http://localhost:4200/budget/group/create';
    return this.http.post<GroupBody[]>(
      configUrl, JsonString);
  }

  changeGroupInfos(): Observable<GroupInfos[]> {
    var configUrl = 'http://localhost:4200/budget/group/infos';
    this.JsonString = {
      "superuser"   : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"       : {"name" : localStorage.getItem('chosenGroup')}, 
      "groupInfos"  : this.groupPageService.groupInfosString
     }
    return this.http.post<GroupInfos[]>(
      configUrl, this.JsonString);
  }

  enableGroup(): Observable<Group> {
    var configUrl = 'http://localhost:4200/budget/group/enable';
    
    return this.http.post<Group>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group"     : {"name" : localStorage.getItem('chosenGroup')}
       });
  }

  disableGroup(): Observable<Group[]> {
    var configUrl = 'http://localhost:4200/budget/group/disable';
    return this.http.post<Group[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group"     : {"name" : localStorage.getItem('chosenGroup')}
       });
  }

  createMultipleUsers(): Observable<Users[]> {
    console.log(this.createUsersService.userString)
    var configUrl = 'http://localhost:4200/budget/users/create';
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group"     : {"name" : localStorage.getItem('chosenGroup')},
      "users"     : this.createUsersService.userString
     }
     console.log(this.JsonString)
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
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "users"     : [ {"name" : correspondingUser, "password" : newPassword} ]
     }
    
     return this.http.post<Users[]>(
      configUrl, this.JsonString);
  }

  regroupUsers(correspondingUser, newGroup): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/users/regroupusers';
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

  getAmountOfReceipts(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/dashboard/receiptsperday';
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : localStorage.getItem('chosenGroup')}
       });
  } 

  getPhoneParadata(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/dashboard/receiptsperphone';
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : localStorage.getItem('chosenGroup')}
       });
  }

  getActivityParadata(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/dashboard/paradatadatetime';
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : localStorage.getItem('chosenGroup')}
       });
  }

  getUserActivityParadata(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/dashboard/paradatadatetime';
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group": {"name" : localStorage.getItem('chosenGroup')},
        "user": {"name" : localStorage.getItem('chosenUser')}
       });
  }

  getUserReceiptPhotos(): Observable<Users[]> {
    var configUrl = 'http://localhost:4200/budget/dashboard/userreceipts';
    return this.http.post<Users[]>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group" : {"name" : localStorage.getItem('chosenGroup')},
        "user" : {"name" : localStorage.getItem('chosenUser')}
       });
  }

  getReceiptsPerUser(): Observable<any> {
    var configUrl = 'http://localhost:4200/budget/dashboard/receiptsperuser';
    return this.http.post<any>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group" : {"name" : localStorage.getItem('chosenGroup')}
       });
  }

  getParadataScreenTime(): Observable<any> {
    var configUrl = 'http://localhost:4200/budget/dashboard/paradatascreentime';
    return this.http.post<any>(
      configUrl, {
        "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
        "group" : {"name" : localStorage.getItem('chosenGroup')}
       });
  }
}