import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-group-alerts',
  templateUrl: './group-alerts.component.html',
  styleUrls: ['./group-alerts.component.css']
})
export class GroupAlertsComponent implements OnInit {

  @Input() user;
  @Output() notify = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }

}
