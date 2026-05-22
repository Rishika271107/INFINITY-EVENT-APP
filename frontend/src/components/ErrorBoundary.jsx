import React from "react";
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import "./ErrorBoundary.css";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, showDetails: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  toggleDetails = () => {
    this.setState((prev) => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-wrapper">
          <div className="error-boundary-card">
            <div className="error-icon-wrap">
              <AlertCircle size={40} className="error-icon" />
            </div>
            
            <h1 className="error-title">Something went wrong</h1>
            <p className="error-subtitle">
              The luxury platform encountered an unexpected error. Don't worry, your event data is secure.
            </p>

            <div className="error-actions">
              <button 
                className="error-reset-btn" 
                type="button" 
                onClick={this.handleReset}
              >
                <RefreshCw size={15} />
                Reload Platform
              </button>
            </div>

            {this.state.error && (
              <div className="error-details-container">
                <button 
                  className="error-details-toggle" 
                  type="button" 
                  onClick={this.toggleDetails}
                >
                  <span>Diagnostic Details</span>
                  {this.state.showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {this.state.showDetails && (
                  <div className="error-details-content">
                    <p className="error-message">
                      <strong>Error:</strong> {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="error-stack">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
