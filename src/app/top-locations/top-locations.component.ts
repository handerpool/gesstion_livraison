import { NgFor, NgIf } from '@angular/common';
import { Component, Input, SimpleChanges ,OnChanges} from '@angular/core';
import { Location } from '../models/delivery.model';

@Component({
  selector: 'app-top-locations',
  standalone: true,
  imports: [NgFor,NgIf],
  templateUrl: './top-locations.component.html',
  styleUrl: './top-locations.component.css'
})
export class TopLocationsComponent {
  @Input() locations: Location[] = [];
  activeZone:Location |null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['locations'] && this.locations.length > 0) {
      this.updateActiveZone();
    }
  }

  private updateActiveZone(): void {
    this.activeZone = this.locations.reduce((max, location) => 
      location.percentage > (max?.percentage || 0) ? location : max, this.locations[0]);
  }
}
