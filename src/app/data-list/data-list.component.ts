import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataListService } from './data-list.service';
import { map, tap } from 'rxjs/operators';
import { Collection } from '../collection';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit, AfterViewInit {

  public dataSource = new MatTableDataSource<any>([]);
  public columns = ['no', 'date', 'sum', 'max', 'avg', 'min'];
  public resolutions = ['raw', 'hourly', 'daily', 'monthly'];
  public periods = ['24h', '2d', '7d', '14d', '1m', '2m', '5m'];

  public selection = {
    resolution: 'raw',
    period: '24h'
  };

  public collection: Collection;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dataListService: DataListService
  ) {

  }

  public ngOnInit(): void {
    this.hydrate();
  }

  public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * Method used in the main table filter action
   *
   * @param {string} filterValue
   */
  public applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  public onSubmit(): void {
    this.hydrate();
  }

  /**
   * Controls the data flow by making the HTTP request
   */
  private hydrate(): void {
    this.dataListService.load(this.selection.resolution, this.selection.period)
      .pipe(
        tap(collection => this.collection = collection),
        map(collection => this.dataListService.scatter(collection))
      )
      .subscribe(outcome => {
        this.dataSource.data = outcome;
      });
  }
}
