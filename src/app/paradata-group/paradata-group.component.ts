import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service'

@Component({
  selector: 'app-paradata-group',
  templateUrl: './paradata-group.component.html',
  styleUrls: ['./paradata-group.component.css']
})
export class ParadataGroupComponent implements OnInit {
  paradata;
  chosenGroup = localStorage.getItem('chosenGroup')
  constructor(
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.getAmountOfReceipts()
  }

  getAmountOfReceipts() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.paradata = data;
      this.paradata = this.paradata.receiptsPerDays
      console.log(this.paradata)
    })
  }
}
