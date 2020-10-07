import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPlanComponent } from './modal-plan.component';

describe('ModalPlanComponent', () => {
  let component: ModalPlanComponent;
  let fixture: ComponentFixture<ModalPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
