import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryPerformanceChartComponent } from './delivery-performance-chart.component';

describe('DeliveryPerformanceChartComponent', () => {
  let component: DeliveryPerformanceChartComponent;
  let fixture: ComponentFixture<DeliveryPerformanceChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeliveryPerformanceChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryPerformanceChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
