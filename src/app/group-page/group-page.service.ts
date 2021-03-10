import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service'
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupPageService {
  groupInfosString = [{key: '',
                       value: ''}]
  
}
