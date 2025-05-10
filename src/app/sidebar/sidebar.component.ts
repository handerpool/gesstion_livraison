import { NgClass, NgFor } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
interface MenuItem {
  label: string;
  icon: string;
  route: string;
  active: boolean;
}
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NgClass,NgFor],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    {
      label: 'Tableau de bord',
      icon: 'fas fa-tachometer-alt',
      route: '/dashboard',
      active: false
    },
    {
      label: 'Commandes',
      icon: 'fas fa-shopping-cart',
      route: '/orders',
      active: false
    },
    {
      label: 'Livraisons',
      icon: 'fas fa-truck',
      route: '/deliveries',
      active: false
    },
    {
      label: 'Clients',
      icon: 'fas fa-users',
      route: '/clients',
      active: false
    },
    {
      label: 'Finances',
      icon: 'fas fa-chart-line',
      route: '/finance',
      active: false
    },
    {
      label: 'Paramètres',
      icon: 'fas fa-cog',
      route: '/settings',
      active: false
    }
  ];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Set active menu item based on current route
    this.setActiveMenuItem(this.router.url);
    
    // Subscribe to router events to update active menu item
    this.router.events.subscribe(() => {
      this.setActiveMenuItem(this.router.url);
    });
  }

  navigate(route: string, index: number): void {
    // Update active state
    this.menuItems.forEach(item => item.active = false);
    this.menuItems[index].active = true;
    
    // Navigate to the route
    this.router.navigate([route]);
  }

  private setActiveMenuItem(currentRoute: string): void {
    // Reset all active states
    this.menuItems.forEach(item => item.active = false);
    
    // Find and set the active menu item
    const activeItem = this.menuItems.find(item => currentRoute.startsWith(item.route));
    if (activeItem) {
      activeItem.active = true;
    } else {
      // Default to dashboard if no match
      this.menuItems[0].active = true;
    }
  }
}

