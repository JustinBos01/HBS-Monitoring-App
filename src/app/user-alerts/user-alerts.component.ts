import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-alerts',
  templateUrl: './user-alerts.component.html',
  styleUrls: ['./user-alerts.component.css']
})
export class UserAlertsComponent implements OnInit {
  @Input() user;
  @Output() notify = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
