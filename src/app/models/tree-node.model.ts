export interface TreeNode {
  id?: string;
  label: string;
  isEditing?: boolean;
  isExpanded?: boolean;
  childrenIds?: string[];
}
