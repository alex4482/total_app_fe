import { Observation, ObservationUrgency } from '@/types/Observation';
import { useState } from 'react';

interface ObservationsIndentProps {
  observations: Observation[];
  parentId: string;
  onAddObservation?: (parentId: string, obs: Observation) => Promise<void>;
  onUpdateObservation?: (parentId: string, obs: Observation) => Promise<void>;
  onDeleteObservation?: (parentId: string, obsId: string) => Promise<void>;
  onSave?: (parentId: string, field: string, value: Observation[]) => Promise<void>;
  isEditable?: boolean;
}

function urgencyBadgeClass(u: ObservationUrgency) {
  switch (u) {
    case ObservationUrgency.URGENT:
      return "bg-red-500/15 text-red-600 ring-1 ring-red-500/30";
    case ObservationUrgency.SIMPLE:
      return "bg-yellow-500/15 text-yellow-700 ring-1 ring-yellow-500/30";
    default:
      return "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/30";
  }
}

export default function ObservationsIndent({
  observations,
  parentId,
  onSave,
  isEditable = false,
}: ObservationsIndentProps) {
  const [items, setItems] = useState<Observation[]>(observations);
  const [newText, setNewText] = useState("");
  const [newUrgency, setNewUrgency] = useState<ObservationUrgency>(ObservationUrgency.SIMPLE);

  const urgencyLabel: Record<ObservationUrgency, string> = {
    SIMPLE: "Simplu",
    URGENT: "Urgent",
    TODO: "De facut",
  };

  // handler
  const handleUrgencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewUrgency(e.target.value as ObservationUrgency);
  };

  const handleSave = async (value: Observation[]) => {
    if (onSave) {
      await onSave(parentId, 'observations', value);
    }
  };

  const handleUpdate = async (idx: number, patch: Partial<Observation>) => {
    const updated = { ...items[idx], ...patch };
    const next = [...items];
    next[idx] = updated;
    setItems(next);
    handleSave(items);
    //if (onUpdateObservation) await onUpdateObservation(parentId, updated);
  };

  const handleAdd = async () => {
    if (!newText.trim()) return;
    const obs: Observation = {
      id: `obs_${Date.now()}`,
      message: newText.trim(),
      type: newUrgency,
    };
    const next = [obs, ...items];
    setItems(next);
    setNewText("");
    setNewUrgency(ObservationUrgency.SIMPLE);
    handleSave(items);
    // if (onAddObservation) await onAddObservation(parentId, obs);
  };

  const handleDelete = async (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    handleSave(items);
    // if (onDeleteObservation) await onDeleteObservation(parentId, obs.id);
  };

  return (
    <div className="space-y-3">
      {/* Add new */}
      {isEditable && (
        <div className="rounded-2xl border p-3 flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <select
              value={newUrgency}
              onChange={handleUrgencyChange}
              className="rounded-lg border px-2 py-1 text-sm"
            >
              <option value={ObservationUrgency.SIMPLE}>{urgencyLabel.SIMPLE}</option>
              <option value={ObservationUrgency.TODO}>{urgencyLabel.TODO}</option>
              <option value={ObservationUrgency.URGENT}>{urgencyLabel.URGENT}</option>
            </select>
            <button
              onClick={handleAdd}
              className="ml-auto rounded-xl border px-3 py-1 text-sm hover:bg-accent"
            >
              Adaugă observație
            </button>
          </div>
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Scrie observația…"
            rows={3}
            className="w-full rounded-xl border p-2"
          />
        </div>
      )}

      {/* List */}
      <ul className="space-y-2">
        {items.map((obs, idx) => (
          <li
            key={obs.id}
            className="rounded-2xl border p-3 flex flex-col gap-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${urgencyBadgeClass(
                  obs.type
                )}`}
              >
                Tip: {urgencyLabel[obs.type]}
              </span>

              <select
                disabled={!isEditable}
                value={obs.type}
                onChange={(e) =>
                  handleUpdate(idx, { type: e.target.value as ObservationUrgency })
                }
                className={`rounded-lg border px-2 py-1 text-xs ${
                  !isEditable ? "opacity-60 pointer-events-none" : ""
                }`}
                aria-label="Setează tipul"
              >
                <option value={ObservationUrgency.SIMPLE}>{urgencyLabel.SIMPLE}</option>
                <option value={ObservationUrgency.TODO}>{urgencyLabel.TODO}</option>
                <option value={ObservationUrgency.URGENT}>{urgencyLabel.URGENT}</option>
              </select>

            </div>

            {isEditable ? (
              <textarea
                value={obs.message}
                onChange={(e) => handleUpdate(idx, { message: e.target.value })}
                className="w-full rounded-xl border p-2"
                rows={3}
              />
            ) : (
              <p className="whitespace-pre-wrap leading-relaxed">{obs.message}</p>
            )}

            {isEditable && (
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => handleDelete(idx)}
                  className="rounded-xl border px-3 py-1 text-sm hover:bg-destructive/10 hover:text-destructive"
                >
                  Șterge
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>);
}
