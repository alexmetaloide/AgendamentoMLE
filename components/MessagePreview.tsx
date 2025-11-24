import React from 'react';
import { Button } from './Button';
import { Copy, MessageCircle, X, Check } from 'lucide-react';

interface MessagePreviewProps {
  message: string;
  phoneNumber: string;
  onClose: () => void;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({ message, phoneNumber, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleWhatsApp = () => {
    const encodedMessage = encodeURIComponent(message);
    const url = phoneNumber
      ? `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`
      : `https://api.whatsapp.com/send?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageCircle size={16} className="text-blue-500" />
            Mensagem Gerada
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-0 overflow-auto bg-slate-950/30 relative">
          <textarea
            readOnly
            value={message}
            className="w-full h-64 p-4 bg-transparent text-slate-300 text-sm font-mono resize-none focus:outline-none"
          />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={handleCopy}
            className="flex-1 justify-center"
          >
            {copied ? <Check size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
            {copied ? 'Copiado!' : 'Copiar Texto'}
          </Button>

          <Button
            variant="primary"
            onClick={handleWhatsApp}
            className="flex-1 justify-center bg-[#25D366] hover:bg-[#128C7E] text-white border-transparent shadow-lg shadow-green-900/20"
          >
            <MessageCircle size={16} className="mr-2" />
            Enviar no WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};