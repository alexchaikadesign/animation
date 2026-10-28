"use client";

import { useRef, useState } from "react";
import { useDictionary } from "@/content/I18nProvider";
import { ACCEPTED_FILES } from "@/lib/validation";
import { Paperclip, Close } from "@/components/ui/Icons";

type Props = {
  files: File[];
  onChange: (files: File[]) => void;
  text: string;
  theme?: "light" | "dark";
  error?: string;
};

const fmtSize = (b: number) => (b > 1024 * 1024 ? `${(b / 1024 / 1024).toFixed(1)} МБ` : `${Math.max(1, Math.round(b / 1024))} КБ`);

/** Drag-and-drop файлов (ТЗ, материалы). */
export function FileDrop({ files, onChange, text, theme = "light", error }: Props) {
  const t = useDictionary().contactForm.drop;
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const dark = theme === "dark";

  const add = (list: FileList | null) => {
    if (!list?.length) return;
    const next = [...files];
    for (const f of Array.from(list)) if (!next.some((x) => x.name === f.name && x.size === f.size)) next.push(f);
    onChange(next);
  };

  return (
    <div className="mt-[22px]">
      <label
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer items-center justify-center gap-2.5 border-[0.5px] border-dashed p-[26px] text-center text-[15px] leading-[1.3] transition-[border-color,background-color] duration-300 ${
          dark
            ? `text-on-dark-2 hover:border-white/60 hover:bg-white/3 ${over ? "border-white/60 bg-white/3" : "border-white/25"}`
            : `text-muted hover:border-[rgb(18_21_28/0.5)] hover:bg-[rgb(18_21_28/0.02)] ${over ? "border-[rgb(18_21_28/0.5)] bg-[rgb(18_21_28/0.02)]" : "border-[rgb(18_21_28/0.22)]"}`
        } ${error ? "border-danger" : ""}`}
      >
        <input
          ref={input}
          type="file"
          multiple
          accept={ACCEPTED_FILES}
          className="sr-only"
          onChange={(e) => (add(e.target.files), (e.target.value = ""))}
        />
        <Paperclip />
        <span>
          {text} <span className={`underline underline-offset-[3px] ${dark ? "text-white" : "text-ink"}`}>{t.pick}</span>
        </span>
      </label>
      {files.length > 0 && (
        <ul className="m-0 mt-2 flex list-none flex-col gap-1 p-0">
          {files.map((f, i) => (
            <li key={f.name + f.size} className={`flex items-center gap-3 text-sm ${dark ? "text-on-dark-2" : "text-muted"}`}>
              <span className={`min-w-0 flex-1 truncate ${dark ? "text-white" : "text-ink"}`}>{f.name}</span>
              <span className="flex-none">{fmtSize(f.size)}</span>
              <button
                type="button"
                aria-label={`${t.remove}: ${f.name}`}
                onClick={() => onChange(files.filter((_, k) => k !== i))}
                className="flex size-7 flex-none items-center justify-center border-0 bg-transparent text-inherit opacity-70 hover:opacity-100"
              >
                <Close size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
}

export function FieldError({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <p id={id} role="alert" className="m-0 mt-2 text-[13px] leading-[1.3] text-danger">
      {children}
    </p>
  );
}
