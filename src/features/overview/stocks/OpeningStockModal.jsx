import { Save } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button, Modal, NumberField } from '@/ui';

import { parseOpeningStockQty } from './stocksLogic';

const FORM_ID = 'opening-stock-form';

/**
 * The original "Set Opening / Old Stock" prompt. `row` = product being edited (null = closed).
 * `onSave(description, qty)` persists and shows the result toast; this sheet closes itself via `onClose`.
 */
export default function OpeningStockModal({ row, onClose, onSave }) {
  const [value, setValue] = useState('0');
  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (row) {
      setValue(String(row.opening));
      setError(undefined);
    }
  }, [row]);

  const submit = async () => {
    if (!row) return;
    const parsed = parseOpeningStockQty(value);
    if ('error' in parsed) {
      setError(parsed.error);
      return;
    }
    setSaving(true);
    try {
      await onSave(row.description, parsed.qty);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      open={row !== null}
      onClose={saving ? undefined : onClose}
      title="Set Opening / Old Stock"
      size="sm"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={saving} className="max-sm:flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            variant="success"
            icon={Save}
            loading={saving}
            className="max-sm:flex-1"
          >
            Save
          </Button>
        </>
      }
    >
      <form
        id={FORM_ID}
        onSubmit={(e) => {
          e.preventDefault();
          void submit();
        }}
      >
        <p className="mb-3 text-sm text-slate-700">
          Enter opening stock quantity for &quot;{row?.description ?? ''}&quot;
        </p>
        <NumberField
          label="Quantity"
          value={value}
          allowNegative
          error={error}
          onChange={(v) => {
            setValue(v);
            setError(undefined);
          }}
        />
      </form>
    </Modal>
  );
}
