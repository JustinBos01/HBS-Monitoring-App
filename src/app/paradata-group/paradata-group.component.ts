import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigService } from '../config/config.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse} from '@angular/common/http';
import { ExportToCsv } from 'export-to-csv';
  


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
  phoneParadataColumns: string[] = ['userName', 'phoneType', 'phoneManufacturer', 'phoneModel', 'receipts', 'products', 'photos'];
  activityParadataColumns: string[] = ['date', 'time', 'userName', 'objectName', 'action'];
  clicksDataColumns: string[] = ['userName', 'action', 'objectName', 'clicks'];
  inactiveDataColumns: string[] = ['group', 'user', 'status'];
  statusColumns: string[] = ['userName', 'groupName', 'status']
  chosenGroup = localStorage.getItem('chosenGroup');
  statusDataSource;
  receiptDataSource;
  phoneDataSource;
  activityDataSource;
  inactiveDataSource;
  dataSource;
  filteredReceiptData = [];
  filteredPhoneData = [];
  filteredActivityData = [];
  filteredClicksData = [];
  availableFilters = [];
  quickActionStatus = false;
  clicksDataSource;
  inactiveUsersReceiptParadata = [];
  inactiveUsersPhoneParadata = [];
  inactiveUsersClickParadata = [];
  checkedUser = [];
  questionairePageCompleted = [
    {
      name: '',
      group: '',
      status: '',
    }
  ];
  completedUsers = [
    {
      name: '',
      group: '',
      status: '',
    }
  ];
  activeUsers = [
    {
      name: '',
      group: '',
      status: '',
    }
  ];
  activeUsersActivityParadata = [];
  allUsers;
  allUserNames = [];
  showInactive = null;
  inactiveCollection = [{
      name: '',
      group: '',
      status: '',
  }]
  statusCollection = [{
    name: '',
    group: '',
    status: '',
}]
  options = { 
    fieldSeparator: ';',
    quoteStrings: '"',
    decimalSeparator: '',
    showLabels: true, 
    showTitle: true,
    title: 'Users Status',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
  };
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  constructor(
    public configService: ConfigService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    if (this.statusCollection.length != 0) {
      this.statusCollection.length = 0;
    }
    console.log(this.statusDataSource)
    this.getAllUsers();
    this.statusDataSource = new MatTableDataSource(this.statusCollection);
    this.statusDataSource.sort = this.sort;
    this.statusDataSource.paginator = this.paginator;
    this.showInactive = false;
  }

  getAllUsers() {
    this.configService.getUsersOfGroup(this.chosenGroup)
    .pipe(catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}.\n
        An error for filtering users has occurred`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
        An error for filtering users has occurred`;
      }
      window.alert(errorMessage);
      return throwError(error)
    }))
    .subscribe(users => {
        this.allUsers = users;
        for (let element of this.allUsers) {
          this.allUserNames.push(element.name)
        }
        this.getAmountOfReceipts(this.allUserNames);
        this.getPhoneParadata(this.allUserNames);
        this.getActivityParadata();
        this.getEventClicks(this.allUserNames);
        this.getInactiveData();
      }
    )
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
  getEventClicks(dataSource?) {
    this.configService.getParadataClick()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for the screen clicks has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for the screen clicks has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.inactiveUsersClickParadata.length = 0;
        this.clicksData = data;
        this.clicksData = this.clicksData.paradataClicks;
        this.clicksDataSource = new MatTableDataSource(this.clicksData);
        this.clicksDataSource.sort = this.sort;
        this.clicksDataSource.paginator = this.paginator;
        console.log(this.clicksData)

        if (this.questionairePageCompleted.length != 0) {
          this.questionairePageCompleted.length = 0
        }
        console.log(this.clicksData)
        for (let element of this.clicksData) {
          if (element.objectName.toLowerCase() == "startquestionnairepage" && this.questionairePageCompleted.includes(element.userName) == false) {
            this.statusCollection.push({
                name: element.userName,
                group: element.groupName,
                status: "questionaire finished or in progress",
            })
          }
        }

        if (dataSource != null) {
          for (let element of this.paradata) {
            if (dataSource.includes(element.userName)) {
              this.inactiveUsersClickParadata.push(element)
            }
          }
        }
        console.log(this.questionairePageCompleted)
        
      })
  }

  getAmountOfReceipts(dataSource?) {
    try {
      this.configService.getAmountOfReceipts()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for the amount of receipts has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for the amount of receipts has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.paradata = data;
        this.paradata = this.paradata.receiptsPerDays;
        this.receiptDataSource = new MatTableDataSource(this.paradata);
        this.receiptDataSource.sort = this.sort;
        this.receiptDataSource.paginator = this.paginator;

        if (this.completedUsers.length != 0) {
          this.completedUsers.length = 0;
        }
        
        this.paradata.push({'date': 9,
                          'groupName': "Justin's groepje2",
                          'receipts': 3,
                          'userName': "N/A"})
        for (let dataset of this.paradata) {
          
          dataset.date = String(dataset.date)
          if (8 > dataset.date && dataset.date > 2) {
            dataset.date = "+2 days ago"
          } else if (dataset.date >= 8) {
            dataset.date = "7+ days ago (inactive?)"
          }
          if (this.checkedUser.includes(dataset.userName) == false) {
            localStorage.setItem('currentUser', dataset.userName)
            var completedCheck = this.paradata.filter(this.completedFilter)
            this.checkedUser.push(dataset.userName)
            if (completedCheck.length >= 7) {
              this.statusCollection.push(
                {
                  name: dataset.userName,
                  group: dataset.groupName,
                  status: 'Completed',
                }
              )
            }

            if (completedCheck.length > 0 && completedCheck < 7) {
              this.statusCollection.push(
                {
                  name: dataset.userName,
                  group: dataset.groupName,
                  status: 'Active',
                }
              )
            }
          }
        }

        if (dataSource != null) {
          this.inactiveUsersReceiptParadata.length = 0;
          for (let element of this.paradata) {
            if (dataSource.includes(element.userName)) {
              this.inactiveUsersReceiptParadata.push(element)
            }
          }
        }
      })
    }
    catch(error) {
      alert("No receipt data")
    }
  }

  //get all phone paradata
  getPhoneParadata(dataSource?) {
    this.configService.getPhoneParadata()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for phones has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for phones has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(
        data => {
          this.inactiveUsersPhoneParadata.length = 0;
          this.phoneParadata = data;
          this.phoneParadata = this.phoneParadata.receiptsPerPhones;
          this.phoneDataSource = new MatTableDataSource(this.phoneParadata);
          this.phoneDataSource.sort = this.sort;
          this.phoneDataSource.paginator = this.paginator;
          res => console.log('HTTP response', res);
          err => console.log('HTTP Error', err);
          if (dataSource != null) {
            for (let element of this.paradata) {
              if (dataSource.includes(element.userName)) {
                this.inactiveUsersPhoneParadata.push(element)
              }
            }
          }
      }
      )
  }

  //get all event paradata
  getActivityParadata(dataSource?) {
    this.configService.getActivityParadata()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for activities has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for activities has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.activeUsersActivityParadata.length = 0;
        this.activityParadata = data;
        this.activityParadata = this.activityParadata.paradataDateTimes;
        this.activityDataSource = new MatTableDataSource(this.activityParadata);
        this.activityDataSource.sort = this.sort;
        this.activityDataSource.paginator = this.paginator;
        if (dataSource != null) {
          for (let element of this.activityParadata) {
            if (dataSource.includes(element.userName)) {
              this.activeUsersActivityParadata.push(element)
            }
          }
        }
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
    this.clicksDataSource = [];
    var filterNoRadio = <HTMLInputElement>document.getElementById("noneFilterRadio")
    
    if (selectedTable == 'Receipts') {
      if (filterValue != '') {
        this.configService.getAmountOfReceipts()
          .pipe(catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            if (error.error instanceof ErrorEvent) {
              errorMessage = `Error: ${error.error.message}.\n
              An error for filtering the receipts has occurred`;
            } else {
              errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
              An error for filtering the receipts has occurred`;
            }
            window.alert(errorMessage);
            return throwError(error)
          }))
          .subscribe(data => {
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
        this.configService.getPhoneParadata()
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for filtering the phones has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for filtering the phones has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(data => {
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
          var noQuickActions = <HTMLInputElement>document.getElementById("noQuickActions")
          
          if (noQuickActions.checked) {
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
          }
        })
      } else {
        this.getPhoneParadata()
      }
    }

    if (selectedTable == 'Activities') {
      if (filterValue != '') {
        this.configService.getActivityParadata()
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for filtering the activities has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for filtering the activities has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(data => {
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
          this.configService.getParadataClick()
            .pipe(catchError((error: HttpErrorResponse) => {
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
                errorMessage = `Error: ${error.error.message}.\n
                An error for filtering the click activities has occurred`;
              } else {
                errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
                An error for filtering the click activities has occurred`;
              }
              window.alert(errorMessage);
              return throwError(error)
            }))
            .subscribe(data => {
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
              this.clicksDataSource = this.filteredClicksData
            })
        }
        catch(error) {
          alert("An error has occured")
        }
      } else {
        this.getEventClicks()
      }
    }
  }

  quickActions(status) {
    this.quickActionStatus = !status;
  }

  filterActiveUsersReceipts() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneParadata = data;
      this.phoneParadata = this.phoneParadata.receiptsPerPhones;
      this.phoneDataSource = this.phoneParadata.filter(this.activeUsersReceipts)
    })
  }

  filterActiveUsersPhotos() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneParadata = data;
      this.phoneParadata = this.phoneParadata.receiptsPerPhones;
      this.phoneDataSource = this.phoneParadata.filter(this.activeUsersPhotos)
    })
  }

  activeUsersReceipts(element) {
    var thres = <HTMLInputElement>document.getElementById('lowerThresReceipts')
    return element.receipts >= thres
  }

  activeUsersPhotos(element) {
    var thres = <HTMLInputElement>document.getElementById('lowerThresPhotos')
    return element.photos >= thres.value;
  }

  completedFilter(element) {
    return element.userName == localStorage.getItem("currentUser");
  }

  //go to graph page
  navigate() {
    this.router.navigate(['/graphs', localStorage.getItem('chosenGroupId')])
  }

  getInactiveData() {
    this.inactiveCollection.length =  0;
    for (let element of this.inactiveUsersReceiptParadata) {
      if (element.receipts == 0 || element.photos == 0) {
        this.statusCollection.push({
          name: element.userName, 
          group: String(this.chosenGroup), 
          status: "Inactive"})
      }
    }
    this.inactiveDataSource = new MatTableDataSource(this.inactiveCollection);
    this.inactiveDataSource.sort = this.sort;
    this.inactiveDataSource.paginator = this.paginator;
    this.showInactive = true;
  }

  exportStatus(collection, titleValue) {
    this.options.title = titleValue;
    const csvExporter = new ExportToCsv(this.options);
    csvExporter.generateCsv(collection);
  }
}

