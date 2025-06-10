// services/tree-api.service.ts
import { Injectable } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
import { Observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class TreeApiService {
  constructor(private localStorage: LocalStorageService) {}

  getTree(): Observable<TreeNode[]> {
    return of(this.localStorage.getTree());
  }

  addTree(tree: TreeNode): Observable<TreeNode> {
    this.localStorage.addTree(tree);
    return of(tree);
  }

  updateTree(id: string, tree: TreeNode): Observable<TreeNode> {
    this.localStorage.updateTree(id, tree);
    return of(tree);
  }

  deleteTree(id: string): Observable<null> {
    this.localStorage.deleteTree(id);
    return of(null);
  }
}