import { AfterViewInit, Component, OnInit, ɵɵqueryRefresh } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config/config.service';
import { FormBuilder } from '@angular/forms';
import { LoginPageService } from '../login-page/login-page.service';
import { GroupPageService } from './group-page.service';
import { GroupOverviewService } from '../group-overview/group-overview.service';
import { TopBarService } from '../top-bar/top-bar.service';
import { Router } from '@angular/router';
import { basename } from 'path';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip,  } from 'ng2-charts';
import { typeWithParameters } from '@angular/compiler/src/render3/util';


@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})

export class GroupPageComponent implements OnInit {
  name;
  role = localStorage.getItem('role');
  normalGrid = true;
  caseManagement = false;
  monitoring = false;
  createGroupForm;
  changeGroupInfosForm;
  newMadeGroupInfos;
  user;
  groups;
  chosenGroup = localStorage.getItem('chosenGroup');
  groupData;
  superuserData;
  changePasswordUser;
  newPassword;
  groupInfosLength = [{key: '',
                      value: ''}];
  groupInfosValues = [{key: '',
                      value: ''}];
  newGroup;
  changeGroup;
  chosenGroupInfos = [];
  values = [];
  enabledGroup;
  keyChangeInfos;
  valueChangeInfos;
  groupName;
  key;  
  value;
  addedValues = [];
  JsonString;
  keyValues = [{
    key: '',
    value: ''
  }]
  allGroupNames = [];
  userReceiptData;
  userReceiptImg = [];
  userReceiptProductsInfo = [];
  confirmationCheck = false;
  receiptData = [];
  researchStatus

  phoneData;
  activityData;
  receiptsData;
  iPhoneData;
  androidData;
  deviceDifference = []
  lowReceipts;
  mediumReceipts;
  highReceipts;
  receiptsSplit = [];
  disabledGroups;
  enabledGroups;
  enabledPercentage;
  statusDifference = [];
  newPhoneType = [];
  phoneModels = []
  phoneModelsAmount = []
  phoneModelName = []
  devicesConfirmation = false;
  showGraph = false;
  showDeviceDoughnutGraph = false;
  showPhoneModelDoughnutGraph = false;
  allPhoneOS = [];
  screenTimeParadata = [];
  screenTimeParadataPages = [];
  screenTimeParadataTime = [];
  screenTimeParadataContent = [{
    Page: String,
    Time: Number
  }]
  screenTimeUserParadata = [];
  screenTimeUserParadataPages = [];
  screenTimeUserParadataTime = [];
  screenTimeUserParadataContent = [{
    Page: String,
    Time: Number
  }]
  currentGroup;
  
  allUsernames = [];
  allUsers;
  userScreenTimeShow = false;
  options: ChartOptions = {
    responsive: true,
    legend: { position: 'left' }
  };
  receiptsBarChartLabels: Label[] = ["Under "+ localStorage.getItem('firstLimit') + " receipts", "Between "+ String(Number(localStorage.getItem('firstLimit'))) +" and " + localStorage.getItem('secondLimit') + " receipts", "Above "+localStorage.getItem('secondLimit')+" receipts"];
  receiptsBarChartType: ChartType = 'bar';
  receiptsBarChartLegend = true;
  receiptsBarChartPlugins = [];
  receiptsBarChartData: ChartDataSets[] = [
    { data: this.receiptsSplit, label: 'Receipts' }
  ];

  deviceDoughnutChartLabels: Label[] = ['IOS', 'Android'];
  deviceDoughnutChartData: MultiDataSet = [this.deviceDifference];
  deviceDoughnutChartType: ChartType = 'doughnut';
  deviceDoughnutChartOptions: ChartOptions = {
    responsive: true,
    legend: { position: 'left' },
    animation: {
      duration: 0
    }
  };

  screenTimeDoughnutChartLabels: Label[] = [this.screenTimeParadataPages];
  screenTimeDoughnutChartData: MultiDataSet = [this.screenTimeParadataTime];
  screenTimeDoughnutChartType: ChartType = 'doughnut';

  screenTimeUserDoughnutChartLabels: Label[] = [this.screenTimeUserParadataPages];
  screenTimeUserDoughnutChartData: MultiDataSet = [this.screenTimeUserParadataTime];
  screenTimeUserDoughnutChartType: ChartType = 'doughnut';

  statusDoughnutChartLabels: Label[] = ['Disabled', 'Enabled'];
  statusDoughnutChartData: MultiDataSet = [this.statusDifference];
  statusDoughnutChartType: ChartType = 'doughnut';

