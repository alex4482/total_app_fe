import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { FileIcon, AlertTriangle } from 'lucide-react';

interface DuplicateFile {
  tempId: string;
  filename: string;
}

interface DuplicateFilesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicateFiles: DuplicateFile[];
  selectedOverwrites: Set<string>;
  onToggleFileOverwrite: (tempId: string) => void;
  onToggleAllOverwrites: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Dialog pentru selectarea fișierelor duplicate care trebuie suprascrise
 */
export function DuplicateFilesDialog({
  open,
  onOpenChange,
  duplicateFiles,
  selectedOverwrites,
  onToggleFileOverwrite,
  onToggleAllOverwrites,
  onConfirm,
  onCancel,
}: DuplicateFilesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Fișiere duplicate detectate
          </DialogTitle>
          <DialogDescription>
            Următoarele fișiere există deja. Bifează fișierele pe care vrei să le suprascrii.
            Fișierele nebifate vor fi păstrate (ambele versiuni).
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Select All checkbox */}
          <div className="flex items-center gap-2 p-3 border-b">
            <Checkbox
              id="select-all-overwrites"
              checked={selectedOverwrites.size === duplicateFiles.length && duplicateFiles.length > 0}
              onCheckedChange={onToggleAllOverwrites}
            />
            <label
              htmlFor="select-all-overwrites"
              className="text-sm font-medium cursor-pointer"
            >
              Selectează toate ({duplicateFiles.length})
            </label>
          </div>

          {/* List of duplicate files with checkboxes */}
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {duplicateFiles.map((file) => (
              <div
                key={file.tempId}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded hover:bg-muted cursor-pointer transition-colors"
                onClick={() => onToggleFileOverwrite(file.tempId)}
              >
                <Checkbox
                  id={`overwrite-${file.tempId}`}
                  checked={selectedOverwrites.has(file.tempId)}
                  onCheckedChange={() => onToggleFileOverwrite(file.tempId)}
                  onClick={(e) => e.stopPropagation()}
                />
                <FileIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <label
                  htmlFor={`overwrite-${file.tempId}`}
                  className="text-sm font-medium flex-1 cursor-pointer"
                >
                  {file.filename}
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedOverwrites.has(file.tempId) ? '🔄 Suprascrie' : '📁 Păstrează ambele'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Anulează
          </Button>
          <Button
            onClick={onConfirm}
            className="bg-orange-500 hover:bg-orange-700 text-white transition-colors"
          >
            Salvează ({selectedOverwrites.size} suprascrise, {duplicateFiles.length - selectedOverwrites.size} păstrate)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
