import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BigDogComponent } from './big-dog.component';

describe('BigDogComponent', () => {
  let component: BigDogComponent;
  let fixture: ComponentFixture<BigDogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BigDogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BigDogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
