'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  onQuit: () => void;
}

interface State {
  hasError: boolean;
  error: string | null;
}

export class EmulatorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error) {
    console.error('Emulator crash:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-void flex flex-col items-center justify-center p-8">
          <AlertTriangle size={48} className="text-error mb-4" />
          <h1 className="font-pixel text-h1 text-error mb-2">GAME CRASHED</h1>
          <p className="text-text-secondary text-body-sm mb-2 text-center max-w-md">
            The emulation core encountered an error.
          </p>
          <p className="font-mono text-caption text-text-tertiary mb-8 max-w-md text-center break-all">
            {this.state.error}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="flex items-center gap-2 bg-neon-cyan text-text-inverse font-pixel text-h4 px-6 py-3 rounded-md hover:shadow-glow-md-cyan transition-all"
            >
              <RotateCcw size={14} /> RESTART
            </button>
            <button
              onClick={this.props.onQuit}
              className="flex items-center gap-2 bg-transparent text-text-secondary border border-surface-3 font-pixel text-h4 px-6 py-3 rounded-md hover:border-text-primary hover:text-text-primary transition-all"
            >
              <Home size={14} /> LIBRARY
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
