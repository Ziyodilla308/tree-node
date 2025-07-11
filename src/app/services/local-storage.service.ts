import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    private readonly STORAGE_KEY = 'tree_data';

    getTree(): any[] {
        const data = localStorage.getItem(this.STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    addTree(tree: any): void {
        const trees = this.getTree();
        trees.push(tree);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trees));
    }

    updateTree(id: string, tree: any): void {
        const trees = this.getTree();
        const index = trees.findIndex(t => t.id === id);
        if (index !== -1) {
            trees[index] = tree;
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trees));
        }
    }

    deleteTree(id: string): void {
        const trees = this.getTree();
        const filtered = trees.filter(t => t.id !== id);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    }

}