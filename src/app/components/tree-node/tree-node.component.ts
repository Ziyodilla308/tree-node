import { Component, Input } from '@angular/core';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { TreeNodeFormGroup, createTreeNodeForm, formToJsonSingle } from '../../utils/form-utils';
import { TreeFormService } from '../../services/tree-form.service';
import { TreeApiService } from '../../services/tree-api.service';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-tree-node',
  templateUrl: './tree-node.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, NgForOf, NgClass],
  styleUrls: ['./tree-node.component.scss'],
})
export class TreeNodeComponent {
  @Input() form!: TreeNodeFormGroup;
  @Input() parentArray!: FormArray<TreeNodeFormGroup>;
  @Input() index!: number;
  @Input() hasParent: boolean = false;
  @Input() isLast: boolean = false;

  constructor(
    public treeService: TreeFormService,
    private api: TreeApiService,
  ) {}

  get children(): FormArray<TreeNodeFormGroup> {
    return this.form.get('children') as FormArray<TreeNodeFormGroup>;
  }

  confirmLabel() {
    this.form.controls.isEditing.setValue(false);
    const label = this.form.controls.label.value.trim();

    if (!label) {
      this.parentArray.removeAt(this.index);
      return;
    }

    const json = formToJsonSingle(this.form);
    const id = this.form.controls.id.value;

    if (id) {
      this.api.updateTree(id, json).subscribe();
    } else {
      const newId = uuidv4();
      this.form.controls.id.setValue(newId);
      const newJson = { ...json, id: newId };
      this.api.addTree(newJson).subscribe();
    }
  }

  toggleExpand() {
    this.form.controls.isExpanded.setValue(!this.form.controls.isExpanded.value);
  }

  editNode() {
    this.form.controls.isEditing.setValue(true);
  }

  addChildNode() {
    const parentId = this.form.controls.id.value;
    const newId = uuidv4();

    const newNode = createTreeNodeForm(this.treeService['fb'], {
      id: newId,
      label: '',
      isExpanded: false,
      isEditing: true,
      childrenIds: [],
    });

    this.form.controls.isExpanded.setValue(true);
    this.children.push(newNode);
    this.api.addTree(formToJsonSingle(newNode)).subscribe();

    if (parentId) {
      const updatedParent = formToJsonSingle(this.form);
      this.api.updateTree(parentId, updatedParent).subscribe();
    }
  }

  removeNode() {
    const id = this.form.controls.id.value;
    if (!id) return;

    this.api.deleteTree(id).subscribe(() => {
      this.parentArray.removeAt(this.index);

      const root = this.findRootForm(this.form);
      const rootJson = formToJsonSingle(root);
      if (root.controls.id.value) {
        this.api.updateTree(root.controls.id.value, rootJson).subscribe();
      }
    });
  }

  private findRootForm(node: TreeNodeFormGroup): TreeNodeFormGroup {
    let current: any = node;
    while (current.parent && !(current.parent instanceof FormArray)) {
      current = current.parent;
    }
    return current;
  }
}
