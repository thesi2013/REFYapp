import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from '@angular/material';
import {AngularFirestore} from '@angular/fire/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {Box} from 'src/app/models/Box';
import {Warehouse} from 'src/app/models/Warehouse';
import {isUndefined} from 'util';

@Component({
  selector: 'app-internal-relocation',
  templateUrl: './internal-relocation.component.html',
  styleUrls: ['./internal-relocation.component.scss']
})
export class InternalRelocationComponent implements OnInit {

  scanning = true;
  atLeastOneMarked = false;
  marked = new Set<Box>();

  warehouses = new Array<Warehouse>();
  selectedDestination: Warehouse;

  column: string;
  row: string;
  rows = new Array<string>();
  columns = new Array<string>();

  constructor(
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.db.collection('warehouses').get().subscribe(res => {
      res.docs.forEach(doc => this.warehouses.push(doc.data() as Warehouse));
      this.warehouses.sort((a: Warehouse, b: Warehouse) => a.name > b.name ? 1 : -1);
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

    this.activatedRoute.queryParams.subscribe((params: { [key: string]: any }) => {
      if (!params['marked']) {
        this.marked.clear();
        this.atLeastOneMarked = false;
        this.scanning = true;
      }
    });
  }

  newSscc(sscc: string): void {
    if (this.scanning) {
      let newBox = true;
      this.marked.forEach(box => (box.id === sscc) ? newBox = false : null);
      if (newBox) {
        this.db.collection('box').doc(sscc).get().subscribe(res => {
          const box = res.data() as Box;
          if (isUndefined(box)) {
            this.snackBar.open('Not a valid Code', null, {duration: 2000});
          } else {
            if (!this.atLeastOneMarked) {
              // first box
              this.selectedDestination = this.warehouses.find(w => w.name === box.warehouse);
            }
            this.marked.add(box);
            this.atLeastOneMarked = true;
            this.router.navigate([], {queryParams: {marked: true}});
            this.snackBar.open('Marked Box for Output', null, {duration: 2000});
            this.scanning = false;
          }
        });
      } else {
        this.snackBar.open('Box already scanned', null, {duration: 2000});
      }
    }
  }

  scanMore(): void {
    this.scanning = true;
  }

  stopScanning(): void {
    this.scanning = false;
  }

  moveBoxes(): void {
    console.log(this.selectedDestination);
    this.marked.forEach(box => {
      box.warehouse = this.selectedDestination.name;
      box.column = this.column;
      box.row = this.row;
      box.location = this.column + '-' + this.row;
      this.db.collection('box').doc(box.id).set({...box});
    });
    this.snackBar.open('Boxes moved to ' + this.selectedDestination.name, null, { duration: 2000 });

    // reset component
    this.marked.clear();
    this.selectedDestination = undefined;
    this.scanning = true;
    this.atLeastOneMarked = false;
  }
}