  phoneModelDoughnutChartLabels: Label[] = this.phoneModelName;
  phoneModelDoughnutChartData: MultiDataSet = [this.phoneModelsAmount];
  phoneModelDoughnutChartType: ChartType = 'doughnut';
  
  constructor(
    
    public configService: ConfigService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private loginPageService: LoginPageService,
    private groupPageService: GroupPageService,
    private groupOverviewService: GroupOverviewService,
    public navigation: TopBarService,
    private router: Router,
  ) { 
    this.createGroupForm = this.formBuilder.group({
      groupName: '',
      key: '',
      value: ''})
    
    this.changeGroupInfosForm = this.formBuilder.group({
      keyChangeInfos: '',
      valueChangeInfos: ''
    })
    ;}

  ngOnInit(): void {
    console.log(this.role)
    if (this.role == "casemanagement") {
      this.normalGrid = false;
    } else {
      this.normalGrid = true;
    }
    this.showGroupResponse()
    this.getUsersOfGroup()
    this.navigation.hide()
    this.name = localStorage.getItem('superUserData.name')
    this.chosenGroup = localStorage.getItem('chosenGroup')
    if (this.role != "casemanagement") {
      this.getUserReceiptData()
      this.getParadata()
      this.getDevicePercentage(this.newPhoneType)
      this.getGroupStatusDifference()
      this.getAllUsers(this.allUsernames)
      this.getScreenTimeGroup(this.screenTimeParadata)
      this.getReceiptAmount(7, 14)
    }
    
    console.log(this.role)
    
  }
  
  menuToggle() {
    const toggleMenu = document.querySelector('.menu');
    toggleMenu.classList.toggle('active')
  }

  //get all users in the selected group
  getUsersOfGroup() {
    this.configService.getUsersOfGroup(this.chosenGroup)
    .subscribe(users => {
        this.user = users;
      }
    )
  }

