import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Users {
  id: number;
  groupId: number;
  name: string;
  password: string;
  syncOrder: number;
}

export interface Group {
  id: number;
  name: string;
  status: string;
}

export interface GroupInfos {
  Id: number;  
	Group_Id: number;
	Key: string;
	Value: string;
}

export interface GroupData {
  group: Group;
  groupInfos: GroupInfos[];
}



@Injectable()
export class ConfigService {
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

  getGroups(): Observable<GroupData[]> {
    var configUrl = 'http://localhost:4200/budget/group/list';
    return this.http.post<GroupData[]>(
      configUrl, {
        "superuser" : {"name" : "su0", "password" : "su0p"}
       });
  }
}
//