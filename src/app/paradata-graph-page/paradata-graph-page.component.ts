import { Component, OnInit } from '@angular/core';
import { ConfigService } from '../config/config.service'
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet, SingleDataSet, monkeyPatchChartJsLegend, monkeyPatchChartJsTooltip } from 'ng2-charts';

@Component({
  selector: 'app-paradata-graph-page',
  templateUrl: './paradata-graph-page.component.html',
  styleUrls: ['./paradata-graph-page.component.css']
})
export class ParadataGraphPageComponent implements OnInit {
  groups;
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
  chosenGroup;
  allPhoneTypes = [];
  
  receiptsBarChartOptions: ChartOptions = {
    responsive: true,
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

  statusDoughnutChartLabels: Label[] = ['Disabled', 'Enabled'];
  statusDoughnutChartData: MultiDataSet = [this.statusDifference];
  statusDoughnutChartType: ChartType = 'doughnut';

  phoneModelDoughnutChartLabels: Label[] = this.phoneModelName;
  phoneModelDoughnutChartData: MultiDataSet = [this.phoneModelsAmount];
  phoneModelDoughnutChartType: ChartType = 'doughnut';

  constructor(
    public configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.chosenGroup = localStorage.getItem("chosenGroup")
    this.getParadata()
    this.getDevicePercentage(this.newPhoneType)
    this.getGroupStatusDifference()
    
    this.getReceiptAmount(7, 14)
  }

  //get paradata
  getParadata() {
    this.configService.getAmountOfReceipts().subscribe(data => {
      this.receiptsData = data;
      this.receiptsData = this.receiptsData.receiptsPerDays;
    })

    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneData = data;
      this.phoneData = this.phoneData.receiptsPerPhones;
    })

    this.configService.getActivityParadata().subscribe(data => {
      this.activityData = data;
      this.activityData = this.activityData.paradataDateTimes;
    })
  }

  //get percentage of each device types
  getDevicePercentage(newPhoneType) {
    this.configService.getPhoneParadata().subscribe(data => {
      this.deviceDifference.length = 0
      this.phoneData = data;
      this.phoneData = this.phoneData.receiptsPerPhones;
      
      this.getModel(this.phoneData, newPhoneType)
      this.phoneModels.length = 0
      var index = 0;
      for (let element of newPhoneType) {
        console.log(element)
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
      .subscribe(groups => {
        this.statusDifference.length = 0
        this.groups = groups;
        this.disabledGroups = this.groups.filter(this.getDisabledGroups)
        this.enabledGroups = this.groups.filter(this.getEnabledGroups)
        this.statusDifference.push(this.disabledGroups.length, this.enabledGroups.length)
        this.enabledPercentage = (this.enabledGroups.length / (this.disabledGroups.length+this.enabledGroups.length)) * 100
      })
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
        console.log(phone)
        newPhoneType.push(phone)
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
