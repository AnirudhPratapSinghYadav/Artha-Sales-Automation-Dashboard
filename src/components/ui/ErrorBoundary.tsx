'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from './Card';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <Card className="max-w-md w-full p-8 text-center" bodyClassName="p-0">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center">
                <AlertOctagon className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 mb-2">Something went wrong</h2>
            <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">
              An unexpected error occurred in this component. We've logged the issue.
            </p>
            {this.state.error && (
              <div className="bg-gray-50 dark:bg-zinc-950 p-3 rounded-lg mb-6 text-left overflow-auto text-xs text-red-600 dark:text-red-400 font-mono max-h-32 border border-red-100 dark:border-red-900/30">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReset}
              className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-6 rounded-lg transition-colors w-full"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
