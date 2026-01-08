import { useState, useEffect } from 'react';

/**
 * PWA Install Instructions Modal
 * Detects device type and shows appropriate installation steps
 */
export default function InstallModal({ isOpen, onClose }) {
  const [deviceType, setDeviceType] = useState('desktop');

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setDeviceType('ios');
    } else if (/android/.test(ua)) {
      setDeviceType('android');
    } else if (/macintosh|windows|linux/.test(ua)) {
      setDeviceType('desktop');
    }
  }, []);

  if (!isOpen) return null;

  const instructions = {
    ios: {
      title: 'Install on iPhone/iPad',
      steps: [
        { icon: '📤', text: 'Tap the Share button in Safari' },
        { icon: '📜', text: 'Scroll down and tap "Add to Home Screen"' },
        { icon: '✏️', text: 'Name it "Sudoku" and tap "Add"' },
        { icon: '🎮', text: 'Find the app icon on your home screen!' }
      ],
      note: 'Make sure you\'re using Safari browser'
    },
    android: {
      title: 'Install on Android',
      steps: [
        { icon: '⋮', text: 'Tap the menu (three dots) in Chrome' },
        { icon: '📲', text: 'Tap "Add to Home screen" or "Install app"' },
        { icon: '✏️', text: 'Confirm the name and tap "Add"' },
        { icon: '🎮', text: 'Find the app icon on your home screen!' }
      ],
      note: 'Works best with Chrome browser'
    },
    desktop: {
      title: 'Install on Desktop',
      steps: [
        { icon: '🔍', text: 'Look for the install icon in the address bar' },
        { icon: '📥', text: 'Click "Install" when prompted' },
        { icon: '🎮', text: 'The app will open in its own window!' }
      ],
      note: 'Works with Chrome, Edge, and other Chromium browsers'
    }
  };

  const current = instructions[deviceType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-modal-backdrop"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl 
                      w-full max-w-sm overflow-hidden animate-modal-content">
        {/* Header */}
        <div className="bg-teal-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="text-xl">📱</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Install App</h3>
                <p className="text-xs text-white/80">Play offline anytime</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Device tabs */}
          <div className="flex gap-1 mb-4 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
            {[
              { key: 'ios', label: 'iOS', icon: '' },
              { key: 'android', label: 'Android', icon: '🤖' },
              { key: 'desktop', label: 'Desktop', icon: '💻' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setDeviceType(key)}
                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all
                  ${deviceType === key
                    ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                  }`}
              >
                {icon} {label}
              </button>
            ))}
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-4">
            {current.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-900/30 
                                flex items-center justify-center flex-shrink-0">
                  <span className="text-base">{step.icon}</span>
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm text-slate-700 dark:text-slate-300">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      Step {index + 1}:
                    </span>{' '}
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="px-3 py-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <p className="text-xs text-amber-700 dark:text-amber-300">
              💡 {current.note}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className="w-full py-2.5 text-sm font-bold rounded-xl
                       text-white bg-teal-500
                       hover:bg-teal-600
                       active:scale-95 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

