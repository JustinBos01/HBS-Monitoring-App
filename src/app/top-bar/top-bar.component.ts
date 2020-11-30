import { Component, OnInit } from '@angular/core';
import { TopBarService } from './top-bar.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor( public navigation: TopBarService ) { }

  ngOnInit(): void {
  }

}
