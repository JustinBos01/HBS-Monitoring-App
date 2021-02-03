import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { catchError, filter } from 'rxjs/operators';
import { Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-paradata-group',
  templateUrl: './paradata-group.component.html',
  styleUrls: ['./paradata-group.component.css']
})

export class ParadataGroupComponent implements OnInit {
  paradata;
  phoneParadata;
  activityParadata;
  clicksData;
  receiptParadataColumns: string[] = ['userName', 'date', 'receipts'];
  phoneParadataColumns: string[] = ['userName', 'phoneName', 'phoneType', 'phoneManufacturer', 'phoneModel', 'receipts', 'products', 'photos'];
  activityParadataColumns: string[] = ['date', 'time', 'userName', 'objectName', 'action'];
  clicksDataColumns: string[] = ['userName', 'action', 'objectName', 'clicks'];
  chosenGroup = localStorage.getItem('chosenGroup');
  receiptDataSource;
  phoneDataSource;
  activityDataSource;
  dataSource;
  filteredReceiptData = [];
  filteredPhoneData = [];
  filteredActivityData = [];
  filteredClicksData = [];
  availableFilters = [];
  
  clicksDataScource;
  
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
    this.getEventClicks()
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

    if (selectedTable == 'Clicks') {
      this.getEventClicks()
      this.availableFilters.push('Username', 'Action', 'Page')
    }
  }

  //get all receipt paradata
  getEventClicks() {
    this.configService.getParadataClick().subscribe(data => {
      this.clicksData = data;
      this.clicksData = this.clicksData.paradataClicks;
      this.clicksDataScource = new MatTableDataSource(this.clicksData);
      this.clicksDataScource.sort = this.sort;
      this.clicksDataScource.paginator = this.paginator;
    })
  }

  getAmountOfReceipts() {
    try {
      this.configService.getAmountOfReceipts().subscribe(data => {
        this.paradata = data;
        this.paradata = this.paradata.receiptsPerDays;
        this.receiptDataSource = new MatTableDataSource(this.paradata);
        this.receiptDataSource.sort = this.sort;
        this.receiptDataSource.paginator = this.paginator;
      })
    }
    catch(error) {
      alert("No receipt data")
    }
  }

  //get all phone paradata
  getPhoneParadata() {
    this.configService.getPhoneParadata()
      .pipe(
        catchError(err => {
          alert('No phone data available')
          console.log('No phone data available')
          return err;
        })
      )

      .subscribe(
        data => {
          this.phoneParadata = data;
          this.phoneParadata = this.phoneParadata.receiptsPerPhones;
          this.phoneDataSource = new MatTableDataSource(this.phoneParadata);
          this.phoneDataSource.sort = this.sort;
          this.phoneDataSource.paginator = this.paginator;
          res => console.log('HTTP response', res);
          err => console.log('HTTP Error', err);
          () => console.log('test')
      }
      )
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
    this.filteredActivityData.length = 0;
    this.activityDataSource = [];
    this.filteredClicksData.length = 0;
    this.clicksDataScource = [];
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

    if (selectedTable == 'Clicks') {
      if (filterValue != '') {
        try {
          this.configService.getParadataClick().subscribe(data => {
            this.clicksData = data;
            this.clicksData = this.clicksData.paradataClicks;
            
            var filterUsernameCbxValuePhones = <HTMLInputElement>document.getElementById('filterCbxUsername')
            var filterActionCbxValue = <HTMLInputElement>document.getElementById('filterCbxAction')
            var filterPageCbxValue = <HTMLInputElement>document.getElementById('filterCbxPage')
            var filterUsernameRadioCbxValuePhones = <HTMLInputElement>document.getElementById('onlyFilterUsernameRadio')
            var filterActionRadioCbxValue = <HTMLInputElement>document.getElementById('onlyFilterActionRadio')
            var filterPageRadioCbxValue = <HTMLInputElement>document.getElementById('onlyFilterPageRadio')
            
            
            for (let element of this.clicksData){
              if ((filterUsernameCbxValuePhones.checked || filterUsernameRadioCbxValuePhones.checked) && filterPageRadioCbxValue.checked == false && filterActionRadioCbxValue.checked == false) {
                if (element.userName.toLowerCase().includes(filterValue.toLowerCase())) {
                  if (this.filteredClicksData.includes(element) == false){
                    this.filteredClicksData.push(element)
                  }
                }
              }

              if ((filterPageCbxValue.checked || filterPageRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterActionRadioCbxValue.checked == false) {
                if (element.objectName.toLowerCase().includes(filterValue.toLowerCase())) {
                  if (this.filteredClicksData.includes(element) == false){
                    this.filteredClicksData.push(element)
                  }
                }
              }

              if ((filterActionCbxValue.checked || filterActionRadioCbxValue.checked) && filterUsernameRadioCbxValuePhones.checked == false && filterPageRadioCbxValue.checked == false) {
                if (element.action.toLowerCase().includes(filterValue.toLowerCase())) {
                  if (this.filteredClicksData.includes(element) == false){
                    this.filteredClicksData.push(element)
                  }
                }
              }
            }
            this.clicksData = this.filteredClicksData
            this.clicksDataScource = this.filteredClicksData
          })
        }
        catch(error) {
          alert("An error has occured")
        }
      } else {
        console.log( 'werkt niet')
        this.getEventClicks()
      }
    }
  }

  //go to graph page
  navigate() {
    this.router.navigate(['/graphs', localStorage.getItem('chosenGroupId')])
  }
}

