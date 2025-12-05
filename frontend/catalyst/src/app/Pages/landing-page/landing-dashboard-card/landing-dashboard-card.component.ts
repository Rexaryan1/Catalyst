import { Component, ViewChild } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexChart,
  ApexStroke,
  NgApexchartsModule,
  ApexPlotOptions
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  colors: any;
  fill: ApexFill,
  plotOptions: ApexPlotOptions;
  theme: ApexTheme;
};

@Component({
  selector: 'landing-dashboard-card',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './landing-dashboard-card.component.html',
  styleUrl: './landing-dashboard-card.component.scss'
})
export class LandingDashboardCardComponent {
  @ViewChild("heatmap") chart: any;
  public chartOptions: ChartOptions;
  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Mon",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Tue",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Wed",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Thu",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Fri",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Sat",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        },
        {
          name: "Sun",
          data: this.generateData(4, {
            min: 0,
            max: 4
          })
        }
      ],
      chart: {
        height: 320,
        width: 235,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: ["#2F2F2F"],
      fill: {
        colors: ["#2F2F2F"]
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 5,

          colorScale: {
            ranges: [{
              from: 0,
              to: 1,
              color: "#4C5253",
            },
              {
              from: 1,
              to: 2,
              color: "#93A8AE",
            },
            {
              from: 2,
              to: 3,
              color: "#BEDCE4",
            },
            {
              from: 3,
              to: 4,
              color: "#CFF5FF",
            }],
          },
          useFillColorAsStroke: true,
        }
      },
      theme: { mode: 'dark' }
    };

  }

  public generateData(count: number, yrange: { min: number; max: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
}
