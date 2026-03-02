import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { EnergyItem, EnergyConsumption, DashboardStats } from '../models/energy.model';

@Injectable({ providedIn: 'root' })
export class EnergyService {
  private items: EnergyItem[] = [];
  private itemsSubject = new BehaviorSubject<EnergyItem[]>(this.items);

  getItems(): Observable<EnergyItem[]> { return this.itemsSubject.asObservable(); }

  addItem(item: EnergyItem): void {
    this.items = [...this.items, item];
    this.itemsSubject.next(this.items);
  }

  getDashboardStats(): Observable<DashboardStats> {
    const total = this.items.reduce((s, i) => s + i.consumption, 0);
    const active = this.items.filter(i => i.status === 'active').length;
    const stats: DashboardStats = {
      totalItems: this.items.length,
      activeItems: active,
      totalConsumption: total,
      averageCost: 0,
      peakConsumption: Math.max(0, ...this.items.map(i => i.consumption))
    };
    return of(stats);
  }
}
