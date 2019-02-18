import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalRelocationComponent } from './internal-relocation.component';

describe('InternalRelocationComponent', () => {
  let component: InternalRelocationComponent;
  let fixture: ComponentFixture<InternalRelocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalRelocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalRelocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
