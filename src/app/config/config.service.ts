import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

export interface Config {
  id: number;
  groupId: number;
  name: string;
  password: string;
  syncOrder: number;
}

@Injectable()
export class ConfigService {
  constructor(private http: HttpClient) { }
  configUrl = 'https://budgetonderzoek.test.cbs.nl/budget/users/list';

  getConfig() {
    return this.http.get<Config[]>(this.configUrl);
  }

  getConfigResponse(): Observable<Config[]> {
    return this.http.post<Config[]>(
      this.configUrl, { superuser: {name: "justin", password: "1jus.tin1"}, group: {name: "Justin's groepje"}});
  }
}
//