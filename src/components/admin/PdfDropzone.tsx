import { useRef, useState, type DragEvent } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface Props {
  onFile: (file: File) => void;
  busy?: boolean;
  phase?: string | null;
  progress?: number;
  disabled?: boolean;
}

export default function PdfDropzone({ onFile, busy, phase, progress, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return;
    onFile(file);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (disabled || busy) return;
    handleFiles(e.dataTransfer.files);
  }

  const isInteractive = !disabled && !busy;

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (isInteractive) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => isInteractive && inputRef.current?.click()}
      className={`border-2 border-dashed rounded-sm p-8 text-center transition-colors ${
        dragging
          ? 'border-pm-gold bg-pm-frame'
          : disabled
            ? 'border-pm-frame bg-pm-bg-2 opacity-60 cursor-not-allowed'
            : busy
              ? 'border-pm-green bg-pm-bg-2 cursor-wait'
              : 'border-pm-frame hover:border-pm-gold cursor-pointer'
      }`}
      role="button"
      aria-disabled={disabled || busy}
      tabIndex={0}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {busy ? (
        <div className="flex flex-col items-center gap-2 text-pm-cream">
          <Loader2 className="animate-spin text-pm-gold" size={32} />
          <p className="font-title uppercase tracking-widest text-sm">{phase}</p>
          {typeof progress === 'number' && (
            <div className="w-48 h-1.5 bg-pm-frame rounded overflow-hidden">
              <div
                className="h-full bg-pm-gold transition-all"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2 text-pm-parchment-2">
          <Upload size={32} className="text-pm-gold" />
          <p className="font-title uppercase tracking-widest text-sm text-pm-cream">
            Solte o PDF aqui ou clique para selecionar
          </p>
          <p className="text-xs flex items-center gap-1">
            <FileText size={12} /> Apenas arquivos .pdf do WER/EventLink
          </p>
        </div>
      )}
    </div>
  );
}
