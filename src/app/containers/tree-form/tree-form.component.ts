import { Component, OnInit } from '@angular/core';
import { FormArray } from '@angular/forms';
import { TreeFormService } from '../../services/tree-form.service';
import { TreeNodeFormGroup, formToJson, formToJsonSingle } from '../../utils/form-utils';
import { TreeApiService } from '../../services/tree-api.service';
import { TreeNodeComponent } from '../../components/tree-node/tree-node.component';
import { NgForOf } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { TreeNode } from '../../models/tree-node.model';

function childrenIdsUnchanged(form: TreeNodeFormGroup, json: TreeNode): boolean {
  const currentIds = form.controls.children.controls
    .map(c => c.controls.id.value)
    .filter((id): id is string => !!id)
    .sort();

  const jsonIds = (json.childrenIds ?? []).slice().sort();

  return JSON.stringify(currentIds) === JSON.stringify(jsonIds);
}

@Component({
  selector: 'app-tree-form',
  templateUrl: './tree-form.component.html',
  standalone: true,
  imports: [TreeNodeComponent, NgForOf],
  styleUrls: ['./tree-form.component.scss'],
})
export class TreeFormComponent implements OnInit {
  rootNodes = new FormArray<TreeNodeFormGroup>([]);

  constructor(
    private treeService: TreeFormService,
    private api: TreeApiService,
  ) {}

  ngOnInit(): void {
    this.api.getTree().subscribe(data => {
      this.rootNodes = this.treeService.loadTreeFromJson(data);
    });
  }

  addRootNode() {
    const newNode = this.treeService.createNode();
    this.rootNodes.push(newNode);
  }

  saveAllTree() {
    this.rootNodes.controls.forEach(group => {
      const json = formToJsonSingle(group);
      const id = group.controls.id.value;

      if (!json.label.trim()) return;

      if (!id) {
        const newId = uuidv4();
        json.id = newId;
        group.controls.id.setValue(newId);
        this.api.addTree(json).subscribe();
      } else {
        if (!group.dirty && childrenIdsUnchanged(group, json)) {
          return;
        }

        this.api.updateTree(id, json).subscribe(() => {
          group.markAsPristine();
        });
      }
    });
  }
}
