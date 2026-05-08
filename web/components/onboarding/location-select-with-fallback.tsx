"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type LocationChoice = {
  label: string;
  value: string;
  dialCode?: string;
};

type Props = {
  label?: string;
  placeholder: string;
  value: string;
  options: LocationChoice[];
  disabled?: boolean;
  error?: string;
  isLoading?: boolean;
  onChange: (value: string) => void;
  renderLabel?: (option: LocationChoice) => string;
};

export function LocationSelectWithFallback({
  label,
  placeholder,
  value,
  options,
  disabled,
  error,
  isLoading = false,
  onChange,
  renderLabel,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [useCustomInput, setUseCustomInput] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selected = options.find((option) => option.value === value);

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }

    return options.filter((option) =>
      `${option.label} ${option.value} ${option.dialCode ?? ""}`
        .toLowerCase()
        .includes(normalized),
    );
  }, [options, query]);

  // Determine if we should show custom input fallback
  const shouldShowCustomInput =
    useCustomInput || (options.length === 0 && !isLoading);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  if (shouldShowCustomInput) {
    return (
      <div className="space-y-2">
        {label ?
          <p className="text-sm font-medium text-foreground">{label}</p>
        : null}
        <div className="space-y-2">
          <Input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            disabled={disabled}
          />
          {options.length === 0 && !isLoading ?
            <p className="text-xs text-muted">
              No options available. Please enter your{" "}
              {label?.toLowerCase() ?? "value"} manually.
            </p>
          : null}
          {useCustomInput && options.length > 0 ?
            <button
              type="button"
              onClick={() => {
                setUseCustomInput(false);
                setQuery("");
              }}
              className="text-xs text-accent hover:underline"
            >
              Back to options
            </button>
          : null}
        </div>
        {error ?
          <p className="text-sm text-danger">{error}</p>
        : null}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative space-y-2">
      {label ?
        <p className="text-sm font-medium text-foreground">{label}</p>
      : null}
      <button
        type="button"
        disabled={disabled || isLoading}
        onClick={() => {
          if (!disabled && !isLoading) {
            setOpen((current) => !current);
          }
        }}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-input px-4 text-left text-sm outline-none",
          "focus-visible:border-accent focus-visible:ring-4 focus-visible:ring-ring/40",
          disabled && "cursor-not-allowed opacity-60",
          isLoading && "cursor-wait opacity-60",
        )}
      >
        <span className={cn("truncate", !selected && "text-muted")}>
          {isLoading ?
            "Loading..."
          : selected ?
            (renderLabel?.(selected) ?? selected.label)
          : placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>
      {error ?
        <p className="text-sm text-danger">{error}</p>
      : null}
      {open && !disabled && !isLoading ?
        <div className="absolute left-0 top-full z-20 mt-2 w-full">
          <Command>
            <CommandInput
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${(label ?? "options").toLowerCase()}`}
            />
            <CommandList>
              {filteredOptions.length === 0 && options.length > 0 ?
                <CommandEmpty>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomInput(true);
                      setQuery("");
                      setOpen(false);
                    }}
                    className="w-full py-2 text-xs text-accent hover:underline"
                  >
                    Enter {label?.toLowerCase() ?? "value"} manually
                  </button>
                </CommandEmpty>
              : filteredOptions.length === 0 ?
                <CommandEmpty>No results found.</CommandEmpty>
              : filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    active={option.value === value}
                    onClick={() => {
                      onChange(option.value);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    {renderLabel?.(option) ?? option.label}
                  </CommandItem>
                ))
              }
            </CommandList>
          </Command>
        </div>
      : null}
    </div>
  );
}
