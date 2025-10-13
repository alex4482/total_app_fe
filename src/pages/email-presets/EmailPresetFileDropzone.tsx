import React, { useRef, useState } from 'react';

type EmailPresetFileDropzoneProps = {
  onFilesAdded: (files: File[]) => void;
  onClose: () => void;
};

const EmailPresetFileDropzone: React.FC<EmailPresetFileDropzoneProps> = ({ onFilesAdded, onClose }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length) handleFiles(files);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length) handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setTimeout(() => {
      setSelectedFiles(files);
      setLoading(false);
      setSuccess('Fișierele au fost selectate!');
      setTimeout(() => setSuccess(null), 1200);
    }, 600);
  };

  const handleConfirm = () => {
    if (selectedFiles.length === 0) {
      setError('Selectează cel puțin un fișier!');
      return;
    }
    setLoading(true);
    setError(null);
    setTimeout(() => {
      onFilesAdded(selectedFiles);
      setLoading(false);
      setSelectedFiles([]);
    }, 400);
  };

  const fileSummary = () => {
    const total = selectedFiles.length;
    const size = selectedFiles.reduce((acc, f) => acc + f.size, 0);
    return `${total} fișiere, ${(size / 1024).toFixed(1)} KB`;
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-background border rounded-lg p-8 flex flex-col items-center gap-4 min-w-[320px]" onClick={e => e.stopPropagation()}>
        <div
          className="w-full h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-center cursor-pointer bg-background"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          Trage fișiere aici sau apasă pentru a selecta
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
        {selectedFiles.length > 0 && (
          <div className="text-xs text-muted-foreground">{fileSummary()}</div>
        )}
        {error && <div className="text-red-600 font-semibold text-xs">{error}</div>}
        {success && <div className="text-green-600 font-semibold text-xs">{success}</div>}
        <div className="flex gap-2 mt-2">
          <button className="text-xs text-muted-foreground underline" onClick={onClose} disabled={loading}>Renunță</button>
          <button className="text-xs text-blue-700 underline" onClick={handleConfirm} disabled={loading || selectedFiles.length === 0}>Confirmă</button>
        </div>
      </div>
    </div>
  );
};

export default EmailPresetFileDropzone;
