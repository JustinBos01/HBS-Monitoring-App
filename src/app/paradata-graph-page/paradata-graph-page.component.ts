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
  phoneData;
  activityData;
  receiptsData;
  iPhoneData;
  androidData;
  deviceDifference = []


  constructor(
    public configService: ConfigService,
  ) { }

  ngOnInit(): void {
    this.getParadata()
    this.getDevicePercentage()
  }

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

  getDevicePercentage() {
    this.configService.getPhoneParadata().subscribe(data => {
      this.phoneData = data;
      this.phoneData = this.phoneData.receiptsPerPhones;

      this.iPhoneData = this.phoneData.filter(this.getIphones)
      this.androidData = this.phoneData.filter(this.getAndroid)
      this.deviceDifference.push(this.iPhoneData.length, this.androidData.length)
    })
  }

  getIphones(element) {
    return element.phoneType == 'IOS'
  }

  getAndroid(element) {
    return element.phoneType == 'android'
  }

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = ['IOS', 'Android'];
  public pieChartData: SingleDataSet = [this.deviceDifference];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [];
}
