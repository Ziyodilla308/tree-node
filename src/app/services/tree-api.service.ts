import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TreeNode } from '../models/tree-node.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TreeApiService {
  private apiUrl = 'http://localhost:3000/tree';

  constructor(private http: HttpClient) {}

  getTree(): Observable<TreeNode[]> {
    return this.http.get<TreeNode[]>(this.apiUrl);
  }

  addTree(tree: TreeNode): Observable<TreeNode> {
    return this.http.post<TreeNode>(this.apiUrl, tree);
  }

  updateTree(id: string, tree: TreeNode): Observable<TreeNode> {
    return this.http.put<TreeNode>(`${this.apiUrl}/${id}`, tree);
  }

  deleteTree(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  saveAllTree(tree: TreeNode[]) {
    return this.http.put('/api/tree', tree); // JSON Server uchun PUT
  }
}
