import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelLogComponent } from './model-log.component';

describe('ModelLogComponent', () => {
  let component: ModelLogComponent;
  let fixture: ComponentFixture<ModelLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
