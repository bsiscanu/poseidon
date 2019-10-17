import { Component, Input } from '@angular/core';
import { Collection } from '../collection';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent {

  public chartData = [];
  public chartLabels = [];
  public chartType = 'line';
  public chartLegend = true;

  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  /**
   * Listens for the input from the data-list component
   *
   * @param {Collection} collection
   */
  @Input() set crude(collection: Collection) {
    if (collection !== undefined) {
      this.chartLabels = collection.dates;
      this.chartData = [
        {data: collection.sum, label: 'Precipitation'},
        {data: collection.avg, label: 'Avg Temperature'},
        {data: collection.max, label: 'Max Temperature'},
        {data: collection.min, label: 'Min Temperature'}
      ];
    }
  }

}
