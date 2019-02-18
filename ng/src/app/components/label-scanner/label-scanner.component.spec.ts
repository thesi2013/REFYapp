import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelScannerComponent } from './label-scanner.component';

describe('LabelScannerComponent', () => {
  let component: LabelScannerComponent;
  let fixture: ComponentFixture<LabelScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabelScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
