import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isConflict = toast.type === 'conflict' || toast.type === 'warning';

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md w-full animate-bounce-short">
      <div
        className={`p-4 rounded-xl shadow-xl border flex items-start gap-3 ${
          isSuccess
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
            : isConflict
            ? 'bg-amber-50 border-amber-300 text-amber-950'
            : 'bg-rose-50 border-rose-300 text-rose-950'
        }`}
      >
        <div className="mt-0.5 shrink-0">
          {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-600" />}
          {isConflict && <AlertTriangle className="w-5 h-5 text-amber-600" />}
          {!isSuccess && !isConflict && <XCircle className="w-5 h-5 text-rose-600" />}
        </div>

        <div className="flex-1">
          <h5 className="text-sm font-bold capitalize">
            {toast.title || (isSuccess ? 'Success' : isConflict ? 'Concurrency Conflict' : 'Error')}
          </h5>
          <p className="text-xs mt-0.5 leading-relaxed">{toast.message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-700 p-1 rounded-md transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
