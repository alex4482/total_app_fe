import { Button } from '@/components/ui/button';
import { FileList } from '@/components/TotalAppComponents';
import { FileIcon } from 'lucide-react';
import { formatFileSize } from '@/clients/files-client';
import type { TempUploadDto, FileDto } from '@/clients/files-client';

interface TenantFilesSectionProps {
  tenantId: string | undefined;
  committedFiles: FileDto[];
  tempFiles: TempUploadDto[];
  isLoadingFiles: boolean;
  isUploading: boolean;
  isCommitting: boolean;
  uploadProgress: number;
  error: string | null;
  onLoadFiles: () => void;
  onUploadFiles: (files: File[]) => void;
  onCommitFiles: () => void;
  onRemoveTempFile: (tempId: string) => void;
  onClearTempFiles: () => void;
}

/**
 * Secțiunea de gestionare a fișierelor pentru un tenant
 */
export function TenantFilesSection({
  tenantId,
  committedFiles,
  tempFiles,
  isLoadingFiles,
  isUploading,
  isCommitting,
  uploadProgress,
  error,
  onLoadFiles,
  onUploadFiles,
  onCommitFiles,
  onRemoveTempFile,
  onClearTempFiles,
}: TenantFilesSectionProps) {
  // Afișează secțiunea doar pentru tenanți existenți
  if (!tenantId || tenantId === '') {
    return (
      <div className="border-t pt-6">
        <div className="text-center p-6 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Salvează mai întâi chiriașul pentru a putea încărca fișiere
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t pt-4">
      <div className="flex items-center mb-4 gap-2">
        <h3 className="text-lg font-semibold">Fișiere Atașate</h3>
        <div className="text-sm text-muted-foreground">
          - Trage fișiere aici pentru a le încărca
        </div>
      </div>

      {/* FileList unificat cu drag & drop */}
      <FileList
        files={committedFiles}
        isLoading={isLoadingFiles}
        onRefresh={onLoadFiles}
        emptyMessage="Nu există fișiere încărcate. Trage fișiere aici pentru a le încărca."
        onFilesSelected={onUploadFiles}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
      />

      {/* Fișiere temporare + butoane commit */}
      {tempFiles.length > 0 && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/50 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm">Fișiere în așteptare ({tempFiles.length})</h4>
          </div>
          
          <div className="space-y-2">
            {tempFiles.map((file) => (
              <div
                key={file.tempId}
                className="flex items-center justify-between p-2 bg-background border rounded"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <FileIcon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">{file.filename}</span>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatFileSize(file.sizeBytes)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveTempFile(file.tempId)}
                  disabled={isCommitting}
                  className="flex-shrink-0"
                >
                  ✕
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-start gap-2 pt-2">
            <Button
              onClick={onCommitFiles}
              disabled={isCommitting}
              className="bg-orange-500 hover:bg-orange-700 text-white transition-colors"
            >
              {isCommitting ? 'Se salvează...' : 'Salvează Fișiere'}
            </Button>
            <Button
              variant="outline"
              onClick={onClearTempFiles}
              disabled={isCommitting}
            >
              Anulează
            </Button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-destructive">
          {error}
        </div>
      )}
    </div>
  );
}
