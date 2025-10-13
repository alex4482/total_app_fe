import React from 'react';
import { Paperclip, FileText } from 'lucide-react';

interface Attachment {
  id: string;
  name: string;
  type: string;
}

interface TenantAttachmentsProps {
  attachments: Attachment[];
  editMode: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const TenantAttachments: React.FC<TenantAttachmentsProps> = ({
  attachments,
  editMode,
  onDrop,
  onDragOver,
  onFileInput,
  fileInputRef,
}) => (
  <div className="flex flex-col w-64 min-w-[16rem] max-w-xs">
    <div className="font-semibold mb-2 flex items-center gap-2">
      <Paperclip className="w-5 h-5" /> Atasamente
    </div>
    <div className="flex-1 overflow-y-auto max-h-[340px] bg-background border rounded p-2 flex flex-col gap-2">
      {attachments.length === 0 && <span className="text-gray-400 text-sm">Niciun fisier atasat</span>}
      {attachments.map((file) => (
        <button
          key={file.id}
          className="flex items-center gap-2 px-2 py-1 bg-background border border-gray-200 rounded hover:bg-accent transition text-left"
          onClick={() => {
            alert('Descarca: ' + file.name);
          }}
          type="button"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm truncate max-w-[10rem]">{file.name}</span>
        </button>
      ))}
    </div>
    {editMode && (
      <div
        className="mt-3 border-2 border-dashed border-gray-300 rounded p-4 text-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={onFileInput}
        />
        <span className="text-gray-500">Trage aici fisiere sau apasa pentru a selecta</span>
      </div>
    )}
  </div>
);

export default TenantAttachments;
