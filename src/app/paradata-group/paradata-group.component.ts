import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { filter } from 'rxjs/operators';
import { Router } from '@angular/router';


@Component({
  selector: 'app-paradata-group',
  templateUrl: './paradata-group.component.html',
  styleUrls: ['./paradata-group.component.css']
})

export class ParadataGroupComponent implements OnInit {
  paradata;
  phoneParadata;
  activityParadata;
  receiptParadataColumns: string[] = ['userName', 'date', 'receipts'];
  phoneParadataColumns: string[] = ['userName', 'phoneName', 'phoneType', 'phoneManufacturer', 'phoneModel', 'receipts', 'products', 'photos'];
  activityParadataColumns: string[] = ['date', 'time', 'userName', 'objectName', 'action'];
  chosenGroup = localStorage.getItem('chosenGroup');
  receiptDataSource;
  phoneDataSource;
  activityDataSource;
  dataSource;
  filteredReceiptData = [];
  filteredPhoneData = [];
  filteredActivityData = [];
  availableFilters = [];
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public configService: ConfigService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getAmountOfReceipts()
    this.getPhoneParadata()
    this.getActivityParadata()
    
  }

  //set paradata tables
  valuechange(selectedTable) {
    this.availableFilters = [];
    if (selectedTable == "") {
      this.availableFilters.push('');
    }
    
    if (selectedTable == 'Receipts') {
      this.getAmountOfReceipts()
      this.availableFilters.push('Username')
    }

    if (selectedTable == 'Phones') {
      this.getPhoneParadata()
      this.availableFilters.push("Username", "Phone Types", "Phone Manufacturers", "Phone Models")
    }

    if (selectedTable == 'Activities') {
      this.getActivityParadata()
      this.availableFilters.push("Username", "Page", "Action")
    }
  }

  //get all receipt paradata
  getAmountOfReceipts() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.paradata = data;
      this.paradata = this.paradata.receiptsPerDays;
      this.receiptDataSource = new MatTableDataSource(this.paradata);
      this.receiptDataSource.sort = this.sort;
      this.receiptDataSource.paginator = this.paginator;
    })
  }

  //get all phone paradata
  getPhoneParadata() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneParadata = data;
      this.phoneParadata = this.phoneParadata.receiptsPerPhones;
      this.phoneDataSource = new MatTableDataSource(this.phoneParadata);
      this.phoneDataSource.sort = this.sort;
      this.phoneDataSource.paginator = this.paginator;
    })
  }

  //get all event paradata
  getActivityParadata() {
    this.configService.getActivityParadata().subscribe(data => {
      this.activityParadata = data;
      this.activityParadata = this.activityParadata.paradataDateTimes;
      this.activityDataSource = new MatTableDataSource(this.activityParadata);
      this.activityDataSource.sort = this.sort;
      this.activityDataSource.paginator = this.paginator;
    })
  }

  //filter values, depends on selected paradata table
  filterChange(selectedTable, filterValue) {
    this.filteredReceiptData.length = 0;
    this.receiptDataSource = [];
    this.filteredPhoneData.length = 0;
    this.phoneDataSource = [];
    this.receiptDataSource = [];
    this.filteredActivityData.length = 0;
    this.activityDataSource = [];
    var filterNoRadio = <HTMLInputElement>document.getElementById("noneFilterRadio")
    
    if (selectedTable == 'Receipts') {
      if (filterValue != '') {
        this.configService.getAmountOfReceipts().subscribe(data => {
          this.paradata = data;
          this.paradata = this.paradata.receiptsPerDays;
          var filterUsernameCbxValueReceipts = <HTMLInputElement>document.getElementById('filterCbxUsername')
          for (let element of this.paradata){
            if (filterUsernameCbxValueReceipts.checked) {
              if (element.userName.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredReceiptData.includes(element) == false){
                  this.filteredReceiptData.push(element)
                }
              }
            }
          }
          this.receiptDataSource = this.filteredReceiptData
        })
      } else {
        this.getAmountOfReceipts()
      }
      this.receiptDataSource.sort = this.sort;
      this.receiptDataSource.paginator = this.paginator;
    }

    if (selectedTable == 'Phones') {
      if (filterValue != '') {
        this.configService.getPhoneParadata().subscribe(data => {
          this.phoneParadata = data;
          this.phoneParadata = this.phoneParadata.receiptsPerPhones;
          var filterUsernameCbxValuePhones = <HTMLInputElement>document.getElementById("filterCbxUsername")
          var filterPhoneTypesCbxValue = <HTMLInputElement>document.getElementById("filterCbxPhone Types")
          var filterPhoneManufacturersCbxValue = <HTMLInputElement>document.getElementById("filterCbxPhone Manufacturers")
          var filterPhoneModelssCbxValue = <HTMLInputElement>document.getElementById("filterCbxPhone Models")
          var filterUsernameRadioCbxValuePhones = <HTMLInputElement>document.getElementById("onlyFilterUsernameRadio")
          var filterPhoneTypesRadioCbxValue = <HTMLInputElement>document.getElementById("onlyFilterPhone TypesRadio")
          var filterPhoneManufacturersRadioCbxValue = <HTMLInputElement>document.getElementById("onlyFilterPhone ManufacturersRadio")
          var filterPhoneModelssRadioCbxValue = <HTMLInputElement>document.getElementById("onlyFilterPhone ModelsRadio")
          
          
          for (let element of this.phoneParadata){
            if ((filterUsernameCbxValuePhones.checked || filterUsernameRadioCbxValuePhones.checked) && filterPhoneTypesRadioCbxValue.checked == false && filterPhoneManufacturersRadioCbxValue.checked == false && filterPhoneModelssRadioCbxValue.checked == false) {
              if (element.userName.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredPhoneData.includes(element) == false){
                  this.filteredPhoneData.push(element)
                }
              }
            }
            
            if ((filterPhoneTypesCbxValue.checked || filterPhoneTypesRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterPhoneManufacturersRadioCbxValue.checked == false && filterPhoneModelssRadioCbxValue.checked == false) {
              if (element.phoneType.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredPhoneData.includes(element) == false){
                  this.filteredPhoneData.push(element)
                }
              }
            }

            if ((filterPhoneManufacturersCbxValue.checked || filterPhoneManufacturersRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterPhoneTypesRadioCbxValue.checked == false && filterPhoneModelssRadioCbxValue.checked == false) {
              if (element.phoneManufacturer.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredPhoneData.includes(element) == false){
                  this.filteredPhoneData.push(element)
                }
              }
            }

            if ((filterPhoneModelssCbxValue.checked || filterPhoneModelssRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterPhoneTypesRadioCbxValue.checked == false && filterPhoneManufacturersRadioCbxValue.checked == false) {
              if (element.phoneModel.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredPhoneData.includes(element) == false){
                  this.filteredPhoneData.push(element)
                }
              }
            }
          }
          this.phoneDataSource = this.filteredPhoneData
        })
      } else {
        this.getPhoneParadata()
      }
    }

    if (selectedTable == 'Activities') {
      if (filterValue != '') {
        this.configService.getActivityParadata().subscribe(data => {
          this.activityParadata = data;
          this.activityParadata = this.activityParadata.paradataDateTimes;
          var filterUsernameCbxValuePhones = <HTMLInputElement>document.getElementById('filterCbxUsername')
          var filterPageCbxValue = <HTMLInputElement>document.getElementById('filterCbxPage')
          var filterActionCbxValue = <HTMLInputElement>document.getElementById('filterCbxAction')
          var filterUsernameRadioCbxValuePhones = <HTMLInputElement>document.getElementById('onlyFilterUsernameRadio')
          var filterPageRadioCbxValue = <HTMLInputElement>document.getElementById('onlyFilterPageRadio')
          var filterActionRadioCbxValue = <HTMLInputElement>document.getElementById('onlyFilterActionRadio')
          
          for (let element of this.activityParadata){
            if ((filterUsernameCbxValuePhones.checked || filterUsernameRadioCbxValuePhones.checked) && filterPageRadioCbxValue.checked == false && filterActionRadioCbxValue.checked == false) {
              if (element.userName.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredActivityData.includes(element) == false){
                  this.filteredActivityData.push(element)
                }
              }
            }

            if ((filterPageCbxValue.checked || filterPageRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterActionRadioCbxValue.checked == false) {
              if (element.objectName.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredActivityData.includes(element) == false){
                  this.filteredActivityData.push(element)
                }
              }
            }

            if ((filterActionCbxValue.checked || filterActionRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterPageRadioCbxValue.checked == false) {
              if (element.action.toLowerCase().includes(filterValue.toLowerCase())) {
                if (this.filteredActivityData.includes(element) == false){
                  this.filteredActivityData.push(element)
                }
              }
            }
          }
          this.activityDataSource = this.filteredActivityData
        })
      } else {
        this.getActivityParadata()
      }
    }
  }

  //go to graph page
  navigate() {
    this.router.navigate(['/graphs', localStorage.getItem('chosenGroupId')])
  }
}

