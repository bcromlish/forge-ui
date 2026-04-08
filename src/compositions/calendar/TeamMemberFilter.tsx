"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "../../primitives/input";
import type { User } from "../../types/domain";

interface TeamMemberFilterProps {
  members: User[];
  selectedIds: Set<string>;
  onAdd: (userId: string) => void;
  onRemove: (userId: string) => void;
}

export function TeamMemberFilter({ members, selectedIds, onAdd, onRemove }: TeamMemberFilterProps) {
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedMembers = useMemo(() => members.filter((m) => selectedIds.has(m._id)), [members, selectedIds]);
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return members.filter((m) => !selectedIds.has(m._id) && m.name.toLowerCase().includes(q)).slice(0, 5);
  }, [members, selectedIds, search]);

  return (
    <div ref={containerRef} className="flex flex-col gap-2">
      {selectedMembers.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {selectedMembers.map((member) => (
            <MemberChip key={member._id} name={member.name} avatarUrl={member.avatarUrl} onRemove={() => onRemove(member._id)} />
          ))}
        </div>
      )}
      <div className="relative">
        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Add team member..." value={search}
          onChange={(e) => { setSearch(e.target.value); setDropdownOpen(true); }}
          onFocus={() => setDropdownOpen(true)} className="h-8 pl-8 text-caption"
        />
        {dropdownOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
            {searchResults.map((member) => (
              <button key={member._id} onClick={() => { onAdd(member._id); setSearch(""); setDropdownOpen(false); }}
                className="flex w-full items-center gap-2 px-2 py-1.5 text-left text-caption hover:bg-muted/50">
                <MemberAvatar name={member.name} avatarUrl={member.avatarUrl} />
                <span className="truncate">{member.name}</span>
                <span className="ml-auto text-caption text-muted-foreground capitalize">{member.role.replace("_", " ")}</span>
              </button>
            ))}
          </div>
        )}
        {dropdownOpen && search.trim() && searchResults.length === 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 rounded-md border bg-popover shadow-md">
            <p className="px-2 py-2 text-caption text-muted-foreground text-center">No members found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MemberChip({ name, avatarUrl, onRemove }: { name: string; avatarUrl?: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-caption">
      <MemberAvatar name={name} avatarUrl={avatarUrl} />
      <span className="truncate max-w-24">{name}</span>
      <button onClick={onRemove} className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5" aria-label={`Remove ${name}`}>
        <X className="h-3 w-3" />
      </button>
    </span>
  );
}

function MemberAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (avatarUrl) {
    /* eslint-disable-next-line @next/next/no-img-element */
    return <img src={avatarUrl} alt={name} className="h-4 w-4 rounded-full object-cover" />;
  }
  return (
    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary/10 text-signal-2 font-medium">{initials}</div>
  );
}
