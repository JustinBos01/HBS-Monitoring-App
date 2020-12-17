import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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

export class ParadataGroupComponent implements AfterViewInit, OnInit {
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
  availableFilters = '';
  
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

  ngAfterViewInit(): void {
  }

  valuechange(selectedTable) {
    if (selectedTable == "") {
      this.availableFilters = '';
    }
    
    if (selectedTable == 'Receipts') {
      this.getAmountOfReceipts()
      this.availableFilters = 'Username'
    }

    if (selectedTable == 'Phones') {
      this.getPhoneParadata()
      this.availableFilters = 'Username, Phone Types, Phone Manufacturers, Phone Models'
    }

    if (selectedTable == 'Activities') {
      this.getActivityParadata()
      this.availableFilters = 'Username, Page, Action'
    }
  }

  getAmountOfReceipts() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.paradata = data;
      this.paradata = this.paradata.receiptsPerDays;
      this.receiptDataSource = new MatTableDataSource(this.paradata);
      this.receiptDataSource.sort = this.sort;
      this.receiptDataSource.paginator = this.paginator;
      
    })
  }

  getPhoneParadata() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneParadata = data;
      this.phoneParadata = this.phoneParadata.receiptsPerPhones;
      this.phoneDataSource = new MatTableDataSource(this.phoneParadata);
      this.phoneDataSource.sort = this.sort;
      this.phoneDataSource.paginator = this.paginator;
    })
  }

  getActivityParadata() {
    this.configService.getActivityParadata().subscribe(data => {
      this.activityParadata = data;
      this.activityParadata = this.activityParadata.paradataDateTimes;
      this.activityDataSource = new MatTableDataSource(this.activityParadata);
      this.activityDataSource.sort = this.sort;
      this.activityDataSource.paginator = this.paginator;
    })
  }

  filterChange(selectedTable, filterValue) {
    this.filteredReceiptData.length = 0
    this.receiptDataSource = []
    this.filteredPhoneData.length = 0
    this.phoneDataSource = []
    this.receiptDataSource = []
    this.filteredActivityData.length = 0
    this.activityDataSource = []
    
    if (selectedTable == 'Receipts') {
      if (filterValue != '') {
        this.configService.getAmountOfReceipts().subscribe(data => {
          this.paradata = data;
          this.paradata = this.paradata.receiptsPerDays;
          for (let element of this.paradata){
            if (element.userName.toLowerCase().includes(filterValue.toLowerCase())){
              this.filteredReceiptData.push(element)
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
          
          for (let element of this.phoneParadata){
            if (element.userName.toLowerCase().includes(filterValue.toLowerCase()) || element.phoneType.toLowerCase().includes(filterValue.toLowerCase()) || element.phoneManufacturer.toLowerCase().includes(filterValue.toLowerCase()) || element.phoneModel.toLowerCase().includes(filterValue.toLowerCase())){
              this.filteredPhoneData.push(element)
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
          
          for (let element of this.activityParadata){
            if (element.userName.toLowerCase().includes(filterValue.toLowerCase()) || element.objectName.toLowerCase().includes(filterValue.toLowerCase()) || element.action.toLowerCase().includes(filterValue.toLowerCase())){
              this.filteredActivityData.push(element)
            }
          }
          this.activityDataSource = this.filteredActivityData
        })
      } else {
        this.getActivityParadata()
      }
    }
    
  }

  navigate() {
    console.log(localStorage.getItem("chosenGroupId"))
    this.router.navigate(['/graphs', localStorage.getItem('chosenGroupId')])
  }
}

