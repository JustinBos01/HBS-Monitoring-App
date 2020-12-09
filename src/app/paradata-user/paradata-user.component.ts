import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service'

@Component({
  selector: 'app-paradata-user',
  templateUrl: './paradata-user.component.html',
  styleUrls: ['./paradata-user.component.css']
})
export class ParadataUserComponent implements OnInit {
  data;
  paradata = [{ groupName: '',
                userName: '',
                date: '',
                receipts: ''}];

  phoneData;
  phoneParadata = [{  groupName: '',
                      userName: '',
                      phoneName: '',
                      phoneType: '',
                      phoneManufacturer: '',
                      phoneModel: '',
                      syncOrder: 0,
                      receipts: 0,
                      products: 0,
                      photos: 0}];
  chosenGroup = localStorage.getItem('chosenGroup')
  chosenUser = localStorage.getItem('chosenUser')
  constructor(
    public configService: ConfigService
  ) { }

  ngOnInit(): void {
    this.getAmountOfReceipts()
    this.getPhoneParadata()
  }

  getAmountOfReceipts() {
    this.paradata.length = 0;
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.data = data;
      this.data = this.data.receiptsPerDays
      for (let currentParadata of this.data){
        if (currentParadata.userName == localStorage.getItem('chosenUser')){
          this.paradata.push(currentParadata);
        }
      }
      console.log(this.paradata);
      
    })
  }

  getPhoneParadata() {
    this.phoneParadata.length = 0;
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneData = data;
      this.phoneData = this.phoneData.receiptsPerPhones;
      console.log(this.phoneData)
      for (let currentPhoneData of this.phoneData){
        if (currentPhoneData.userName == localStorage.getItem('chosenUser')){
          this.phoneParadata.push(currentPhoneData);
        }
      }
      
      
    })
  }
}
