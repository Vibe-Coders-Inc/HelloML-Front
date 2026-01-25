'use client';

import { useState } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';
import { Input } from '@/components/ui/input';

interface AddressAutocompleteProps {
  onSelect: (address: string, lat?: number, lng?: number) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export function AddressAutocomplete({
  onSelect,
  placeholder = 'Enter business address',
  className = '',
  value: externalValue = ''
}: AddressAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ['establishment'],
    },
    debounce: 300,
  });

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [hasUserEdited, setHasUserEdited] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasUserEdited(true);
    setValue(e.target.value);
    setShowSuggestions(true);
    // If user clears the field, also clear the parent
    if (e.target.value === '') {
      onSelect('');
    }
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();
    setShowSuggestions(false);

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onSelect(address, lat, lng);
    } catch (error) {
      console.error('Error getting geocode:', error);
      onSelect(address);
    }
  };

  return (
    <div className="relative">
      <Input
        value={hasUserEdited ? value : (value || externalValue)}
        onChange={handleInput}
        disabled={!ready}
        placeholder={placeholder}
        className={className}
        onFocus={() => setShowSuggestions(true)}
      />

      {showSuggestions && status === 'OK' && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-[#E8DCC8] rounded-xl shadow-2xl max-h-60 overflow-auto">
          {data.map((suggestion) => {
            const {
              place_id,
              structured_formatting: { main_text, secondary_text },
            } = suggestion;

            return (
              <div
                key={place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="px-4 py-3 cursor-pointer hover:bg-[#FAF8F3] transition-colors border-b border-[#E8DCC8]/30 last:border-b-0"
              >
                <div className="text-sm font-medium text-[#8B6F47]">{main_text}</div>
                <div className="text-xs text-[#A67A5B]/70 mt-0.5">{secondary_text}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
