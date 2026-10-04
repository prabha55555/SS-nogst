import { Plus, Save } from 'lucide-react';

import { Button, Modal, TextField } from '@/ui';

import { SHORTCUT_KEY_MAX_LENGTH } from './shortcutsLogic';

const FORM_ID = 'shortcut-form';

/**
 * "Add New Shortcut" / "Edit Shortcut" sheet. `state` = { oldKey, key, description } (oldKey '' when adding),
 * null while closed. Enter submits.
 */
export default function ShortcutFormModal({ state, onChange, saving, onClose, onSave }) {
  const adding = !state?.oldKey;
  return (
    <Modal
      open={state !== null}
      onClose={saving ? undefined : onClose}
      title={adding ? 'Add New Shortcut' : 'Edit Shortcut'}
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving} className="max-sm:flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            icon={adding ? Plus : Save}
            loading={saving}
            className="max-sm:flex-1"
          >
            {adding ? 'Add Shortcut' : 'Save Changes'}
          </Button>
        </>
      }
    >
      {state ? (
        <form
          id={FORM_ID}
          className="space-y-3"
          onSubmit={(e) => {
            e.preventDefault();
            onSave();
          }}
        >
          {adding ? (
            <p className="text-sm text-slate-500">
              Create shortcuts for frequently used product descriptions
            </p>
          ) : null}
          <TextField
            label="Shortcut Key:"
            value={state.key}
            onChange={(key) => onChange({ ...state, key })}
            placeholder="e.g., Lk, Ly d, Sj"
            maxLength={SHORTCUT_KEY_MAX_LENGTH}
            autoCapitalize="none"
            autoCorrect="off"
            autoComplete="off"
          />
          <TextField
            label="Full Description:"
            value={state.description}
            onChange={(description) => onChange({ ...state, description })}
            placeholder="e.g., Loopknit, Lycra Derby, Single Jersey"
            autoCapitalize="words"
            autoComplete="off"
          />
        </form>
      ) : null}
    </Modal>
  );
}
