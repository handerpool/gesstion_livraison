import { NgFor, NgIf } from '@angular/common';
import { Component, Input, SimpleChanges, OnChanges } from '@angular/core';
import { Client } from '../models/client.model';

interface CityLocation {
    city: string;
    codePostale: string;
    count: number;
    addresses: string[];
}

@Component({
    selector: 'app-top-locations',
    standalone: true,
    imports: [NgFor, NgIf],
    templateUrl: './top-locations.component.html',
    styleUrl: './top-locations.component.css',
})
export class TopLocationsComponent implements OnChanges {
    @Input() set locations(data: Client[]) {
    this.commandes = this.extractOrderAddresses(data);
    this.cityLocations = this.groupByCity(this.commandes);
    this.updateActiveZone();
    }
    activeZone: CityLocation | null = null;
    commandes: any[] = [];
    cityLocations: CityLocation[] = [];

    ngOnChanges(changes: SimpleChanges): void {
    if (changes['locations'] && changes['locations'].currentValue?.length > 0) {
        this.updateActiveZone();
    } else {
        console.log('البيانات غير متوفرة أو فارغة');
    }
}
    private updateActiveZone(): void {
        if (this.cityLocations.length === 0) {
            this.activeZone = null;
            return;
        }
        
        // Find the city with the most orders
        this.activeZone = this.cityLocations.reduce(
            (max, location) => 
                location.count > max.count ? location : max,
            this.cityLocations[0]
        );
    }

    private extractOrderAddresses(clients: Client[]): any[] {
        const addressMap = new Map<string, any>();
        
        clients.forEach(client => {
            if (client.commandes) {
                client.commandes.forEach(cmd => {
                    const key = `${cmd.adresse}-${cmd.codePostale}`;
                    if (!addressMap.has(key)) {
                        addressMap.set(key, {
                            adresse: cmd.adresse,
                            codePostale: cmd.codePostale,
                            count: 1,
                            clientName: `${client.nom} ${client.prenom}`
                        });
                    } else {
                        const existing = addressMap.get(key);
                        existing.count += 1;
                    }
                });
            }
        });
        
        return Array.from(addressMap.values())
            .sort((a, b) => b.count - a.count);
    }

    private groupByCity(orders: any[]): CityLocation[] {
        const cityMap = new Map<string, CityLocation>();
        
        orders.forEach(order => {
            const city = this.getCityName(order);
            const key = `${city}-${order.codePostale}`;
            
            if (!cityMap.has(key)) {
                cityMap.set(key, {
                    city: city,
                    codePostale: order.codePostale,
                    count: 1,
                    addresses: [order.adresse]
                });
            } else {
                const existing = cityMap.get(key)!;
                existing.count += 1;
                if (!existing.addresses.includes(order.adresse)) {
                    existing.addresses.push(order.adresse);
                }
            }
        });
        
        return Array.from(cityMap.values())
            .sort((a, b) => b.count - a.count);
    }

    getCityName(item: any): string {
        if (!item.adresse) return 'Zone inconnue';
        
        const parts = item.adresse.split(',');
        if (parts.length > 1) {
            return parts[parts.length - 1].trim();
        }
        return parts[0];
    }

    getZoneName(item: any): string {
        return this.getCityName(item);
    }

    calculateProgressWidth(location: CityLocation): number {
        const maxCount = this.cityLocations.length > 0 ? 
            Math.max(...this.cityLocations.map(c => c.count)) : 1;
        return (location.count / maxCount) * 100;
    }
}