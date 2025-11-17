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
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Tue",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Wed",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Thu",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Fri",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        },
        {
          name: "Sat",
          data: this.generateData(18, {
            min: 0,
            max: 90
          })
        }
      ],
      chart: {
        height: 250,
        type: "heatmap"
      },
      dataLabels: {
        enabled: true
      },
      colors: ["#008FFB"],
      fill: {
        colors: ["#000000ff"]
      },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0,
          colorScale: {
            ranges: [{
              from: 0,
              to: 0,
              color: "#001700ff",
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
