import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryStatusChartComponent } from './delivery-status-chart.component';

describe('DeliveryStatusChartComponent', () => {
  let component: DeliveryStatusChartComponent;
  let fixture: ComponentFixture<DeliveryStatusChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryStatusChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryStatusChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
