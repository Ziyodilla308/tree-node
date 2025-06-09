import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {TreeNode} from '../models/tree-node.model';

export type TreeNodeFormGroup = FormGroup<{
  id: FormControl<string | null>;
  label: FormControl<string>;
  isEditing: FormControl<boolean>;
  isExpanded: FormControl<boolean>;
  children: FormArray<TreeNodeFormGroup>;
}>;

export function createTreeNodeForm(
  fb: FormBuilder,
  node: Partial<TreeNode> = {}
): TreeNodeFormGroup {
  return new FormGroup({
    id: new FormControl<string | null>(node.id ?? null),
    label: new FormControl<string>(node.label ?? '', Validators.required),
    isEditing: new FormControl<boolean>(node.isEditing ?? true),
    isExpanded: new FormControl<boolean>(node.isExpanded ?? true),
    children: new FormArray<TreeNodeFormGroup>([])
  }) as TreeNodeFormGroup;
}

export function formToJson(formArray: FormArray<TreeNodeFormGroup>): TreeNode[] {
  return formArray.controls
    .filter(group => group.controls.label.value.trim() !== '')
    .map(group => formToJsonSingle(group));
}

export function formToJsonSingle(group: TreeNodeFormGroup): TreeNode {
  return {
    id: group.controls.id.value ?? undefined,
    label: group.controls.label.value.trim(),
    isEditing: false,
    isExpanded: group.controls.isExpanded.value,
    childrenIds: group.controls.children.controls
      .map(child => child.controls.id.value)
      .filter((id): id is string => !!id)
  };
}
