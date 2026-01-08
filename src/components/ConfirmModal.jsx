/**
 * Confirmation Modal Component
 * Used for confirming destructive actions
 */
export default function ConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default' // 'default' | 'danger' | 'success'
}) {
  if (!isOpen) return null;

  const variantStyles = {
    default: 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-500',
    danger: 'bg-red-500 hover:bg-red-600 focus:ring-red-500',
    success: 'bg-emerald-500 hover:bg-emerald-600 focus:ring-emerald-500'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl 
                      w-full max-w-sm p-6 animate-modal-content">
        {/* Icon */}
        <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center
                        ${variant === 'danger' ? 'bg-red-100 dark:bg-red-900/30' : 
                          variant === 'success' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                          'bg-teal-100 dark:bg-teal-900/30'}`}>
          {variant === 'danger' ? (
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : variant === 'success' ? (
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>

        {/* Content */}
        <h3 className="text-lg font-bold text-center text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-center text-slate-600 dark:text-slate-400 mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl
                       text-slate-700 dark:text-slate-300 
                       bg-slate-100 dark:bg-slate-700
                       hover:bg-slate-200 dark:hover:bg-slate-600
                       active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-slate-400
                       transition-all duration-150"
          >
            {cancelText}
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`flex-1 px-4 py-2.5 text-sm font-semibold rounded-xl
                       text-white active:scale-95
                       focus:outline-none focus:ring-2 focus:ring-offset-2
                       dark:focus:ring-offset-slate-800
                       transition-all duration-150
                       ${variantStyles[variant]}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

