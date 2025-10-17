import React from 'react';
import { Download, FileIcon, Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { triggerFileDownload, triggerZipDownload, type FileDto } from '@/clients/files-client';
import { cn } from '@/util/utils';
import { FileListItem } from './FileListItem';
import { MultiSelectDialog } from './MultiSelectDialog';

interface FileListProps {
  files: FileDto[];
  isLoading?: boolean;
  onRefresh?: () => void;
  className?: string;
  emptyMessage?: string;
  // Props pentru drag & drop upload
  onFilesSelected?: (files: File[]) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}

/**
 * Component pentru afișarea și descărcarea fișierelor commit-uite
 * Cu suport pentru drag & drop upload când onFilesSelected este furnizat
 */
export function FileList({
  files,
  isLoading = false,
  onRefresh,
  className,
  emptyMessage = 'Nu există fișiere încărcate',
  onFilesSelected,
  isUploading = false,
  uploadProgress = 0,
}: FileListProps) {
  const [downloadingIds, setDownloadingIds] = React.useState<Set<string>>(new Set());
  const [isMultiSelectOpen, setIsMultiSelectOpen] = React.useState(false);
  const [selectedFileIds, setSelectedFileIds] = React.useState<Set<string>>(new Set());
  const [isDownloadingMultiple, setIsDownloadingMultiple] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const [downloadAsZip, setDownloadAsZip] = React.useState(true);

  const handleDownload = async (file: FileDto) => {
    if (downloadingIds.has(file.id)) return;

    setDownloadingIds(prev => new Set(prev).add(file.id));

    try {
      await triggerFileDownload(file.id, file.filename);
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  const handleMultiDownload = async () => {
    if (selectedFileIds.size === 0) return;

    setIsDownloadingMultiple(true);

    try {
      if (downloadAsZip) {
        const fileIds = Array.from(selectedFileIds);
        await triggerZipDownload(fileIds, 'fisiere.zip');
      } else {
        const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
        
        for (const file of selectedFiles) {
          await triggerFileDownload(file.id, file.filename);
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      setIsMultiSelectOpen(false);
      setSelectedFileIds(new Set());
    } catch (error) {
      console.error('Error downloading multiple files:', error);
    } finally {
      setIsDownloadingMultiple(false);
    }
  };

  const toggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(fileId)) {
        newSet.delete(fileId);
      } else {
        newSet.add(fileId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedFileIds.size === files.length) {
      setSelectedFileIds(new Set());
    } else {
      setSelectedFileIds(new Set(files.map(f => f.id)));
    }
  };

  // Drag & Drop handlers
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!onFilesSelected) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      onFilesSelected(droppedFiles);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFilesSelected && !isDragging) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    
    if (
      x <= rect.left ||
      x >= rect.right ||
      y <= rect.top ||
      y >= rect.bottom
    ) {
      setIsDragging(false);
    }
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center p-8', className)}>
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-sm text-muted-foreground">Se încarcă fișierele...</span>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className={cn('text-center p-8', className)}>
        <FileIcon className="mx-auto h-12 w-12 text-gray-400 mb-2" />
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        {onRefresh && (
          <Button
            variant="link"
            size="sm"
            onClick={onRefresh}
            className="mt-2"
          >
            Reîmprospătează
          </Button>
        )}
      </div>
    );
  }

  return (
    <div 
      className={cn('space-y-2 relative', className)}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {/* Overlay pentru drag & drop */}
      {isDragging && onFilesSelected && (
        <div className="absolute inset-0 z-50 bg-primary/10 border-2 border-dashed border-primary rounded-lg flex items-center justify-center backdrop-blur-sm pointer-events-none">
          <div className="text-center">
            <Upload className="h-12 w-12 mx-auto mb-2 text-primary" />
            <p className="text-lg font-semibold text-primary">Eliberează pentru a încărca</p>
          </div>
        </div>
      )}

      {/* Progress bar pentru upload */}
      {isUploading && uploadProgress > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Se încarcă fișierele...</span>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium">
          Fișiere ({files.length})
        </h4>
        <div className="flex items-center gap-2">
          {files.length > 1 && (
            <Button
              size="sm"
              onClick={() => setIsMultiSelectOpen(true)}
              className="text-white bg-orange-500 hover:bg-orange-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Descarcă fișiere...
            </Button>
          )}
          {onRefresh && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
            >
              Reîmprospătează
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <FileListItem
            key={file.id}
            file={file}
            isDownloading={downloadingIds.has(file.id)}
            onDownload={handleDownload}
          />
        ))}
      </div>

      <MultiSelectDialog
        open={isMultiSelectOpen}
        onOpenChange={setIsMultiSelectOpen}
        files={files}
        selectedFileIds={selectedFileIds}
        onToggleFileSelection={toggleFileSelection}
        onToggleSelectAll={toggleSelectAll}
        downloadAsZip={downloadAsZip}
        onDownloadAsZipChange={setDownloadAsZip}
        onDownload={handleMultiDownload}
        isDownloading={isDownloadingMultiple}
      />
    </div>
  );
}
