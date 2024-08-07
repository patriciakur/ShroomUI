import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBatteryComponent } from './current-battery.component';

describe('CurrentBatteryComponent', () => {
  let component: CurrentBatteryComponent;
  let fixture: ComponentFixture<CurrentBatteryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrentBatteryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentBatteryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
