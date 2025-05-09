import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSatisfactionChartComponent } from './customer-satisfaction-chart.component';

describe('CustomerSatisfactionChartComponent', () => {
  let component: CustomerSatisfactionChartComponent;
  let fixture: ComponentFixture<CustomerSatisfactionChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSatisfactionChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSatisfactionChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
