import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatPaginator, MatSnackBar, MatSort, MatTableDataSource, PageEvent} from '@angular/material';
import {Box} from '../../models/Box';
import {ActivatedRoute, Router} from '@angular/router';
import {Options} from '../../models/Options';
import * as papa from 'papaparse';
import {Warehouse} from '../../models/Warehouse';
import {forEach} from '@angular/router/src/utils/collection';
import {Search} from '../../models/Search';
import {AuthService} from "../../services/auth.service";


@Component({
  selector: 'app-box-list',
  templateUrl: './box-list.component.html',
  styleUrls: ['./box-list.component.scss']
})
export class BoxListComponent implements OnInit, AfterViewInit {
  weatherOptions = Options.weatherOptions;
  categoryOptions = Options.categoryOptions;
  itemOptions = Options.itemOptions;
  sizeOptions = Options.sizeOptions;

  length: number;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  warehouses: Warehouse[];
  rows: string[] = [];
  columns: string[] = [];
  pageEvent: PageEvent;

  box: Box = new Box();
  columnSelection: string;
  rowSelection: string;
  search: Search = new Search();

  displayedColumns: string[];

  dataSource: MatTableDataSource<Box>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    public authService: AuthService,
  ) {
    if (authService.isLoggedIn) {
      this.displayedColumns = ['id', 'warehouse', 'location', 'weather', 'categories', 'items', 'sizes', 'delete'];
    } else {
      this.displayedColumns = ['id', 'warehouse', 'location', 'weather', 'categories', 'items', 'sizes'];
    }

    this.db.collection('box').get().subscribe(res => {
      this.length = res.size;
      this.dataSource = new MatTableDataSource(res.docs.map(el => el.data() as Box));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
    this.db.collection('warehouses').valueChanges().subscribe(
      res => {
        this.warehouses = res as Warehouse[];
      });
    this.db.collection('rows').get().subscribe(res => {
      res.docs.forEach(doc => this.rows.push(doc.data().value as string));
      this.rows.sort((a, b) => {
        return parseInt(a) - parseInt(b);
      });
    });
    this.db.collection('columns').get().subscribe(res => {
      res.docs.forEach(doc => this.columns.push(doc.data().value as string));
      this.columns.sort();
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  applyFilter() {
    this.dataSource.filterPredicate = this.customFilterPredicate();
    let searchString: string = '';
    for (let key in this.search) {
      searchString += this.search[key] + ',';
    }
    if (this.columnSelection && this.rowSelection) {
      searchString += this.columnSelection + '-' + this.rowSelection;
    }
    this.dataSource.filter = searchString;
  }

  findWeatherIconById(id: string) {
    return this.weatherOptions.find(obj => obj.id === id).iconClass;
  }

  findCategoryIconById(id: string) {
    return this.categoryOptions.find(obj => obj.id === id).iconClass;
  }

  findItemIconById(id: string) {
    return this.itemOptions.find(obj => obj.id === id).iconClass;
  }

  findSizeById(ids: string[]) {
    return ids.map(id => ' ' + this.sizeOptions.find(obj => obj.id === id).name);
  }

  async delete(box: Box) {
    this.dataSource.data = this.dataSource.data.filter(obj => obj.id !== box.id);
    await this.db.collection('box').doc(box.id).delete();
    this.snackBar.open('Box deleted!', null, {duration: 2000});
  }

  async exportFilteredAsCsv() {
    const papaparseUnparseConfig = {
      quotes: false,
      delimiter: '\t',
      skipEmptyLines: true,
    };

    const element = document.createElement('a');
    element.style.display = 'none';

    element.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,'
      + encodeURIComponent(
      papa.unparse(
        this.dataSource.filteredData,
        papaparseUnparseConfig
      )
      )
    );
    element.setAttribute('download', 'refyWMS-export-TABSEPERATED.csv');

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  customFilterPredicate() {
    const myFilterPredicate = function (data: Box, filter: string): boolean {
      let result: boolean = true;
      let search: string[] = filter.split(',');
      let object: string = JSON.stringify(data);
      console.log(search);
      console.log(object);
      search.forEach((string, index) => {
        if (string !== '' && result === true) {
          result = object.includes(string);
          console.log(string);
          console.log(result);
        }
      });
      return result;
    };
    return myFilterPredicate;
  }
}

