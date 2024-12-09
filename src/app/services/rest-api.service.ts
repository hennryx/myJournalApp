import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class RestApiService {

    getAll(storageKey: string): any[] {
        const data = localStorage.getItem(storageKey);
        if (!data) return [];

        return JSON.parse(data).sort((a: any, b: any) => {
            const dateA = new Date(a?.date);
            const dateB = new Date(b?.date);
            return dateB.getTime() - dateA.getTime();
        });
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
        const itemToDelete = items.find((item) => item.id === id);

        if (itemToDelete) {
            const filteredItems = items.filter((item) => item.id !== id);
            localStorage.setItem(storageKey, JSON.stringify(filteredItems));

            const deletedItems = this.getAll('delete');
            const updatedItem = {
                ...itemToDelete,
                deletedFrom: storageKey,
                deletedAt: new Date().toISOString()
            };
            deletedItems.push(updatedItem);
            localStorage.setItem('delete', JSON.stringify(deletedItems));
        }
    }

    deletePermanent(id: number, storageKey: string): void {
        const items = this.getAll(storageKey);
        const filteredItems = items.filter((item) => item.id !== id);
        localStorage.setItem(storageKey, JSON.stringify(filteredItems));
    }

    restoreItem(id: number): void {
        const deletedItems = this.getAll('delete');
        const itemToRestore = deletedItems.find((item) => item.id === id);

        if (itemToRestore) {
            const filteredDeletedItems = deletedItems.filter((item) => item.id !== id);
            localStorage.setItem('delete', JSON.stringify(filteredDeletedItems));

            const originalStorage = itemToRestore.deletedFrom;
            delete itemToRestore.deletedFrom;
            delete itemToRestore.deletedAt;  

            const originalItems = this.getAll(originalStorage);
            originalItems.push(itemToRestore);
            localStorage.setItem(originalStorage, JSON.stringify(originalItems));
        }
    }
}
