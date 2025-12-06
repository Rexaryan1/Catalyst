import { Component } from '@angular/core';
import { ApexOptions, ChartComponent, NgApexchartsModule } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  options: ApexOptions;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'donut-chart',
  templateUrl: './donut-chart.html',
  standalone: true,
  imports: [NgApexchartsModule, ChartComponent],
  styleUrl: './donut-chart.scss',
})


export class DonutChart {
  public chartOptions: ChartOptions;

  constructor() {
    this.chartOptions = {
      options: {
        plotOptions: {
          pie: {
            customScale: 0.2
          }
        }
      },
      series: [44, 55, 13],
      chart: {
        type: "donut"
      },
      labels: ["Easy", "Medium", "Hard"],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 50
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
