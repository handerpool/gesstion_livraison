import { NgClass, NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-stats-cards',
  standalone: true,
  imports: [NgClass,NgFor],
  templateUrl: './stats-cards.component.html',
  styleUrl: './stats-cards.component.css'
})
export class StatsCardsComponent {
  statsCards = [
    {
      title: 'Livraisons totales',
      value: '248',
      change: '+12%',
      trend: 'up',
      icon: 'truck',
      iconBg: '#2A9D8F',
    },
    {
      title: 'Revenu des livraisons',
      value: '1,842 DTN',
      change: '+8%',
      trend: 'up',
      icon: 'dollar-sign',
      iconBg: '#E9C46A',
    },
    {
      title: 'Temps moyen',
      value: '28 min',
      change: '-3%',
      trend: 'down',
      icon: 'clock',
      iconBg: '#E76F51',
    },
    {
      title: 'Satisfaction client',
      value: '4.7/5',
      change: '+5%',
      trend: 'up',
      icon: 'star',
      iconBg: '#2A9D8F',
    }
  ];
}
