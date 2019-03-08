import {Component, OnInit} from '@angular/core';
import {Box} from '../../models/Box';
import {isUndefined} from 'util';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-goods-in',
  templateUrl: './goods-in.component.html',
  styleUrls: ['./goods-in.component.scss']
})
export class GoodsInComponent implements OnInit {

  scanning = true;
  box: Box;

  constructor(
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: { [key: string]: any }) => {
      if (params['sscc']) {
        this.getBoxBySscc(params['sscc']);
      }
    });
  }

  getBoxBySscc(sscc: string): void {
    this.db.collection('box').doc(sscc).get().subscribe(res => {
      this.box = res.data() as Box;
      if (isUndefined(this.box)) {
        this.box = new Box(sscc);
        this.scanning = false;
      } else {
        this.snackBar.open('Box already scanned!', 'Dismiss', {duration: 2000});
      }
    });

  }

  boxSaved(event: any) {
    // reset component
    this.box = undefined;
    this.scanning = true;
  }
}
