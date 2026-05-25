import { useEffect, useState } from 'react';
import { X, AlertCircle, CheckCircle, ShoppingBag } from 'lucide-react';

type PopupType = 'success' | 'error' | 'warning' | 'info';

type PopupConfig = {
  type: PopupType;
  title: string;
  message: string;
  action?: { label: string; onClick: () => void };
};

let showPopupFn: ((config: PopupConfig) => void) | null = null;

export const showPopup = (config: PopupConfig) => {
  if (showPopupFn) showPopupFn(config);
};

const iconMap = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
  info: ShoppingBag,
};

const colorsMap = {
  success: { bg: 'bg-green-50', icon: 'text-green-600', border: 'border-green-200', title: 'text-green-800', text: 'text-green-700', btn: 'bg-green-600 hover:bg-green-500' },
  error: { bg: 'bg-red-50', icon: 'text-red-600', border: 'border-red-200', title: 'text-red-800', text: 'text-red-700', btn: 'bg-red-600 hover:bg-red-500' },
  warning: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-200', title: 'text-amber-800', text: 'text-amber-700', btn: 'bg-amber-600 hover:bg-amber-500' },
  info: { bg: 'bg-indigo-50', icon: 'text-indigo-600', border: 'border-indigo-200', title: 'text-indigo-800', text: 'text-indigo-700', btn: 'bg-indigo-600 hover:bg-indigo-500' },
};

export const Popup = () => {
  const [config, setConfig] = useState<PopupConfig | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    showPopupFn = (c: PopupConfig) => {
      setConfig(c);
      setOpen(true);
    };
    return () => { showPopupFn = null; };
  }, []);

  const close = () => {
    setOpen(false);
    setTimeout(() => setConfig(null), 300);
  };

  if (!config) return null;

  const c = colorsMap[config.type];
  const Icon = iconMap[config.type];

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="fixed inset-0 bg-black/40" onClick={close} />
      <div className={`relative w-full max-w-sm rounded-2xl border ${c.border} ${c.bg} p-6 shadow-2xl`}>
        <button onClick={close} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={20} />
        </button>
        <div className="flex flex-col items-center text-center">
          <div className={`w-14 h-14 rounded-full ${c.bg} flex items-center justify-center mb-4`}>
            <Icon size={28} className={c.icon} />
          </div>
          <h3 className={`text-lg font-black ${c.title} mb-2`}>{config.title}</h3>
          <p className={`text-sm ${c.text} leading-relaxed`}>{config.message}</p>
          <div className="flex gap-3 mt-6 w-full">
            {config.action ? (
              <>
                <button onClick={close} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancelar
                </button>
                <button onClick={() => { close(); config.action?.onClick(); }} className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${c.btn}`}>
                  {config.action.label}
                </button>
              </>
            ) : (
              <button onClick={close} className={`w-full py-2.5 rounded-xl text-sm font-bold text-white transition-colors ${c.btn}`}>
                Aceptar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
