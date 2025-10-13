import { useState, useEffect } from 'react';

import { cn } from '@/util/utils';
import { FilePenLine } from 'lucide-react';

import { InputField } from '../InputField';
import { TextareaField } from '../TextareaField';

interface EditableInputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  type?: 'input' | 'textarea' | 'number';
  isLoading?: boolean;
  isEditable?: boolean;
  endIcon?: React.ReactNode;
}

export const EditableInputField = ({
  initialValue,
  onSave,
  className,
  type = 'input',
  isLoading,
  isEditable = false,
  endIcon,
  ...props
}: EditableInputFieldProps) => {
  const [value, setValue] = useState(initialValue);

  // Sync value with initialValue when it changes
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleBlur = async () => {
    if (value === initialValue) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(value);
      setIsEditing(false);
    } catch (error) {
      setValue(initialValue);
    } finally {
      setIsSaving(false);
    }
  };

  const handleValueChange = (newValue: string) => {
    if (type === 'number') {
      if (/^(\d+)?([.,]\d*)?$/.test(newValue) || newValue === '') {
        setValue(newValue.replace(',', '.'));
      }
    } else {
      setValue(newValue);
    }
  };

  const editIcon = isEditable && (
    <FilePenLine className="h-4 w-4 cursor-pointer text-muted-foreground" />
  );

  const iconToShow = isHovered ? editIcon : endIcon;

  const commonProps = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleValueChange(e.target.value),
    onBlur: handleBlur,
    className: cn(
      'transition-colors',
      isSaving && 'cursor-wait opacity-50',
      !isEditable && 'cursor-not-allowed bg-muted',
      type === 'textarea' && 'min-h-[100px] resize-y',
      className
    ),
    onClick: () => setIsEditing(true),
    disabled: isSaving || !isEditable,
    readOnly: !isEditing || !isEditable,
    endIcon: iconToShow,
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false),
    ...props,
  };

  return (
    <div className={cn('group w-full', !isEditable && 'opacity-50')}>
      {type === 'textarea' ? (
        <TextareaField {...commonProps} />
      ) : (
        <InputField {...commonProps} />
      )}
    </div>
  );
};
