import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from '@/ui';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[FinX] Unhandled error:', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6">
          <ErrorState
            title="FinX hit an unexpected error"
            description={this.state.error.message}
            hint="If this keeps happening, open Help for troubleshooting."
            onRetry={this.reset}
            helpHref="/help"
          />
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;