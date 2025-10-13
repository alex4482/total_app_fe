import React, { useState } from 'react';
import EmailPresetsList from './EmailPresetsList';
import EmailPresetDetails from './EmailPresetDetails';
import EmailPresetFileDropzone from './EmailPresetFileDropzone';
import { mockEmailPresets } from './mockEmailPresets';

// Mock files for demo
const mockFiles = [
  { id: 'file1', name: 'factura_octombrie.pdf', size: 123456 },
  { id: 'file2', name: 'notificare_client.docx', size: 45678 },
  { id: 'file3', name: 'contract_colaborare.pdf', size: 234567 },
];

const EmailPresets: React.FC = () => {
  const [presets, setPresets] = useState([...mockEmailPresets]);
  const [selectedId, setSelectedId] = useState<string | null>(presets[0]?.id || null);
  const [editMode, setEditMode] = useState(false);
  const [formState, setFormState] = useState(() => presets.find(p => p.id === selectedId) || null);
  const [sendMode, setSendMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>(presets.map(p => p.id));
  const [files, setFiles] = useState(mockFiles);
  const [showDropzone, setShowDropzone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Select preset
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setFormState(presets.find(p => p.id === id) || null);
    // Nu reseta editMode dacă deja suntem în editMode pe același preset
    setEditMode(prev => (selectedId === id ? prev : false));
  };

  // Add new preset
  const handleAdd = () => {
    const newPreset = {
      id: 'new_' + Date.now(),
      name: '',
      recipients: [''],
      subject: '',
      message: '',
      keywords: [''],
    };
    setPresets([newPreset, ...presets]);
    setSelectedId(newPreset.id);
    setFormState(newPreset);
    setEditMode(true);
  };

  // Edit preset
  const handleEdit = () => {
    if (!editMode) setEditMode(true);
  };

  // Cancel changes
  const handleCancel = () => {
    setFormState(presets.find(p => p.id === selectedId) || null);
    setEditMode(false);
  };

  // Save changes
  const handleSave = () => {
    if (!formState) return;
    setPresets(prev => {
      const idx = prev.findIndex(p => p.id === formState.id);
      if (idx === -1) return prev;
      const arr = [...prev];
      arr[idx] = formState;
      return arr;
    });
    setEditMode(false);
  };

  // Toggle send mode
  const handleToggleSendMode = () => {
    setSendMode(v => !v);
    setSelectedIds(presets.map(p => p.id));
  };

  // Select/deselect preset in send mode
  const handleToggleSelect = (id: string) => {
    setSelectedIds(ids => ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id]);
  };

  // Dropzone logic (mock, just adds file to list)
  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(prev => [
      ...prev,
      ...newFiles.map((f, idx) => ({ id: 'mock_' + Date.now() + '_' + idx, name: f.name, size: f.size })),
    ]);
    setShowDropzone(false);
    setSuccess('Fișierele au fost încărcate cu succes!');
    setTimeout(() => setSuccess(null), 2000);
  };

  // Correlate files to presets by keywords
  const getPresetFiles = (preset: typeof presets[0]) => {
    if (!preset) return [];
    return files.filter(f => preset.keywords.some(k => k && f.name.toLowerCase().includes(k.toLowerCase())));
  };

  // Sumar fișiere
  const fileSummary = () => {
    const total = files.length;
    const size = files.reduce((acc, f) => acc + f.size, 0);
    return `${total} fișiere, ${(size / 1024).toFixed(1)} KB`;
  };

  // Validare preseturi selectate
  const validatePresets = () => {
    for (const p of presets.filter(p => selectedIds.includes(p.id))) {
      if (!p.name.trim()) return 'Numele presetului este obligatoriu';
      if (!p.recipients.some(r => r && r.includes('@'))) return 'Trebuie cel puțin un destinatar valid';
      if (!p.subject.trim()) return 'Subiectul nu poate fi gol';
      if (!p.message.trim()) return 'Mesajul nu poate fi gol';
    }
    if (files.length === 0) return 'Trebuie să adaugi cel puțin un fișier';
    return null;
  };

  // Simulare trimitere
  const handleSend = () => {
    setError(null);
    setSuccess(null);
    const validation = validatePresets();
    if (validation) {
      setError(validation);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess('Emailurile au fost trimise cu succes!');
      setTimeout(() => setSuccess(null), 2500);
    }, 2000);
  };

  return (
  <div className="flex h-screen bg-background overflow-hidden">
      {/* Lista de preseturi */}
      <div className="w-full max-w-xs flex flex-col bg-background border-r border-gray-200 overflow-y-auto">
        <div className="flex flex-col gap-2 p-2">
          <button
            className="px-4 py-2 rounded border border-green-600 text-white bg-green-600 hover:bg-green-700 transition-colors font-semibold"
            onClick={handleAdd}
            disabled={sendMode}
          >+ Adaugă preset</button>
          <button
            className={`px-4 py-2 rounded border font-semibold transition-colors ${sendMode ? 'border-yellow-500 text-yellow-800 bg-yellow-400 hover:bg-yellow-500' : 'border-purple-700 text-white bg-purple-700 hover:bg-purple-800'}`}
            onClick={handleToggleSendMode}
          >
            {sendMode ? 'Închide pregătirea' : 'Pregătește trimitere mailuri'}
          </button>
        </div>
        <EmailPresetsList
          presets={presets}
          selectedId={selectedId}
          onSelect={sendMode ? handleToggleSelect : handleSelect}
        />
      </div>
      {/* Detalii preset sau panou trimitere */}
      <div className="flex-1 flex flex-col bg-background">
        {sendMode ? (
          <div className="flex flex-col h-full">
            <div className="flex gap-2 p-4 border-b bg-background items-center">
              <button
                className="px-4 py-2 rounded border border-purple-700 text-white bg-purple-700 hover:bg-purple-800 transition-colors font-semibold"
                onClick={() => setShowDropzone(true)}
                disabled={loading}
              >Pregătește fișiere</button>
              <button
                className="px-4 py-2 rounded border border-green-600 text-white bg-green-600 hover:bg-green-700 transition-colors font-semibold"
                onClick={handleSend}
                disabled={loading}
              >{loading ? 'Se trimite...' : 'Trimite'}</button>
              <span className="ml-auto text-xs text-muted-foreground">{fileSummary()}</span>
            </div>
            {showDropzone && (
              <EmailPresetFileDropzone onFilesAdded={handleFilesAdded} onClose={() => setShowDropzone(false)} />
            )}
            <div className="flex-1 overflow-y-auto p-4">
              {error && <div className="mb-2 text-red-600 font-semibold">{error}</div>}
              {success && <div className="mb-2 text-green-600 font-semibold">{success}</div>}
              <div className="font-semibold mb-2">Corelații preseturi &rarr; fișiere</div>
              <div className="flex flex-col gap-4">
                {presets.filter(p => selectedIds.includes(p.id)).map(preset => (
                  <div key={preset.id} className="border rounded p-2 bg-background">
                    <div className="font-bold mb-1">{preset.name || <span className="italic text-muted-foreground">(fără nume)</span>}</div>
                    <div className="text-xs text-muted-foreground mb-1">Keyword-uri: {preset.keywords.filter(Boolean).join(', ')}</div>
                    <div className="flex flex-wrap gap-2">
                      {getPresetFiles(preset).length === 0 && <span className="text-xs italic text-muted-foreground">Niciun fișier asociat</span>}
                      {getPresetFiles(preset).map(f => (
                        <span key={f.id} className="px-2 py-1 bg-background rounded text-xs border border-gray-300">{f.name}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-2 p-4 border-b bg-background">
              {!editMode ? (
                <button
                  className="px-4 py-2 rounded border border-purple-700 text-white bg-purple-700 hover:bg-purple-800 transition-colors font-semibold"
                  onClick={handleEdit}
                >Modifică</button>
              ) : (
                <>
                  <button
                    type="button"
                    className="px-4 py-2 rounded border border-orange-500 text-white bg-orange-500 hover:bg-orange-600 transition-colors font-semibold"
                    onClick={handleCancel}
                  >Renunță</button>
                  <button
                    type="button"
                    className="px-4 py-2 rounded border border-green-600 text-white bg-green-600 hover:bg-green-700 transition-colors font-semibold"
                    onClick={handleSave}
                  >Salvează</button>
                </>
              )}
            </div>
            <div className="flex-1">
              <EmailPresetDetails
                preset={formState}
                setPreset={setFormState}
                editMode={editMode}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailPresets;
