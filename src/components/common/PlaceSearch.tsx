import React, { useEffect, useId, useState } from 'react';
import { Loader2, MapPin } from 'lucide-react';
import { getLocationName, LOCATIONS, searchLocations } from '../../services/mockLocations';
import { PlaceOption, searchPlaces } from '../../services/placeSearch';
import { cx } from '../../utils/cx';

// Shown when the box is empty, so there is something to tap straight away.
const POPULAR = ['ikeja', 'abuja', 'ibadan', 'portharcourt', 'kano', 'enugu', 'benin', 'kaduna'];
const SEARCH_DELAY_MS = 500;
const MIN_QUERY_LENGTH = 3;

function builtInPlaces(query: string): PlaceOption[] {
  if (!query) {
    return POPULAR.map((id) => LOCATIONS.find((l) => l.id === id))
      .filter((l): l is NonNullable<typeof l> => Boolean(l))
      .map((l) => ({ id: l.id, name: l.name }));
  }
  return searchLocations(query).slice(0, 5).map((l) => ({ id: l.id, name: l.name }));
}

function mergePlaces(builtIn: PlaceOption[], online: PlaceOption[]): PlaceOption[] {
  const names = builtIn.map((p) => p.name.toLowerCase());
  const merged = [...builtIn];
  online.forEach((p) => {
    const key = p.name.toLowerCase();
    if (names.indexOf(key) === -1) {
      names.push(key);
      merged.push(p);
    }
  });
  return merged;
}

export interface PlaceSearchProps {
  label: string;
  /** The chosen place reference, or '' when nothing is chosen. */
  value: string;
  onChange: (id: string) => void;
  placeholder?: string;
  error?: string;
  /** A place to hide from the list (for example, the pickup when choosing the destination). */
  excludeId?: string;
}

/** A search bar for any place in Nigeria: towns, areas and states. Pick from the list to set it. */
export const PlaceSearch: React.FC<PlaceSearchProps> = ({ label, value, onChange, placeholder, error, excludeId }) => {
  const baseId = useId();
  const inputId = `${baseId}-input`;
  const listId = `${baseId}-list`;

  const [query, setQuery] = useState(value ? getLocationName(value) : '');
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<PlaceOption[]>([]);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);

  // When not typing, the box always shows the chosen place (or is empty).
  useEffect(() => {
    if (!focused) setQuery(value ? getLocationName(value) : '');
  }, [value, focused]);

  // Search: built-in places show instantly, online results follow once typing pauses.
  useEffect(() => {
    if (!open) return undefined;
    const text = query.trim();
    const builtIn = builtInPlaces(text).filter((p) => p.id !== excludeId);
    setResults(builtIn);
    setActive(0);
    setOffline(false);
    if (text.length < MIN_QUERY_LENGTH) {
      setLoading(false);
      return undefined;
    }
    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const online = await searchPlaces(text, controller.signal);
        if (controller.signal.aborted) return;
        setResults(mergePlaces(builtIn, online).filter((p) => p.id !== excludeId));
      } catch {
        if (!controller.signal.aborted) setOffline(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, SEARCH_DELAY_MS);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [query, open, excludeId]);

  const choose = (place: PlaceOption) => {
    setQuery(place.name);
    setOpen(false);
    onChange(place.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && open && results[active]) {
      e.preventDefault();
      choose(results[active]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-ink-700">{label}</label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" aria-hidden="true" />
        <input
          id={inputId}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={open && results[active] ? `${listId}-${active}` : undefined}
          aria-invalid={error ? true : undefined}
          autoComplete="off"
          placeholder={placeholder ?? 'Search a town, area or state'}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={(e) => { setFocused(true); setOpen(true); e.target.select(); }}
          onBlur={() => { setFocused(false); setOpen(false); }}
          onKeyDown={onKeyDown}
          className={cx(
            'h-11 w-full rounded-xl border bg-white pl-10 pr-10 text-sm text-ink-900 placeholder:text-ink-300',
            error ? 'border-red-500' : 'border-ink-200 hover:border-ink-300',
          )}
        />
        {loading && <Loader2 className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-ink-500" aria-hidden="true" />}

        {open && (
          <ul
            id={listId}
            role="listbox"
            aria-label={`${label} suggestions`}
            className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-ink-100 bg-white py-1 shadow-pop"
          >
            {results.map((p, i) => (
              <li
                key={p.id}
                id={`${listId}-${i}`}
                role="option"
                aria-selected={i === active}
                // mouse down (not click) so the box keeps focus until the choice is made
                onMouseDown={(e) => { e.preventDefault(); choose(p); }}
                onMouseEnter={() => setActive(i)}
                className={cx('cursor-pointer px-3.5 py-2.5 text-sm', i === active ? 'bg-brand-50 text-brand-800' : 'text-ink-900')}
              >
                {p.name}
              </li>
            ))}
            {!loading && results.length === 0 && (
              <li className="px-3.5 py-3 text-sm text-ink-500">
                {query.trim().length < MIN_QUERY_LENGTH ? 'Type at least 3 letters.' : 'No places found. Try a town, area or state in Nigeria.'}
              </li>
            )}
            {offline && (
              <li className="border-t border-ink-100 px-3.5 py-2 text-xs text-ink-500">
                Online search is unavailable, so only built-in places are shown.
              </li>
            )}
          </ul>
        )}
      </div>
      {error && <p role="alert" className="mt-1.5 text-sm text-red-600">{error}</p>}
    </div>
  );
};