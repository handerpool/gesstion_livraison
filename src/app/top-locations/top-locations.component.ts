import { NgFor } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Location } from '../models/delivery.model';

@Component({
  selector: 'app-top-locations',
  standalone: true,
  imports: [NgFor],
  templateUrl: './top-locations.component.html',
  styleUrl: './top-locations.component.css'
})
export class TopLocationsComponent {
  @Input() locations: Location[] = [];
}
