import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Digital Twin You Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>🤖 AI System Error</h2>
          <p>The Digital Twin AI encountered an unexpected error.</p>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Reset AI System
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;