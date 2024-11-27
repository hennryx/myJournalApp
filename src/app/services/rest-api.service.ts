import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  getAll(storageKey: string): any[] {
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : [];
  }

  create(item: any, storageKey: string): void {
    const items = this.getAll(storageKey);
    items.push(item);
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  update(id: number, updatedItem: any, storageKey: string): void {
    const items = this.getAll(storageKey);
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      items[index] = { ...items[index], ...updatedItem };
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }

  delete(id: number, storageKey: string): void {
    const items = this.getAll(storageKey);
    const filteredItems = items.filter((item) => item.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filteredItems));
  }
}
