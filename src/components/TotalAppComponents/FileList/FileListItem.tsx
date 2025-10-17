import { Download, FileIcon, Loader2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize, type FileDto } from '@/clients/files-client';
import { formatUploadDate, getFileIcon } from './utils';

interface FileListItemProps {
  file: FileDto;
  isDownloading: boolean;
  onDownload: (file: FileDto) => void;
}

/**
 * Component pentru afișarea unui singur fișier în listă
 */
export function FileListItem({ file, isDownloading, onDownload }: FileListItemProps) {
  const fileIcon = getFileIcon(file.contentType);

  return (
    <div className="flex items-center gap-3 p-3 bg-background border rounded-lg hover:bg-accent/50 transition-colors">
      {/* Download button - STÂNGA */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onDownload(file)}
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
}
