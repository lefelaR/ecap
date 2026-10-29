'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchAddressSuggestions, type AddressSuggestion } from '@/services/mapbox-geocoding';
import { FormField } from '../atoms/FormField';

interface StreetAddressInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (value: string) => void;
  coords?: { lat: number; lng: number };
  onCoordsChange?: (coords: { lat: number; lng: number }) => void;
  required?: boolean;
}

export function StreetAddressInput({
  id = 'address',
  name = 'address',
  value,
  onChange,
  coords,
  onCoordsChange,
  required = false,
}: StreetAddressInputProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (value.trim().length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const results = await fetchAddressSuggestions(value, coords);
        setSuggestions(results);
        setOpen(results.length > 0);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [value, coords?.lat, coords?.lng]);

  function handleSelect(suggestion: AddressSuggestion) {
    onChange(suggestion.label);
    onCoordsChange?.({ lat: suggestion.lat, lng: suggestion.lng });
    setSuggestions([]);
    setOpen(false);
  }

  function handleBlur() {
    blurTimeout.current = setTimeout(() => setOpen(false), 150);
  }

  function handleFocus() {
    if (blurTimeout.current) {
      clearTimeout(blurTimeout.current);
    }
    if (suggestions.length > 0) {
      setOpen(true);
    }
  }

  return (
    <FormField label="Street name or area" htmlFor={id}>
      <div className="position-relative">
        <input
          id={id}
          name={name}
          type="text"
          className="form-control"
          placeholder="e.g. Example St, Wynberg"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls={`${id}-suggestions`}
        />
        {loading && (
          <span className="position-absolute top-50 end-0 translate-middle-y text-muted small me-3">
            Searching…
          </span>
        )}
        {open && suggestions.length > 0 && (
          <ul
            id={`${id}-suggestions`}
            className="list-group position-absolute w-100 shadow-sm street-suggestions"
            role="listbox"
          >
            {suggestions.map((suggestion) => (
              <li key={suggestion.id} role="option">
                <button
                  type="button"
                  className="list-group-item list-group-item-action text-start"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(suggestion)}
                >
                  {suggestion.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </FormField>
  );
}
