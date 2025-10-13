import React from 'react';
import { EditableInputField } from '@/components/TotalAppComponents/EditableInputField/EditableInputField';
import { ObservationUrgency, Observation } from '@/types/Observation';

interface TenantDetailsFormProps {
  name: string;
  setName: (v: string) => void;
  cui: string;
  setCui: (v: string) => void;
  emails: string[];
  setEmails: (v: string[]) => void;
  phoneNumbers: string[];
  setPhoneNumbers: (v: string[]) => void;
  observations: Observation[];
  setObservations: (v: Observation[]) => void;
  pf: boolean;
  setPf: (v: boolean) => void;
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  currentTenant: any;
  handleSave: () => void;
}

const TenantDetailsForm: React.FC<TenantDetailsFormProps> = ({
  name, setName, cui, setCui, emails, setEmails, phoneNumbers, setPhoneNumbers, observations, setObservations, pf, setPf, editMode, setEditMode, currentTenant, handleSave
}) => {
  // ...handlers for add/remove/update emails, phones, observations
  const handleAddEmail = () => setEmails([...emails, '']);
  const handleRemoveEmail = (idx: number) => setEmails(emails.filter((_, i) => i !== idx));
  const handleUpdateEmail = (idx: number, value: string) => setEmails(emails.map((e, i) => i === idx ? value : e));

  const handleAddPhone = () => setPhoneNumbers([...phoneNumbers, '']);
  const handleRemovePhone = (idx: number) => setPhoneNumbers(phoneNumbers.filter((_, i) => i !== idx));
  const handleUpdatePhone = (idx: number, value: string) => setPhoneNumbers(phoneNumbers.map((p, i) => i === idx ? value : p));

  const handleAddObservation = () => setObservations([...observations, { id:'obs_' + Date.now(), message: '', type: ObservationUrgency.SIMPLE }]);
  const handleRemoveObservation = (idx: number) => setObservations(observations.filter((_, i) => i !== idx));
  const handleUpdateObservation = (idx: number, value?: string, type?: ObservationUrgency | string) =>
    setObservations(observations.map((obs, i) =>
      i === idx
        ? { ...obs, ...(value !== undefined ? { message: value } : {}), ...(type !== undefined ? { type: type as ObservationUrgency } : {}) }
        : obs
    ));

  return (
    <div className="flex-1 flex flex-col rounded p-6 gap-4 bg-background min-w-[16rem] max-w-md">
      <div className="flex gap-2 mb-2">
        <button
          className={`px-4 py-1 rounded text-white font-semibold transition ${editMode ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-600 hover:bg-green-700'}`}
          onClick={() => {
            if (editMode && currentTenant) {
              setName(currentTenant.name || '');
              setCui(currentTenant.cui || '');
              setEmails(currentTenant.emails || []);
              setPhoneNumbers(currentTenant.phoneNumbers || []);
              setObservations(currentTenant.observations || []);
              setPf(currentTenant.pf || false);
              setEditMode(false);
            } else {
              setEditMode(true);
            }
          }}
        >
          {editMode ? 'Renunta la schimbari' : 'Editeaza'}
        </button>
        {editMode && (
          <button
            className="px-4 py-1 rounded text-white font-semibold transition bg-green-600 hover:bg-green-700"
            onClick={handleSave}
          >
            Salveaza
          </button>
        )}
      </div>
      <span className="self-end text-xs text-gray-400 select-text mb-1">{currentTenant.id}</span>
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <label className="font-semibold min-w-[60px]">Nume</label>
          <EditableInputField
            initialValue={name}
            onSave={async (val) => setName(val)}
            isEditable={editMode}
            className="max-w-xs w-full"
          />
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
          <label className="font-semibold min-w-[60px]">CUI</label>
          <EditableInputField
            initialValue={cui}
            onSave={async (val) => setCui(val)}
            isEditable={editMode}
            className="max-w-xs w-full"
          />
        </div>
        <div className="font-semibold flex flex-col gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[2.2rem]">
            <span className="min-w-[80px]">Emailuri</span>
            {editMode && (
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                title="Add"
                onClick={handleAddEmail}
              >
                +
              </button>
            )}
          </div>
          {emails.map((email, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[2.2rem]">
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                  title="Remove"
                  onClick={() => handleRemoveEmail(idx)}
                >
                  -
                </button>
              )}
              <EditableInputField
                initialValue={email}
                onSave={async (val) => handleUpdateEmail(idx, val)}
                isEditable={editMode}
                className="max-w-xs w-full"
              />
            </div>
          ))}
        </div>
        <div className="font-semibold flex flex-col gap-1">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[2.2rem]">
            <span className="min-w-[80px]">Telefoane</span>
            {editMode && (
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                title="Add"
                onClick={handleAddPhone}
              >
                +
              </button>
            )}
          </div>
          {phoneNumbers.map((phone, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-h-[2.2rem]">
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                  title="Remove"
                  onClick={() => handleRemovePhone(idx)}
                >
                  -
                </button>
              )}
              <EditableInputField
                initialValue={phone}
                onSave={async (val) => handleUpdatePhone(idx, val)}
                isEditable={editMode}
                className="max-w-xs w-full"
              />
            </div>
          ))}
        </div>
        <label className="font-semibold flex items-center gap-2">PF
          <input
            type="checkbox"
            checked={pf}
            disabled={!editMode}
            className="form-checkbox h-5 w-5 text-blue-600"
            onChange={() => {
              if (editMode) setPf(!pf);
            }}
          />
        </label>
        <div className="font-semibold flex items-center gap-2">
          Activ:
          {currentTenant.active ? (
            <span className="px-2 py-1 rounded text-white bg-green-600">ACTIV</span>
          ) : (
            <span className="px-2 py-1 rounded text-white bg-orange-400">INACTIV</span>
          )}
        </div>
          <div className="font-semibold flex flex-col gap-1">
            <div className="flex items-center gap-2 min-h-[2.2rem]">
              <span className="min-w-[80px]">Observatii</span>
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                  title="Add"
                  onClick={handleAddObservation}
                >
                  +
                </button>
              )}
            </div>
            {observations.map((obs, idx) => (
              <div key={idx} className="flex items-center gap-2 min-h-[2.2rem]">
                {editMode && (
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                    title="Remove"
                    onClick={() => handleRemoveObservation(idx)}
                  >
                    -
                  </button>
                )}
                <EditableInputField
                  initialValue={obs.message}
                  onSave={async (val) => handleUpdateObservation(idx, val)}
                  isEditable={editMode}
                  className="flex-1"
                />
                {editMode ? (
                  <select
                    className="ml-2 px-1 py-0.5 border rounded text-xs text-gray-700"
                    value={obs.type}
                    onChange={e => handleUpdateObservation(idx, undefined, e.target.value as ObservationUrgency)}
                  >
                    <option value={ObservationUrgency.SIMPLE}>SIMPLU</option>
                    <option value={ObservationUrgency.URGENT}>URGENT</option>
                    <option value={ObservationUrgency.TODO}>DE FACUT</option>
                  </select>
                ) : (
                  <span className="text-xs text-gray-400">
                    ({obs.type === ObservationUrgency.SIMPLE ? 'SIMPLU' : obs.type === ObservationUrgency.URGENT ? 'URGENT' : obs.type === ObservationUrgency.TODO ? 'DE FACUT' : obs.type})
                  </span>
                )}
              </div>
            ))}
          </div>
      </div>
    </div>
  );
};

export default TenantDetailsForm;
