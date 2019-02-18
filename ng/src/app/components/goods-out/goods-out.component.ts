import { Component, OnInit } from '@angular/core';
import { Box } from 'src/app/models/Box';
import { markViewDirty } from '@angular/core/src/render3/instructions';
import { getCurrentDebugContext } from '@angular/core/src/view/services';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatSnackBar } from '@angular/material';
import { isUndefined } from 'util';
import { defineBase } from '@angular/core/src/render3';
import { Warehouse } from 'src/app/models/Warehouse';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-goods-out',
  templateUrl: './goods-out.component.html',
  styleUrls: ['./goods-out.component.scss']
})
export class GoodsOutComponent implements OnInit {

  scanning = true;
  atLeastOneMarked = false;
  marked = new Set<Box>();

  destinations = new Array<Warehouse>();
  selectedDestination: Warehouse;

  constructor(
    private snackBar: MatSnackBar,
    private db: AngularFirestore,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.db.collection('destinations').get().subscribe(res => {
      res.docs.forEach(doc => this.destinations.push(doc.data() as Warehouse));
    });
    this.activatedRoute.queryParams.subscribe((params: { [key: string]: any }) => {
      if (!params['marked']) {
        this.marked.clear();
        this.atLeastOneMarked  = false;
        this.scanning = true;
      }
    });
  }

  newSscc(sscc: string): void {
    if (this.scanning) {
      let newBox = true;
      this.marked.forEach(box  => (box.id === sscc) ? newBox  = false  : null);
      if (newBox) {
        this.db.collection('box').doc(sscc).get().subscribe(res => {
          const box = res.data() as Box;
          if (isUndefined(box)) {
            this.snackBar.open('Not a valid Code', null, { duration: 2000 });
          } else {
            this.marked.add(box);
            this.atLeastOneMarked = true;
            this.router.navigate([], {queryParams: {marked: true}});
            this.snackBar.open('Marked Box for Output', null, { duration: 2000 });
            this.scanning = false;
          }
        });
      } else {
        this.snackBar.open('Box already scanned', null, { duration: 2000});
      }
    }
  }

  scanMore(): void {
    this.scanning = true;
  }

  stopScanning(): void  {
    this.scanning = false;
  }

  moveBoxes(): void {
    console.log(this.selectedDestination);
    this.marked.forEach(box => {
      box.warehouse = this.selectedDestination.name;
      box.location = '🚚 🚚';
      this.db.collection('box').doc(box.id).set({ ...box });
    });
    this.snackBar.open('Boxes moved to ' + this.selectedDestination.name, null, { duration: 2000 });

    // reset component
    this.marked.clear();
    this.selectedDestination = undefined;
    this.scanning = true;
    this.atLeastOneMarked = false;
  }
}
