import { Download, FileIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { formatFileSize, type FileDto } from '@/clients/files-client';
import { cn } from '@/util/utils';
import { getFileIcon } from './utils';

interface MultiSelectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  files: FileDto[];
  selectedFileIds: Set<string>;
  onToggleFileSelection: (fileId: string) => void;
  onToggleSelectAll: () => void;
  downloadAsZip: boolean;
  onDownloadAsZipChange: (value: boolean) => void;
  onDownload: () => Promise<void>;
  isDownloading: boolean;
}

/**
 * Dialog pentru selectarea și descărcarea multiplă a fișierelor
 */
export function MultiSelectDialog({
  open,
  onOpenChange,
  files,
  selectedFileIds,
  onToggleFileSelection,
  onToggleSelectAll,
  downloadAsZip,
  onDownloadAsZipChange,
  onDownload,
  isDownloading,
}: MultiSelectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                onCheckedChange={onToggleSelectAll}
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
                onCheckedChange={(checked) => onDownloadAsZipChange(checked === true)}
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
                  onClick={() => onToggleFileSelection(file.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => onToggleFileSelection(file.id)}
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
                onClick={() => onOpenChange(false)}
                disabled={isDownloading}
              >
                Anulează
              </Button>
              <Button
                onClick={onDownload}
                disabled={selectedFileIds.size === 0 || isDownloading}
                className="text-primary-foreground bg-orange-500 hover:bg-orange-700 transition-colors"
              >
                {isDownloading ? (
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
  );
}
