import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SSCCScannerComponent } from './ssccscanner.component';

describe('SSCCScannerComponent', () => {
  let component: SSCCScannerComponent;
  let fixture: ComponentFixture<SSCCScannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SSCCScannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SSCCScannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
