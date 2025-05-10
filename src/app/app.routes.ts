import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { DeliveriesComponent } from './deliveries/deliveries.component';
import { ClientsComponent } from './clients/clients.component';
import { NgModule } from '@angular/core';
import { FinanceComponent } from './finance/finance.component';
import { SettingsComponent } from './settings/settings.component';

export const routes: Routes = [ 
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'orders', component: OrdersComponent },
    { path: 'deliveries', component: DeliveriesComponent },
    { path: 'clients', component: ClientsComponent },
    { path: 'finance', component: FinanceComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '**', redirectTo: '/dashboard' }
  ];
  
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule] 
  })
  export class AppRoutingModule { }
