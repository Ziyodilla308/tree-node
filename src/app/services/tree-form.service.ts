import { Injectable } from '@angular/core';
import { TreeNode } from '../models/tree-node.model';
import { TreeNodeFormGroup } from '../utils/form-utils';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class TreeFormService {
  constructor(private fb: FormBuilder) {}

  createNode(partial: Partial<TreeNode> = {}): TreeNodeFormGroup {
    return new FormGroup({
      id: this.fb.control<string | null>(partial.id ?? null),
      label: this.fb.control<string>(partial.label ?? '', {
        validators: [Validators.required],
        nonNullable: true
      }),
      isEditing: this.fb.control<boolean>(partial.isEditing ?? true, { nonNullable: true }),
      isExpanded: this.fb.control<boolean>(partial.isExpanded ?? true, { nonNullable: true }),
      children: this.fb.array<TreeNodeFormGroup>([])
    }) as TreeNodeFormGroup;
  }

  getChildren(node: TreeNodeFormGroup): FormArray<TreeNodeFormGroup> {
    return node.get('children') as FormArray<TreeNodeFormGroup>;
  }

  private buildFormFromNode(node: TreeNode, nodeMap: Map<string, TreeNode>): TreeNodeFormGroup {
    const form = this.createNode({ ...node, isEditing: false });
    const childrenArray = this.getChildren(form);

    (node.childrenIds ?? []).forEach(childId => {
      const childNode = nodeMap.get(childId);
      if (childNode) {
        childrenArray.push(this.buildFormFromNode(childNode, nodeMap));
      }
    });

    return form;
  }

  loadTreeFromJson(data: TreeNode[]): FormArray<TreeNodeFormGroup> {
    const formArray = new FormArray<TreeNodeFormGroup>([]);
    const nodeMap = new Map<string, TreeNode>();
    data.forEach(n => { if (n.id) nodeMap.set(n.id, n); });


    const allChildIds = new Set<string>();
    data.forEach(n => (n.childrenIds ?? []).forEach(id => allChildIds.add(id)));
    const rootNodes = data.filter(n => n.id && !allChildIds.has(n.id));
    rootNodes.forEach(r => formArray.push(this.buildFormFromNode(r, nodeMap)));

    return formArray;
  }
}
