import React, { useRef } from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatFileSize, type TempUploadDto } from '@/clients/files-client';
import { cn } from '@/util/utils';

interface FileUploaderProps {
  tempFiles: TempUploadDto[];
  isUploading: boolean;
  uploadProgress: number;
  onFilesSelected: (files: File[]) => void;
  onRemoveFile: (tempId: string) => void;
  disabled?: boolean;
  maxFiles?: number;
  acceptedFileTypes?: string; // ex: "image/*,.pdf,.doc,.docx"
  className?: string;
}

/**
 * Component generic pentru upload fișiere cu drag & drop
 * Afișează fișierele temporare înainte de commit
 */
export function FileUploader({
  tempFiles,
  isUploading,
  uploadProgress,
  onFilesSelected,
  onRemoveFile,
  disabled = false,
  maxFiles,
  acceptedFileTypes,
  className,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesSelected(files);
    }
    // Reset input pentru a permite re-upload același fișier
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesSelected(files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const canAddMoreFiles = !maxFiles || tempFiles.length < maxFiles;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
          isDragging && !disabled
            ? 'border-primary bg-primary/5'
            : 'border-gray-300 dark:border-gray-700',
          disabled && 'opacity-50 cursor-not-allowed',
          !disabled && 'cursor-pointer hover:border-primary hover:bg-accent/50'
        )}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />

        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        
        <p className="text-sm font-medium mb-1">
          {isDragging ? 'Eliberează fișierele aici' : 'Trage fișierele aici sau click pentru a selecta'}
        </p>
        
        <p className="text-xs text-muted-foreground">
          {acceptedFileTypes 
            ? `Tipuri acceptate: ${acceptedFileTypes}` 
            : 'Orice tip de fișier'}
          {maxFiles && ` (max ${maxFiles} fișiere)`}
        </p>

        {!canAddMoreFiles && (
          <p className="text-xs text-destructive mt-2">
            Ai atins limita maximă de {maxFiles} fișiere
          </p>
        )}
      </div>

      {/* Progress bar */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Se încarcă...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Lista fișierelor temporare */}
      {tempFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            Fișiere pregătite pentru salvare ({tempFiles.length})
          </h4>
          <div className="space-y-2">
            {tempFiles.map((file) => (
              <div
                key={file.tempId}
                className="flex items-center justify-between p-3 bg-accent/50 rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FileIcon className="h-5 w-5 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {file.filename}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.sizeBytes)}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveFile(file.tempId)}
                  disabled={disabled}
                  className="flex-shrink-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