  //get all groups, also collects all group names for later functionalities
  showGroupResponse() {
    this.allGroupNames.length = 0;
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all groups has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all groups has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.groups = groups;
        this.getGroupInfosAmount()
        for (let group of this.groups){
          this.allGroupNames.push(group.group.name)
          if (this.chosenGroup == group.group.name) {
            if (group.group.status == 'enabled'){
              this.researchStatus = 'Active Research'
            } else {
              this.researchStatus = 'Inactive Research'
            }
          } 
        }
      }
    )
  }

  getThisGroup(currentGroup) {
    this.allGroupNames.length = 0;
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all groups has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all groups has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.groups = groups;
        this.getGroupInfosAmount()
        for (let group of this.groups){
          this.allGroupNames.push(group.group.name)
          if (this.chosenGroup == group.group.name) {
            currentGroup = group.group
          } 
        }
      }
    )
  }

  statusChanged(status) {
    if (status == 'disabled') {
      this.enableGroup()
    } else {
      this.disableGroup()
    }
    console.log(status)
  }

  //enable selected group
  enableGroup() {
    this.configService.enableGroup()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for enabling a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for enabling a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.showGroupResponse()
        this.currentGroup = 'enabled'
        this.researchStatus = 'Active Research'
        this.getGroupStatusDifference()
      }
    ) 
  }

  //disable selected groups
  disableGroup() {
    this.configService.disableGroup()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for disabling a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for disabling a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.showGroupResponse()
        this.currentGroup = 'disabled'
        this.researchStatus = 'Inactive Research'
        this.getGroupStatusDifference()
      }
    )
  }
  
  //change group infos
  changeGroupInfos() {
    this.groupPageService.groupInfosString.length = 0;
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        for (var index in group.groupInfos){
          //get all added key/value values
          this.keyChangeInfos = document.getElementById("key"+index);
          this.valueChangeInfos = document.getElementById("value"+index);
          this.keyChangeInfos = this.keyChangeInfos.value
          this.valueChangeInfos = this.valueChangeInfos.value
          //adds key/value values to infos collection
          this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
        }
      }
    }
    
    //execute change for group infos, this function can mean adding, changing or deleting groupinfos
    this.configService.changeGroupInfos()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing the group settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing the group settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.showGroupResponse()
      })
  }
  
  //create new group infos, adds group infos to already existing group infos collection (which can be empty)
  createNewGroupInfos() {
    this.keyChangeInfos = '';
    this.valueChangeInfos = '';
    this.groupPageService.groupInfosString.length = 0;
    var index = 0
    //gets existing group infos
    for (let group of this.groups){
      if (this.chosenGroup == group.group.name){
        
        if (group.groupInfos != null) {
          for (var infos of group.groupInfos){
            if (infos.key != '' && infos.value != ''){
              this.keyChangeInfos = document.getElementById("key"+index);
              this.valueChangeInfos = document.getElementById("value"+index);
              this.keyChangeInfos = this.keyChangeInfos.value
              this.valueChangeInfos = this.valueChangeInfos.value
              
              if (this.keyChangeInfos != "" && this.valueChangeInfos != ""){
                this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
              }
              index += 1;
            }
          }
        }
      }
    }

    //gets new group infos
    for (var selectedIndex in this.addedValues) {
      this.keyChangeInfos = document.getElementById("newKey"+selectedIndex);
      this.valueChangeInfos = document.getElementById("newValue"+selectedIndex);
      this.keyChangeInfos = this.keyChangeInfos.value
      this.valueChangeInfos = this.valueChangeInfos.value
      this.groupPageService.groupInfosString.push({key : this.keyChangeInfos, value : this.valueChangeInfos})
    }
    
    this.configService.changeGroupInfos()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing group settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing group settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.showGroupResponse()
      })
  }
  
  //change password of a user
  changePassword(userId, correspondingUser) {
    this.newPassword = document.getElementById('passwordValue'+userId)
    this.configService.changePassword(correspondingUser, this.newPassword.value)
    .subscribe()
    
    this.configService.getUsersOfGroup(this.configService.chosenGroup)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for changing a password has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for changing a password has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(users => {
          this.user = users;
      })
  }

  //regroup single user
  regroupUsers(userId, correspondingUser) {
    if (this.newGroup != '') {
      this.newGroup = document.getElementById('group'+userId)
      this.configService.regroupUsers(correspondingUser, this.newGroup.value)
        .pipe(catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}.\n
            An error for regrouping a user has occurred`;
          } else {
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
            An error for regrouping a user has occurred`;
          }
          window.alert(errorMessage);
          return throwError(error)
        }))
        .subscribe(_ => {
          this.getUsersOfGroup()
        })
    }
  }

  //regroup entire group
  regroupGroup(reGroupValue) {
    this.configService.regroupGroup(this.configService.chosenGroup, reGroupValue)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for regrouping all users in a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for regrouping all users in a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.router.navigate(['/overview'])
      })
  }

  //counts amount of new textboxes to create
  addvalue(amount) {
    this.values.length = 0;
    this.addedValues.length = 0;
    for (let groupInfos in this.chosenGroupInfos) {
      this.values.push(groupInfos)
    }
    for (var _i = 0; _i < amount; _i++) {
      this.values.push(_i);
      this.addedValues.push(_i);
    }
  }

  //gets existing group infos amount
  getGroupInfosAmount() {
    this.chosenGroupInfos.length = 0
    for (let group of this.groups) {
      if (group.group.name == this.chosenGroup) {
        try {
          for (let index of group.groupInfos) {
            if (index.key != '' && index.value != ''){
              this.chosenGroupInfos.push({key: index.key, value: index.value})
            }
          }
        }
        catch {}
      }
    }
  }

  //duplicate group (doesn't copy users, does copy group infos)
  duplicateGroup(newGroupName) {
    this.getGroupInfosAmount();
    this.JsonString = {
      "superuser" : {"name" : localStorage.getItem('superUserData.name'), "password" : localStorage.getItem('superUserData.password')},
      "group": {"name" : newGroupName},
      "groupInfos"  : this.chosenGroupInfos
      }
    this.configService.duplicateGroup(this.JsonString)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for duplicating a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for duplicating a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.router.navigate(['/overview'])
      })
  }

  //delete all groupinfos of selected group
  deleteGroupInfos() {
    this.configService.deleteGroupInfos(localStorage.getItem('chosenGroup'))
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for delete a group's settings has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for delete a group's settings has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(_ => {
        this.showGroupResponse()
      })
  }

  //filter users
  filterOnUsers(filterValue) {
    localStorage.setItem('filterValue', filterValue)
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
        this.user = users;
        this.user = this.user.filter(this.filterUsers)
      }
    )
  }

  //filter on username
  filterUsers(element, index, array) {
    return element.name.toLowerCase().includes(localStorage.getItem('filterValue').toLowerCase())
  }

  //go to receipts page
  userClick(clickedUser) {
    localStorage.setItem('chosenUser', clickedUser);
    this.router.navigate(['/receipts', clickedUser]);
  }

  getUserReceiptData() {
    this.configService.getReceiptsPerUser()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving the user's receipts has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving the user's receipts has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.receiptData = groups.receiptsPerUsers
      }
    )
  }

  

  getAllUsers(allUsernames) {
    this.configService.getUsersOfGroup(this.chosenGroup)
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the group names has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the group names has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(users => {
          this.allUsers = users;
          for (let index of this.allUsers) {
            allUsernames.push(index.name)
          }
        }
      )
  }

  //get paradata
  getParadata() {
    this.configService.getAmountOfReceipts()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          No Receipt Data Available`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          No Receipt Data Available`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.receiptsData = data;
        this.receiptsData = this.receiptsData.receiptsPerDays;
      })

    this.configService.getPhoneParadata()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          No Phone Data Available`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          No Phone Data Available`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.phoneData = data;
        this.phoneData = this.phoneData.receiptsPerPhones;
      })

    this.configService.getActivityParadata()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
                          No Activity Data Available`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          No Activity Data Available`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.activityData = data;
        this.activityData = this.activityData.paradataDateTimes;
      })
  }

  //get percentage of each device types
  getDevicePercentage(newPhoneType) {
    this.configService.getPhoneParadata()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for calculating the device percentage has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for calculating the device percentage has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(data => {
        this.deviceDifference.length = 0
        this.phoneData = data;
        this.phoneData = this.phoneData.receiptsPerPhones;
        
        this.getModel(this.phoneData, newPhoneType)
        this.phoneModels.length = 0
        var index = 0;
        for (let element of newPhoneType) {
          localStorage.setItem('phoneModel', element.phoneModel)
          this.phoneModelName.push(element.phoneModel)
          this.phoneModels[index] = this.phoneData.filter(this.getAmountPhoneModels)
          this.phoneModelsAmount.push(this.phoneModels[index].length)
          index +=1
        }
        this.iPhoneData = this.phoneData.filter(this.getIphones)
        this.androidData = this.phoneData.filter(this.getAndroid)
        this.deviceDifference.push(this.iPhoneData.length, this.androidData.length)
      })
  }

  //get amount of receipts and split them in 3 categories
  getReceiptAmount(firstLimit, secondLimit) {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.receiptsSplit.length = 0;
      this.receiptsData = data;
      this.receiptsData = this.receiptsData.receiptsPerDays;
      localStorage.setItem('firstLimit', firstLimit)
      localStorage.setItem('secondLimit', secondLimit)
      this.lowReceipts = this.receiptsData.filter(this.splitReceiptsLow)
      this.mediumReceipts = this.receiptsData.filter(this.splitReceiptsMedium)
      this.highReceipts = this.receiptsData.filter(this.splitReceiptsHigh)
      
      this.receiptsSplit.push(this.lowReceipts.length, this.mediumReceipts.length, this.highReceipts.length)
      this.receiptsBarChartLabels = ["Under "+ localStorage.getItem('firstLimit') + " receipts", "Between "+ String(Number(localStorage.getItem('firstLimit'))) +" and " + localStorage.getItem('secondLimit') + " receipts", "Above "+localStorage.getItem('secondLimit')+" receipts"];
    })
  }

  //get enabled/disabled split in percentages
  getGroupStatusDifference() {
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for calculating the group status percentage has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for calculating the group status percentage has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.statusDifference.length = 0
        this.groups = groups;
        this.disabledGroups = this.groups.filter(this.getDisabledGroups)
        this.enabledGroups = this.groups.filter(this.getEnabledGroups)
        this.statusDifference.push(this.disabledGroups.length, this.enabledGroups.length)
        this.enabledPercentage = (this.enabledGroups.length / (this.disabledGroups.length+this.enabledGroups.length)) * 100
      }
    )
  }

