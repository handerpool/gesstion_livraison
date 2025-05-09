import { NgClass, NgFor } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass,NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems = [
    { icon: 'home', label: 'Tableau de bord', route: '/dashboard', active: false },
    { icon: 'package', label: 'Commandes', route: '/orders', active: false },
    { icon: 'truck', label: 'Livraisons', route: '/deliveries', active: false },
    { icon: 'users', label: 'Clients', route: '/customers', active: false },
    { icon: 'dollar-sign', label: 'Finances', route: '/finances', active: false },
    { icon: 'settings', label: 'Paramètres', route: '/settings', active: false }
  ];

  constructor(private router: Router) {
    // Set active menu item based on current route
    this.setActiveFromRoute(this.router.url);
  }

  setActiveFromRoute(route: string): void {
    this.menuItems.forEach(item => {
      item.active = item.route === route;
    });
  }

  navigate(route: string, index: number): void {
    this.menuItems.forEach((item, i) => {
      item.active = i === index;
    });
    this.router.navigate([route]);
  }
}
