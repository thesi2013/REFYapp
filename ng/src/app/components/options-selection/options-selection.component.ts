import {
  AfterViewInit,
  Component,
  DoCheck,
  Input,
  KeyValueDiffer,
  KeyValueDiffers,
  OnChanges,
  OnInit
} from '@angular/core';
import {Options} from '../../models/Options';
import {Box} from '../../models/Box';
import {ActivatedRoute} from '@angular/router';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatSnackBar} from '@angular/material';
import {Warehouse} from '../../models/Warehouse';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-options-selection',
  templateUrl: './options-selection.component.html',
  styleUrls: ['./options-selection.component.scss'],
})
export class OptionsSelectionComponent implements OnInit, DoCheck {
  weatherOptions = Options.weatherOptions;
  categoryOptions = Options.categoryOptions;
  itemOptions = Options.itemOptions;
  sizeOptions = Options.sizeOptions;

  @Input()
  box: Box;
  boxDiffer: KeyValueDiffer<string, any>;
  warehouses: Warehouse[];

  changes: boolean = false;
  custom: boolean = false;
  labelScannerActive = false;

  rows = new Array<string>();
  columns = new Array<string>();

  customFormControl = new FormControl('', [
    Validators.required,
  ]);

  constructor(
    private route: ActivatedRoute,
    private db: AngularFirestore,
    private snackBar: MatSnackBar,
    private differs: KeyValueDiffers,
  ) {
    this.db.collection('warehouses').valueChanges().subscribe(
      res => {
        this.warehouses = res as Warehouse[];
      });
  }

  ngDoCheck(): void {
    if (this.box) {
      const difference = this.boxDiffer.diff(this.box);
      if (difference) {
        console.log(this.box);
        this.changes = true;
        if (this.box.items.includes('questionmark')) {
          this.custom = true;
          if (this.box.custom === '') {
            console.log(this.box.custom);
            this.changes = false;
          }
        } else {
          this.custom = false;
        }
      }
    }
  }

  ngOnInit() {
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

    this.boxDiffer = this.differs.find(this.box).create();
    this.boxDiffer.diff(this.box);
  }

  scanLabel() {
    this.labelScannerActive = true;
  }

  labelScanned(result: Box) {
    this.box = result;
    this.labelScannerActive = false;
    this.changes = true;
  }

  async save() {
    this.changes = false;
    this.box.location = this.box.column + '-' + this.box.row;
    await this.db.collection('box').doc(this.box.id).set({...this.box});
    this.snackBar.open('Box updated!', null, {duration: 2000});
  }
}
