import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

type Props = {
  message: string;
  visible: boolean;
  onHide: () => void;
};

export default function Toast({ message, visible, onHide }: Props) {
  useEffect(() => {
    if (!visible) return;
    const t = setTimeout(onHide, 3000);
    return () => clearTimeout(t);
  }, [visible, onHide]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2
                    bg-gray-900 text-white text-sm font-medium px-4 py-3 rounded-2xl shadow-xl
                    animate-[fadeUp_0.25s_ease-out]">
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}`}</style>
      <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
      {message}
    </div>
  );
}
