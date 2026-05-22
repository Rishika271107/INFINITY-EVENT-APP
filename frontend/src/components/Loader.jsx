import "./Loader.css";

export function Loader({ type = "spinner", count = 1 }) {
  // Render based on the requested loader type
  switch (type) {
    case "spinner":
      return (
        <div className="luxury-spinner-container">
          <div className="luxury-spinner" />
          <span className="luxury-loading-text">Loading Infinity...</span>
        </div>
      );

    case "cards":
      return (
        <div className="skeleton-cards-grid">
          {Array.from({ length: count || 4 }).map((_, idx) => (
            <div key={idx} className="skeleton-card shimmer-card">
              <div className="skeleton-header">
                <div className="skeleton-circle shimmer-element" />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "60%" }} />
              </div>
              <div className="skeleton-body">
                <div className="skeleton-text-lg shimmer-element" style={{ width: "80%", height: "28px", marginTop: "12px" }} />
                <div className="skeleton-text-xs shimmer-element" style={{ width: "40%", marginTop: "8px" }} />
              </div>
            </div>
          ))}
        </div>
      );

    case "table":
      return (
        <div className="skeleton-table shimmer-card">
          <div className="skeleton-table-header">
            <div className="skeleton-text-md shimmer-element" style={{ width: "15%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "25%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "20%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "15%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "10%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "15%" }} />
          </div>
          <div className="skeleton-table-body">
            {Array.from({ length: count || 5 }).map((_, idx) => (
              <div key={idx} className="skeleton-table-row">
                <div className="skeleton-text-sm shimmer-element" style={{ width: "15%" }} />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "25%" }} />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "20%" }} />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "15%" }} />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "10%" }} />
                <div className="skeleton-badge shimmer-element" style={{ width: "15%" }} />
              </div>
            ))}
          </div>
        </div>
      );

    case "charts":
      return (
        <div className="skeleton-charts-container">
          <div className="skeleton-card shimmer-card skeleton-chart-main">
            <div className="skeleton-card-header">
              <div className="skeleton-text-sm shimmer-element" style={{ width: "30%" }} />
              <div className="skeleton-text-xs shimmer-element" style={{ width: "15%" }} />
            </div>
            <div className="skeleton-chart-bars">
              {Array.from({ length: 8 }).map((_, idx) => {
                const heights = ["40%", "70%", "90%", "65%", "80%", "95%", "75%", "60%"];
                return (
                  <div key={idx} className="skeleton-chart-bar-col">
                    <div className="skeleton-chart-bar shimmer-element" style={{ height: heights[idx] }} />
                    <div className="skeleton-text-xs shimmer-element" style={{ width: "24px", marginTop: "8px", height: "10px" }} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="skeleton-card shimmer-card skeleton-chart-breakdown">
            <div className="skeleton-card-header">
              <div className="skeleton-text-sm shimmer-element" style={{ width: "40%" }} />
            </div>
            <div className="skeleton-breakdown-list">
              {Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="skeleton-breakdown-row">
                  <div className="skeleton-text-sm shimmer-element" style={{ width: "25%" }} />
                  <div className="skeleton-breakdown-bar shimmer-element" />
                  <div className="skeleton-text-sm shimmer-element" style={{ width: "10%" }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "notifications":
      return (
        <div className="skeleton-notif-container shimmer-card">
          <div className="skeleton-notif-header">
            <div className="skeleton-text-sm shimmer-element" style={{ width: "40%" }} />
            <div className="skeleton-text-xs shimmer-element" style={{ width: "20%" }} />
          </div>
          <div className="skeleton-notif-list">
            {Array.from({ length: count || 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-notif-item">
                <div className="skeleton-circle shimmer-element" style={{ width: "32px", height: "32px" }} />
                <div className="skeleton-notif-body">
                  <div className="skeleton-text-sm shimmer-element" style={{ width: "85%" }} />
                  <div className="skeleton-text-xs shimmer-element" style={{ width: "25%", marginTop: "6px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "payments":
      return (
        <div className="skeleton-payments shimmer-card">
          <div className="skeleton-card-header">
            <div className="skeleton-text-md shimmer-element" style={{ width: "35%" }} />
          </div>
          <div className="skeleton-payment-list">
            {Array.from({ length: count || 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-payment-item">
                <div className="skeleton-payment-left">
                  <div className="skeleton-circle shimmer-element" style={{ width: "24px", height: "24px" }} />
                  <div className="skeleton-payment-text">
                    <div className="skeleton-text-sm shimmer-element" style={{ width: "120px" }} />
                    <div className="skeleton-text-xs shimmer-element" style={{ width: "80px", marginTop: "4px" }} />
                  </div>
                </div>
                <div className="skeleton-payment-right">
                  <div className="skeleton-text-sm shimmer-element" style={{ width: "70px", height: "16px" }} />
                  <div className="skeleton-badge shimmer-element" style={{ width: "60px", marginTop: "4px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "users":
      return (
        <div className="skeleton-users shimmer-card">
          <div className="skeleton-table-header">
            <div className="skeleton-text-md shimmer-element" style={{ width: "30%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "30%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "20%" }} />
            <div className="skeleton-text-md shimmer-element" style={{ width: "20%" }} />
          </div>
          <div className="skeleton-table-body">
            {Array.from({ length: count || 4 }).map((_, idx) => (
              <div key={idx} className="skeleton-table-row">
                <div className="skeleton-user-profile">
                  <div className="skeleton-circle shimmer-element" style={{ width: "28px", height: "28px" }} />
                  <div className="skeleton-text-sm shimmer-element" style={{ width: "70%" }} />
                </div>
                <div className="skeleton-text-sm shimmer-element" style={{ width: "30%" }} />
                <div className="skeleton-text-sm shimmer-element" style={{ width: "20%" }} />
                <div className="skeleton-badge shimmer-element" style={{ width: "20%" }} />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="skeleton-default shimmer-element" style={{ width: "100%", height: "150px" }} />
      );
  }
}

export default Loader;
