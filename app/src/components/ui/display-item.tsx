// @ts-nocheck
"use client";

import * as React from "react";
import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function DisplayItem({
  value,
  onChange,
  values,
  placeholder,
  empty,
}: {
  value: string;
  onChange: (value: string) => void;
  values: string[];
  placeholder: string;
  empty: string;
}) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState("");

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[239px] mt-2 justify-between border border-black"
        >
          <span className={cn("flex flex-1", { "opacity-50": !value })}>
            {value || empty}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[239px] p-0">
        <Command>
          <CommandInput placeholder={placeholder} className="h-9" />
          <CommandList>
            <CommandEmpty>{empty}</CommandEmpty>
            <CommandGroup>
              {values.map((v) => (
                <CommandItem
                  key={v}
                  value={v}
                  onSelect={(currentValue) => {
                    setOpen(false);
                    onChange(currentValue);
                  }}
                >
                  {v}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
