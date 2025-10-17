import React from 'react';
import { EditableInputField } from '@/components/TotalAppComponents/EditableInputField/EditableInputField';
import { ObservationUrgency, Observation } from '@/types/Observation';
import { TenantTypeToggle } from '@/components/TotalAppComponents';

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

  const handleAddObservation = () => setObservations([...observations, { message: '', type: ObservationUrgency.SIMPLE }]);
  const handleRemoveObservation = (idx: number) => setObservations(observations.filter((_, i) => i !== idx));
  const handleUpdateObservation = (idx: number, value?: string, type?: ObservationUrgency | string) =>
    setObservations(observations.map((obs, i) =>
      i === idx
        ? { ...obs, ...(value !== undefined ? { message: value } : {}), ...(type !== undefined ? { type: type as ObservationUrgency } : {}) }
        : obs
    ));

  return (
    <div className="flex-1 flex flex-col rounded p-6 gap-4 bg-background">
      {/* Header cu butoane și status */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex gap-3 items-center">
          <div className="flex gap-2">
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
          
        </div>
        <div className="flex items-center gap-2">
          {/* Status Activ/Inactiv */}
          {currentTenant.active ? (
            <span className="px-3 py-1 rounded text-white bg-green-600 font-semibold text-sm">ACTIV</span>
          ) : (
            <span className="px-3 py-1 rounded text-white bg-orange-500 font-semibold text-sm">INACTIV</span>
          )}
          <span className="text-xs text-gray-400 select-text">{currentTenant.id}</span>
        </div>
      </div>

      {/* Layout 2 coloane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Coloana stânga - Detalii principale */}
        <div className="flex flex-col gap-4">
          {/* Nume */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Nume</label>
            <EditableInputField
              initialValue={name}
              onSave={async (val) => setName(val)}
              isEditable={editMode}
              className="max-w-sm"
            />
          </div>

          {/* CUI */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">CUI</label>
            <EditableInputField
              initialValue={cui}
              onSave={async (val) => setCui(val)}
              isEditable={editMode}
              className="max-w-xs"
            />
          </div>

          {/* Tip persoană */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold">Tip persoană</label>
            <TenantTypeToggle
              value={pf}
              onChange={(value) => {
                if (editMode) setPf(value);
              }}
              disabled={!editMode}
            />
          </div>
        </div>

        {/* Coloana dreapta - Contacte și observații */}
        <div className="flex flex-col gap-4">
          {/* Emailuri */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Emailuri</label>
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                  title="Adaugă email"
                  onClick={handleAddEmail}
                >
                  +
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {emails.map((email, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {editMode && (
                    <button
                      type="button"
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                      title="Șterge"
                      onClick={() => handleRemoveEmail(idx)}
                    >
                      -
                    </button>
                  )}
                  <EditableInputField
                    initialValue={email}
                    onSave={async (val) => handleUpdateEmail(idx, val)}
                    isEditable={editMode}
                    className="flex-1"
                  />
                </div>
              ))}
              {emails.length === 0 && (
                <span className="text-sm text-muted-foreground">Nu există emailuri</span>
              )}
            </div>
          </div>

          {/* Telefoane */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Telefoane</label>
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                  title="Adaugă telefon"
                  onClick={handleAddPhone}
                >
                  +
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {phoneNumbers.map((phone, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {editMode && (
                    <button
                      type="button"
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                      title="Șterge"
                      onClick={() => handleRemovePhone(idx)}
                    >
                      -
                    </button>
                  )}
                  <EditableInputField
                    initialValue={phone}
                    onSave={async (val) => handleUpdatePhone(idx, val)}
                    isEditable={editMode}
                    className="flex-1"
                  />
                </div>
              ))}
              {phoneNumbers.length === 0 && (
                <span className="text-sm text-muted-foreground">Nu există telefoane</span>
              )}
            </div>
          </div>

          {/* Observații */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold">Observații</label>
              {editMode && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center font-bold text-green-600 text-lg border border-green-600 rounded transition hover:text-black hover:bg-green-600 bg-background"
                  title="Adaugă observație"
                  onClick={handleAddObservation}
                >
                  +
                </button>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {observations.map((obs, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  {editMode && (
                    <button
                      type="button"
                      className="w-8 h-8 flex-shrink-0 flex items-center justify-center font-bold text-red-500 text-lg border border-red-500 rounded transition hover:text-black hover:bg-red-500 bg-background"
                      title="Șterge"
                      onClick={() => handleRemoveObservation(idx)}
                    >
                      -
                    </button>
                  )}
                  <div className="flex-1 flex flex-col gap-1">
                    <EditableInputField
                      initialValue={obs.message}
                      onSave={async (val) => handleUpdateObservation(idx, val)}
                      isEditable={editMode}
                      className="w-full"
                    />
                    {editMode ? (
                      <select
                        className="px-2 py-1 border rounded text-xs w-fit"
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
                </div>
              ))}
              {observations.length === 0 && (
                <span className="text-sm text-muted-foreground">Nu există observații</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantDetailsForm;
