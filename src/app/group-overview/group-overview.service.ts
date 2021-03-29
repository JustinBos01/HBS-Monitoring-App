import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import {GroupOverviewComponent, CreateGroupDialogComponent} from '../group-overview/group-overview.component';

@Injectable({
  providedIn: 'root'
})

export class GroupOverviewService {
  chosenGroup;
  groups;
  emptyGroups;
  constructor(
    public configService: ConfigService,
  ) { }

  showGroupResponse() {
    this.configService.getGroups()
      .subscribe(groups => {
        this.groups = groups;
        return this.groups
      })
    }

  //delete all empty groups
  deleteGroups() {
    //get all empty groups
    for (let group of this.groups) {
      if (group.group.users == 0) {
        this.emptyGroups.push(group.group.name)
      } 
    }

    //empty groupinfos for groups with no users
    for (let empty of this.emptyGroups){
      this.configService.deleteGroupInfos(empty)
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for deleting a group's has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for deleting a group's settings has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(nv => 
          {
            //delete empty groups
            this.configService.deleteEmptyGroups(empty)
              .pipe(catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                  errorMessage = `Error: ${error.error.message}.\n
                  An error for deleting a group has occurred`;
                } else {
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
                  An error for deleting a group has occurred`;
                }
                window.alert(errorMessage);
                return throwError(error)
              }))
              .subscribe(nv =>
                {
                  if (empty == this.emptyGroups[this.emptyGroups.length - 1]){
                    //refresh data
                    this.showGroupResponse()
                  }
                }
              )
          }
        )
    }
  }
}
