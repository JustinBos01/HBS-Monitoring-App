import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service'

@Component({
  selector: 'app-paradata-group',
  templateUrl: './paradata-group.component.html',
  styleUrls: ['./paradata-group.component.css']
})
export class ParadataGroupComponent implements OnInit {
  paradata;
  phoneParadata;
  chosenGroup = localStorage.getItem('chosenGroup')
  constructor(
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.getAmountOfReceipts()
    this.getPhoneParadata()
  }

  getAmountOfReceipts() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.paradata = data;
      this.paradata = this.paradata.receiptsPerDays
      console.log(this.paradata)
    })
  }

  getPhoneParadata() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneParadata = data;
      this.phoneParadata = this.phoneParadata.receiptsPerPhones;
    })
  }
}
