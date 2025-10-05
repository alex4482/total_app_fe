import { Link } from 'react-router-dom';

import { Label } from '@/components/ui/label';
import { EditableInputField } from '@/components/TotalAppComponents';

import { Column } from '../hooks';

export const DetailField = ({
  column,
  tenantId,
  handleUpdateField,
}: {
  column: Column;
  tenantId: string;
  handleUpdateField: Function;
}) => (
  <div className="col-span-1">
    <Label className="mb-1 block font-medium">{column.label}</Label>
    {column.link ? (
      <span className="inline-block w-full rounded border bg-background p-2 font-normal">
        <Link to={column.link} className="text-yellow-500 hover:underline">
          {column.value}
        </Link>
      </span>
    ) : (
      <EditableInputField
        initialValue={column.value}
        onSave={newValue => handleUpdateField(tenantId, column.key, newValue)}
        isEditable={column.isEditable}
        className="w-full"
        endIcon={column.endIcon}
        type={column.type}
      />
    )}
  </div>
);
