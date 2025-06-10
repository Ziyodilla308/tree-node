import { Routes } from '@angular/router';
import { TreeFormComponent } from './containers/tree-form/tree-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tree', pathMatch: 'full' }, // Root redirect
  { path: 'tree', component: TreeFormComponent },
];
