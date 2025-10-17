import React from 'react';
import { Download, FileIcon, Loader2, Calendar, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { formatFileSize, triggerFileDownload, triggerZipDownload, type FileDto } from '@/clients/files-client';
import { cn } from '@/util/utils';

/**
 * Formatează data upload-ului într-un format citibil
 */
const formatUploadDate = (dateString?: string): string | null => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    // Dacă e de azi, arată timpul
    if (diffDays === 0) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `Astăzi, ${hours}:${minutes}`;
    }

    // Dacă e de ieri
    if (diffDays === 1) {
      return 'Ieri';
    }

    // Dacă e în ultimele 7 zile
    if (diffDays < 7) {
      return `Acum ${diffDays} zile`;
    }

    // Altfel, arată data completă
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  } catch {
    return null;
  }
};

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
  const [downloadAsZip, setDownloadAsZip] = React.useState(true); // Default: descarcă ca ZIP

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
        // Descarcă toate fișierele ca ZIP - un singur dialog de download!
        const fileIds = Array.from(selectedFileIds);
        await triggerZipDownload(fileIds, 'fisiere.zip');
      } else {
        // Descarcă fișierele individual (pe rând)
        const selectedFiles = files.filter(f => selectedFileIds.has(f.id));
        
        for (const file of selectedFiles) {
          await triggerFileDownload(file.id, file.filename);
          // Pauză mică între descărcări pentru a evita supraîncărcarea
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      // Închide dialog-ul și resetează selecția
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
    
    // Verifică dacă mouse-ul a ieșit cu adevărat din zona container-ului
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

  const getFileIcon = (contentType: string) => {
    if (contentType.startsWith('image/')) {
      return '🖼️';
    } else if (contentType.includes('pdf')) {
      return '📄';
    } else if (contentType.includes('word') || contentType.includes('document')) {
      return '📝';
    } else if (contentType.includes('sheet') || contentType.includes('excel')) {
      return '📊';
    } else if (contentType.includes('zip') || contentType.includes('archive')) {
      return '📦';
    }
    return null;
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
        <h4 className="text-sm font-medium ">
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
        {files.map((file) => {
          const isDownloading = downloadingIds.has(file.id);
          const fileIcon = getFileIcon(file.contentType);

          return (
            <div
              key={file.id}
              className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-accent/50 transition-colors"
            >
              {/* Download button - STÂNGA */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(file)}
                disabled={isDownloading}
                className="flex-shrink-0 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                {isDownloading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </Button>

              {/* File icon */}
              <div className="flex-shrink-0 text-2xl">
                {fileIcon || <FileIcon className="h-5 w-5 text-primary" />}
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" title={file.filename}>
                  {file.filename}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatFileSize(file.sizeBytes)}</span>
                  <span>•</span>
                  <span className="truncate" title={file.contentType}>
                    {file.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                  {(() => {
                    // Prioritate uploadedAt (când a fost încărcat pe server)
                    const uploadDate = formatUploadDate(file.uploadedAt);
                    const modifiedDate = formatUploadDate(file.modifiedAt);
                    
                    if (uploadDate || modifiedDate) {
                      return (
                        <>
                          <span>•</span>
                          <span 
                            className="flex items-center gap-1" 
                            title={
                              uploadDate && modifiedDate
                                ? `Modificat: ${file.modifiedAt}\nÎncărcat: ${file.uploadedAt}`
                                : file.uploadedAt || file.modifiedAt || ''
                            }
                          >
                            <Calendar className="h-3 w-3" />
                            {uploadDate || modifiedDate}
                          </span>
                        </>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dialog pentru descărcare multiplă */}
      <Dialog open={isMultiSelectOpen} onOpenChange={setIsMultiSelectOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Descarcă fișiere</DialogTitle>
            <DialogDescription>
              Selectează fișierele pe care vrei să le descarci
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            {/* Opțiuni de descărcare */}
            <div className="flex items-center justify-between p-3 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFileIds.size === files.length && files.length > 0}
                  onCheckedChange={toggleSelectAll}
                  id="select-all"
                />
                <label
                  htmlFor="select-all"
                  className="text-sm font-medium cursor-pointer"
                >
                  Selectează toate ({files.length})
                </label>
              </div>
              
              {/* Checkbox pentru descărcare ZIP */}
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={downloadAsZip}
                  onCheckedChange={(checked) => setDownloadAsZip(checked === true)}
                  id="download-as-zip"
                />
                <label
                  htmlFor="download-as-zip"
                  className="text-sm cursor-pointer"
                  title="Descarcă toate fișierele într-o singură arhivă ZIP"
                >
                  📦 Descarcă ca ZIP
                </label>
              </div>
            </div>

            {/* Lista de fișiere cu checkboxuri */}
            <div className="space-y-2 p-2">
              {files.map((file) => {
                const isSelected = selectedFileIds.has(file.id);
                const fileIcon = getFileIcon(file.contentType);

                return (
                  <div
                    key={file.id}
                    className={cn(
                      "flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors",
                      isSelected ? "bg-primary/10 border-primary" : "hover:bg-accent/50"
                    )}
                    onClick={() => toggleFileSelection(file.id)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      id={`file-${file.id}`}
                    />

                    <div className="flex-shrink-0 text-2xl">
                      {fileIcon || <FileIcon className="h-5 w-5 text-primary" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={file.filename}>
                        {file.filename}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatFileSize(file.sizeBytes)}</span>
                        <span>•</span>
                        <span className="truncate" title={file.contentType}>
                          {file.contentType.split('/')[1]?.toUpperCase() || 'FILE'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-muted-foreground">
                {selectedFileIds.size} {selectedFileIds.size === 1 ? 'fișier selectat' : 'fișiere selectate'}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsMultiSelectOpen(false)}
                  disabled={isDownloadingMultiple}
                >
                  Anulează
                </Button>
                <Button
                  onClick={handleMultiDownload}
                  disabled={selectedFileIds.size === 0 || isDownloadingMultiple}
                  className="text-primary-foreground bg-orange-500 hover:bg-orange-700 transition-colors"
                >
                  {isDownloadingMultiple ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Se descarcă...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Descarcă ({selectedFileIds.size})
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
