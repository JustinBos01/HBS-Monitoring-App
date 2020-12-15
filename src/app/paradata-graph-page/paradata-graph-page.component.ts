import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service'

@Component({
  selector: 'app-paradata-graph-page',
  templateUrl: './paradata-graph-page.component.html',
  styleUrls: ['./paradata-graph-page.component.css']
})
export class ParadataGraphPageComponent implements OnInit {
  phoneData;
  activityData;
  receiptsData;

  constructor(
    public configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.getParadata()
  }

  getParadata() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.receiptsData = data;
    })

    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneData = data;
    })

    this.configService.getActivityParadata().subscribe(data => {
      this.activityData = data;
    })
  }


}