getScreenTimeGroup(paradataPlaceholder) {
    this.screenTimeParadataContent.length = 0;
    this.screenTimeParadataPages.length = 0;
    this.screenTimeParadataTime.length = 0;
    this.configService.getParadataScreenTime()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for the screen time of a group has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for the screen time of a group has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(screenTimeParadataValues => {
        paradataPlaceholder = screenTimeParadataValues.paradataScreenTimes;
        for (let screenTime of paradataPlaceholder) {
          if (this.screenTimeParadataContent.includes(screenTime.objectName) == false){
            this.screenTimeParadataContent.push({Page: screenTime.objectName, Time: screenTime.screenTime})
          } else {
            const foundIndex = (element) => element == screenTime.objectName
            this.screenTimeParadataContent[this.screenTimeParadataContent.findIndex(foundIndex)].Time += screenTime.screenTime
          }
        }
        for (let element of this.screenTimeParadataContent) {
          this.screenTimeParadataPages.push(element.Page)
          this.screenTimeParadataTime.push(element.Time)
        }
      }
    )
  }

  getScreenTimeUser(paradataPlaceholder, corUser) {
    this.screenTimeUserParadataContent.length = 0;
    this.screenTimeUserParadataPages.length = 0;
    this.screenTimeUserParadataTime.length = 0;

    this.configService.getParadataScreenTime()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for gathering the data for the screen time of a user has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for gathering the data for the screen time of a user has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(screenTimeParadataValues => {
        paradataPlaceholder = screenTimeParadataValues;
        for (let screenTime of paradataPlaceholder.paradataScreenTimes) {
          if (screenTime.userName == corUser && corUser != ""){
            this.userScreenTimeShow = true;
            if (this.screenTimeUserParadataContent.includes(screenTime.objectName) == false){
              this.screenTimeUserParadataContent.push({Page: screenTime.objectName, Time: screenTime.screenTime})
            } else {
              const foundIndex = (element) => element == screenTime.objectName
              this.screenTimeUserParadataContent[this.screenTimeParadataContent.findIndex(foundIndex)].Time += screenTime.screenTime
            }
          } else {
            this.userScreenTimeShow = false;
          }
        }
        for (let element of this.screenTimeParadataContent) {
          this.screenTimeUserParadataPages.push(element.Page)
          this.screenTimeUserParadataTime.push(element.Time)
        }
      }
    )
  }

  //show correct graphs
  selectionChange(givenValue) {
    this.showDeviceDoughnutGraph = false
    this.showPhoneModelDoughnutGraph = false
    if (givenValue != "") {
      this.showGraph = true
      if (givenValue == "OS") {
        this.showDeviceDoughnutGraph = true
      } else if (givenValue == "Phone Model") {
        this.showPhoneModelDoughnutGraph = true
      }
    } else {
      this.showGraph = false
    }
  }

  //get paradata values
  getIphones(element) {
    return element.phoneType == 'IOS'
  }

  getAndroid(element) {
    return element.phoneType == 'android'
  }

  getAmountPhoneModels(element, index) {
    return element.phoneModel == localStorage.getItem('phoneModel')
  }

  getModel(element, newPhoneType) {
    for (let phone of element){
      if (newPhoneType.includes(phone.phoneModel) == false){
        newPhoneType.push(phone)
      }
      if (this.allPhoneOS.includes(phone.phoneType) == false){
        this.allPhoneOS
      }
    }
  }

  //split paradata values for grouping of values
  splitReceiptsLow(element) {
    return element.receipts < Number(localStorage.getItem('firstLimit'))
  }

  splitReceiptsMedium(element) {
    return (element.receipts <= Number(localStorage.getItem('secondLimit')) && element.receipts >= Number(localStorage.getItem('firstLimit')))
  }

  splitReceiptsHigh(element) {
    return element.receipts > Number(localStorage.getItem('secondLimit'))
  }

  getDisabledGroups(element) {
    return element.group.status == 'disabled'
  }

  getEnabledGroups(element) {
    return element.group.status == 'enabled'
  }
}

@Component({
  selector: 'app-delete-properties-dialog',
  templateUrl: './delete-properties-dialog.html',
  styleUrls: ['./group-page.component.css']
})

export class DeletePropertiesDialogComponent implements OnInit {
  allGroupNames;
  groups;
  chosenGroupInfos;
  chosenGroup;

  ngOnInit() {
    this.showGroupConfig()
  } 

  constructor(
    public configService: ConfigService
  ) { }

  showGroupConfig() {
    this.allGroupNames.length = 0;
    this.configService.getGroups()
      .pipe(catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = `Error: ${error.error.message}.\n
          An error for retrieving all groups has occurred`;
        } else {
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}.\n
          An error for retrieving all groups has occurred`;
        }
        window.alert(errorMessage);
        return throwError(error)
      }))
      .subscribe(groups => {
        this.groups = groups;
      }
    )
  }
}