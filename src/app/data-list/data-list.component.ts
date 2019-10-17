import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataListService } from './data-list.service';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface Selection {
  resolution: string;
  period: string;
}

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['position', 'date', 'sum', 'max', 'avg', 'min'];
  public dataSource = new MatTableDataSource<any>([]);

  public resolutions = ['raw', 'hourly', 'daily', 'monthly'];
  public periods = ['24h', '2d', '7d'];

  public selection = {
    resolution: '',
    period: ''
  };

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dataListService: DataListService
  ) {

  }

  ngOnInit() {
    this.dataListService.load().subscribe(outcome => {
      this.dataSource.data = outcome;
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmit() {
    console.log(this.selection);
  }
}
