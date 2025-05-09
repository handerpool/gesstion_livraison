import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentDeliveriesComponent } from './recent-deliveries.component';

describe('RecentDeliveriesComponent', () => {
  let component: RecentDeliveriesComponent;
  let fixture: ComponentFixture<RecentDeliveriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentDeliveriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentDeliveriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
