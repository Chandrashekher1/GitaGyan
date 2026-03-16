import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class YogaErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error.message || 'Something went wrong with the yoga feature.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('YogaErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, errorMessage: '' });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full max-w-lg mx-auto mt-16 text-center">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 backdrop-blur-sm p-8 shadow-[0_4px_24px_rgba(239,68,68,0.08)]">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 mb-5">
              <AlertCircle className="w-7 h-7 text-red-500" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">
              Something went wrong
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {this.state.errorMessage.includes('MediaPipe')
                ? 'The pose detection model failed to load. This can happen with slow connections or ad blockers.'
                : 'An unexpected error occurred in the yoga feature. Please try again.'}
            </p>
            <Button
              onClick={this.handleReset}
              className="rounded-full gap-2 px-6"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default YogaErrorBoundary;
