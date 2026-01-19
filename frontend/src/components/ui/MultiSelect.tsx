"use client";

import { Fragment, useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
  Transition,
} from "@headlessui/react";

export interface MultiSelectOption {
  value: string;
  label: string;
}

interface MultiSelectProps {
  value: string[];
  onChange: (value: string[]) => void;
  options: MultiSelectOption[];
  label?: string;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function MultiSelect({
  value,
  onChange,
  options,
  label,
  placeholder = "Buscar...",
  className = "",
  error,
}: MultiSelectProps) {
  const [query, setQuery] = useState("");

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.label.toLowerCase().includes(query.toLowerCase())
        );

  const handleSelect = (selectedValue: string) => {
    if (value.includes(selectedValue)) {
      onChange(value.filter((v) => v !== selectedValue));
    } else {
      onChange([...value, selectedValue]);
    }
    setQuery("");
  };

  const handleRemove = (removedValue: string) => {
    onChange(value.filter((v) => v !== removedValue));
  };

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <Combobox value={value} onChange={() => {}} multiple>
        <div className="relative">
          <div
            className={`relative w-full rounded-md bg-white border ${
              error ? "border-red-300" : "border-gray-300"
            } focus-within:ring-2 focus-within:ring-christian-blue focus-within:border-transparent`}
          >
            {/* Selected items */}
            {selectedOptions.length > 0 && (
              <div className="flex flex-wrap gap-1 p-2">
                {selectedOptions.map((option) => (
                  <span
                    key={option.value}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-christian-blue text-white text-xs rounded"
                  >
                    {option.label}
                    <button
                      type="button"
                      onClick={() => handleRemove(option.value)}
                      className="hover:bg-blue-700 rounded-full p-0.5"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="flex items-center">
              <ComboboxInput
                className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 focus:outline-none"
                placeholder={placeholder}
                onChange={(event) => setQuery(event.target.value)}
                value={query}
              />
              <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                <svg
                  className="h-5 w-5 text-gray-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </ComboboxButton>
            </div>
          </div>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery("")}
          >
            <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {filteredOptions.length === 0 && query !== "" ? (
                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                  Nenhum resultado encontrado.
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <ComboboxOption
                    key={option.value}
                    className="relative cursor-pointer select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-christian-blue data-[focus]:text-white"
                    value={option.value}
                    onClick={() => handleSelect(option.value)}
                  >
                    <span className="block truncate">{option.label}</span>
                    {value.includes(option.value) && (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-christian-blue data-[focus]:text-white">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    )}
                  </ComboboxOption>
                ))
              )}
            </ComboboxOptions>
          </Transition>
        </div>
      </Combobox>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
