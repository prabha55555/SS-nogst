/**
 * Product description box with the shortcut autocomplete dropdown (sales.html / script.js "autocomplete-item").
 *
 * Props
 *  - value: string                      current description
 *  - onChange(value: string)            typed text OR the full description of a picked suggestion
 *  - shortcuts: Array<{shortcutKey, fullDescription}> | null   product catalogue (null while loading: no hints)
 *  - readOnly?: boolean
 *  - label: string                      accessible label
 *  - placeholder?: string
 *  - className?: string
 * Keyboard: ArrowUp/ArrowDown move, Enter picks, Escape closes. A description that is not in the catalogue
 * is flagged ("Select a product from the suggestions") once the box loses focus, mirroring the save validation.
 */
import { useId, useState } from 'react';
import { cn } from '@/ui/cn';
import { isKnownProduct, matchShortcuts } from './productMatch';

export function ProductDescriptionInput({
  value,
  onChange,
  shortcuts,
  readOnly,
  label,
  placeholder = 'Type product name or shortcut',
  className,
}) {
  const listId = useId();
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [highlight, setHighlight] = useState(0);

  const suggestions = focused && !readOnly && !dismissed ? matchShortcuts(shortcuts, value) : [];
  const open = suggestions.length > 0;
  const noMatch =
    focused && !readOnly && !dismissed && !!shortcuts && value.trim().length > 0 && suggestions.length === 0;
  const unknown = !focused && !!shortcuts && value.trim().length > 0 && !isKnownProduct(shortcuts, value);
  const active = Math.min(highlight, suggestions.length - 1);

  const pick = (s) => {
    onChange(s.fullDescription);
    setDismissed(true);
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(Math.min(active + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(Math.max(active - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pick(suggestions[active]);
    } else if (e.key === 'Escape') {
      setDismissed(true);
    }
  };

  return (
    <div className={cn('relative min-w-0', className)}>
      <input
        type="text"
        role="combobox"
        aria-label={label}
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-autocomplete="list"
        aria-invalid={unknown || undefined}
        aria-activedescendant={open ? `${listId}-${active}` : undefined}
        autoComplete="off"
        autoCapitalize="none"
        spellCheck={false}
        placeholder={placeholder}
        value={value}
        readOnly={readOnly}
        onChange={(e) => {
          setDismissed(false);
          setHighlight(0);
          onChange(e.target.value);
        }}
        onFocus={() => {
          setFocused(true);
          setDismissed(false);
        }}
        onBlur={() => setFocused(false)}
        onKeyDown={onKeyDown}
        className={cn(
          'block min-h-11 w-full min-w-0 rounded-lg border bg-white px-3 py-2 text-slate-900 transition sm:min-h-10',
          'placeholder:text-slate-400 read-only:bg-slate-100 focus:ring-2 focus:outline-none',
          unknown
            ? 'border-red-400 focus:border-red-500 focus:ring-red-200'
            : 'border-slate-300 focus:border-brand-500 focus:ring-brand-200',
        )}
      />
      {open ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute top-full right-0 left-0 z-30 mt-1 max-h-64 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-card"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.shortcutKey}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown (not click) so the input does not lose focus before the pick lands
              onMouseDown={(e) => {
                e.preventDefault();
                pick(s);
              }}
              onMouseEnter={() => setHighlight(i)}
              className={cn('cursor-pointer px-3 py-2 text-sm text-slate-800', i === active && 'bg-brand-50')}
            >
              <strong className="text-brand-700">{s.shortcutKey}</strong> → {s.fullDescription}
            </li>
          ))}
        </ul>
      ) : null}
      {noMatch ? <p className="mt-1 text-xs text-slate-500">No matching products found</p> : null}
      {unknown ? (
        <p className="mt-1 text-xs text-red-600" role="alert">
          Select a product from the suggestions
        </p>
      ) : null}
    </div>
  );
}
