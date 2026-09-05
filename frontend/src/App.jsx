import { useState } from "react";
import "./App.css";

const featureNames = [
  "Amount",
  "Amount (Absolute)",
  "Transaction Hour",
  "Day of Week",
  "Time Since Previous Transaction (min)",
  "Historical Average Amount",
  "Amount Ratio to History",
  "Transactions in Last 10 min",
  "Transactions in Last 1 hour",
  "Transactions in Last 24 hours",
  "Customer Age",
  "FICO Score",
  "Number of Credit Cards",
  "Yearly Income",
  "Total Debt",
  "Debt-to-Income Ratio",
  "Cards Issued",
  "Credit Limit",
  "Amount-to-Credit-Limit Ratio",
  "Amount-to-Income Ratio",
  "Location Changed",
  "Customer Previous Transactions",
  "Customer Previous Fraud",
  "Customer Historical Fraud Rate",
  "Card Previous Transactions",
  "Card Previous Fraud",
  "Card Historical Fraud Rate",
  "MCC Previous Transactions",
  "MCC Previous Fraud",
  "MCC Historical Fraud Rate",
  "Transaction Direction",
  "Card Brand",
  "Card Type",
  "Card Has Chip",
  "Merchant Category Code (MCC)",
];

function App() {
  const [features, setFeatures] = useState(Array(35).fill(""));
  const [mode, setMode] = useState("manual");

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateFeature = (index, value) => {
    const updated = [...features];
    updated[index] = value;
    setFeatures(updated);
  };

  /*
   * Verified RiskGuard V4 fraud demo transaction.
   *
   * Source:
   * Exact transaction from ibm_profile_test_v4.parquet
   *
   * Expected previously validated result:
   * approximately 98.50% CRITICAL
   */
  const loadDemoTransactions = () => {
    setMode("demo");
    setResult(null);
    setError("");

    const fraudDemo = [
      "436.44",       // 0  Amount
      "436.44",       // 1  Amount (Absolute)
      "16",           // 2  Transaction Hour
      "4",            // 3  Day of Week
      "29.0",         // 4  Time Since Previous Transaction
      "32.522981",    // 5  Historical Average Amount
      "13.415309",    // 6  Amount Ratio to History
      "0",            // 7  Transactions Last 10 min
      "1",            // 8  Transactions Last 1 hour
      "5",            // 9  Transactions Last 24 hours
      "85",            // 10 Customer Age
      "695",           // 11 FICO Score
      "7",             // 12 Number of Credit Cards
      "25066",         // 13 Yearly Income
      "424",           // 14 Total Debt
      "0.016915",      // 15 Debt-to-Income Ratio
      "1",             // 16 Cards Issued
      "14939",         // 17 Credit Limit
      "0.029215",      // 18 Amount-to-Credit-Limit Ratio
      "0.017412",      // 19 Amount-to-Income Ratio
      "0",             // 20 Location Changed
      "19898",         // 21 Customer Previous Transactions
      "55",             // 22 Customer Previous Fraud
      "0.002764",      // 23 Customer Historical Fraud Rate
      "104",            // 24 Card Previous Transactions
      "14",             // 25 Card Previous Fraud
      "0.134615",      // 26 Card Historical Fraud Rate
      "644",            // 27 MCC Previous Transactions
      "52",             // 28 MCC Previous Fraud
      "0.080745",      // 29 MCC Historical Fraud Rate
      "debit",          // 30 Transaction Direction
      "Mastercard",     // 31 Card Brand
      "Debit",          // 32 Card Type
      "True",           // 33 Card Has Chip
      "3006",           // 34 Merchant Category Code (MCC)
    ];

    setFeatures(fraudDemo);
  };

  const startManualTransaction = () => {
    setMode("manual");
    setFeatures(Array(35).fill(""));
    setResult(null);
    setError("");
  };

  const analyzeTransaction = async () => {
    setError("");
    setResult(null);

    if (loading) {
      return;
    }

    /*
     * V4 features:
     * 0-29  = numeric
     * 30-34 = categorical
     */

    // Validate numeric features
    const numericFeatureIndexes = Array.from(
      { length: 30 },
      (_, index) => index
    );

    for (const index of numericFeatureIndexes) {
      if (
        features[index] === "" ||
        features[index] === null ||
        features[index] === undefined ||
        !Number.isFinite(Number(features[index]))
      ) {
        setError(
          `Please provide a valid value for "${featureNames[index]}".`
        );
        return;
      }
    }

    // Validate categorical features
    const categoricalFeatureIndexes = [30, 31, 32, 33, 34];

    for (const index of categoricalFeatureIndexes) {
      if (
        features[index] === "" ||
        features[index] === null ||
        features[index] === undefined ||
        String(features[index]).trim() === ""
      ) {
        setError(
          `Please provide a value for "${featureNames[index]}".`
        );
        return;
      }
    }

    // Transaction amount
    const amount = Number(features[0]);

    if (!Number.isFinite(amount)) {
      setError("Please provide a valid transaction amount.");
      return;
    }

    /*
     * Build the exact 35-feature V4 payload.
     */
    const v4Features = [
      Number(features[0]),
      Number(features[1]),
      Number(features[2]),
      Number(features[3]),
      Number(features[4]),
      Number(features[5]),
      Number(features[6]),
      Number(features[7]),
      Number(features[8]),
      Number(features[9]),
      Number(features[10]),
      Number(features[11]),
      Number(features[12]),
      Number(features[13]),
      Number(features[14]),
      Number(features[15]),
      Number(features[16]),
      Number(features[17]),
      Number(features[18]),
      Number(features[19]),
      Number(features[20]),
      Number(features[21]),
      Number(features[22]),
      Number(features[23]),
      Number(features[24]),
      Number(features[25]),
      Number(features[26]),
      Number(features[27]),
      Number(features[28]),
      Number(features[29]),
      String(features[30]),
      String(features[31]),
      String(features[32]),
      String(features[33]),
      String(features[34]),
    ];

    const controller = new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, 15000);

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            features: v4Features,
          }),
          signal: controller.signal,
        }
      );

      let data;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          "RiskGuard API returned an invalid response."
        );
      }

      // HTTP error
      if (!response.ok) {
        let errorMessage = "Prediction request failed.";

        if (typeof data.detail === "string") {
          errorMessage = data.detail;
        } else if (
          data.detail &&
          typeof data.detail === "object"
        ) {
          if (Array.isArray(data.detail)) {
            errorMessage = data.detail
              .map((item) => {
                if (typeof item === "string") {
                  return item;
                }

                return (
                  item?.msg ||
                  item?.message ||
                  item?.error ||
                  JSON.stringify(item)
                );
              })
              .join(" ");
          } else {
            errorMessage =
              data.detail.message ||
              data.detail.msg ||
              data.detail.error ||
              JSON.stringify(data.detail);
          }
        } else if (data.error) {
          if (typeof data.error === "string") {
            errorMessage = data.error;
          } else {
            errorMessage =
              data.error.message ||
              data.error.msg ||
              data.error.error ||
              JSON.stringify(data.error);
          }
        }

        throw new Error(errorMessage);
      }

      // Application-level error
      if (data.error) {
        const errorMessage =
          typeof data.error === "string"
            ? data.error
            : data.error.message ||
              data.error.msg ||
              data.error.error ||
              JSON.stringify(data.error);

        throw new Error(errorMessage);
      }

      // Validate successful response
      if (
        typeof data.fraud_probability !== "number" ||
        !data.risk_level ||
        !data.recommended_action
      ) {
        throw new Error(
          "RiskGuard API returned an incomplete prediction."
        );
      }

      setResult(data);
    } catch (err) {
      if (err?.name === "AbortError") {
        setError(
          "RiskGuard API took too long to respond. Please make sure the backend is running."
        );
      } else if (err instanceof TypeError) {
        setError(
          "Unable to connect to RiskGuard API. Please make sure FastAPI is running on port 8000."
        );
      } else {
        setError(
          err?.message ||
            "An unexpected error occurred while analyzing the transaction."
        );
      }
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const getRiskClass = (riskLevel) => {
    if (!riskLevel) {
      return "";
    }

    return riskLevel.toLowerCase();
  };

  const getRiskPercentage = (probability) => {
    const percentage = Number(probability) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  };

  const getRiskPosition = (probability) => {
    return `${getRiskPercentage(probability)}%`;
  };

  const getSignalWidth = (signal, signals) => {
    if (!signals || signals.length === 0) {
      return 0;
    }

    const contributions = signals
      .map((item) => Math.abs(Number(item.contribution)))
      .filter(Number.isFinite);

    if (contributions.length === 0) {
      return 0;
    }

    const maxContribution = Math.max(...contributions);

    if (maxContribution === 0) {
      return 0;
    }

    return (
      (Math.abs(Number(signal.contribution)) /
        maxContribution) *
      100
    );
  };

  const fraudSignals =
    result?.explanation?.fraud_signals || [];

  const protectiveSignals =
    result?.explanation?.protective_signals || [];

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            🛡️
          </div>

          <div>
            <h1>RiskGuard</h1>
            <p>AI-Powered Fraud Detection</p>
          </div>
        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          API System Online
        </div>
      </header>

      {/* Main */}
      <main className="container">

        {/* Hero */}
        <section className="hero-section">
          <div>
            <span className="eyebrow">
              TRANSACTION SECURITY
            </span>

            <h2>
              Analyze transactions
              <br />
              with AI-powered intelligence.
            </h2>

            <p>
              RiskGuard evaluates payment transactions using
              customer, card, merchant, temporal, and
              behavioral history with explainable AI.
            </p>
          </div>

          <div className="hero-stat">
            <span>MODEL</span>
            <strong>Random Forest</strong>
            <small>
              35 features · SHAP enabled
            </small>
          </div>
        </section>

        {/* Transaction Input */}
        <section className="card">

          <div className="section-header">
            <div>
              <span className="eyebrow">
                TRANSACTION INPUT
              </span>

              <h3>
                Analyze a Transaction
              </h3>

              <p>
                Evaluate a payment transaction using
                transaction, customer, card, merchant,
                and behavioral history.
              </p>
            </div>

            <div className="mode-buttons">

              <button
                type="button"
                className={`mode-button ${
                  mode === "demo" ? "active" : ""
                }`}
                onClick={loadDemoTransactions}
                disabled={loading}
              >
                🧪 Demo Transaction
              </button>

              <button
                type="button"
                className={`mode-button ${
                  mode === "manual" ? "active" : ""
                }`}
                onClick={startManualTransaction}
                disabled={loading}
              >
                ✏️ Manual Entry
              </button>

            </div>
          </div>

          <div className="input-info">
            <div>
              <strong>
                {mode === "demo"
                  ? "Demo transaction mode"
                  : "Manual transaction mode"}
              </strong>

              <p>
                {mode === "demo"
                  ? "A verified RiskGuard V4 fraud transaction has been pre-filled for demonstration."
                  : "Enter the transaction, customer, card, merchant, and historical behavioral features required by RiskGuard V4."}
              </p>
            </div>

            <span>
              {
                features.filter(
                  (value) => value !== ""
                ).length
              }
              /35 fields
            </span>
          </div>

          <div className="feature-grid">

            {featureNames.map((name, index) => (
              <div
                className={`input-group ${
                  name === "Amount"
                    ? "amount-input"
                    : ""
                }`}
                key={name}
              >

                <label htmlFor={`feature-${index}`}>
                  {name}
                </label>

                {index < 30 ? (
                  <input
                    id={`feature-${index}`}
                    type="number"
                    step="any"
                    value={features[index]}
                    onChange={(e) =>
                      updateFeature(
                        index,
                        e.target.value
                      )
                    }
                    placeholder="0"
                    disabled={loading}
                  />
                ) : (
                  <input
                    id={`feature-${index}`}
                    type="text"
                    value={features[index]}
                    onChange={(e) =>
                      updateFeature(
                        index,
                        e.target.value
                      )
                    }
                    placeholder={
                      index === 30
                        ? "debit / credit"
                        : index === 31
                        ? "Mastercard / Visa"
                        : index === 32
                        ? "Debit / Credit"
                        : index === 33
                        ? "True / False"
                        : "e.g. 3006"
                    }
                    disabled={loading}
                  />
                )}

              </div>
            ))}

          </div>

          {/* Error */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Analyze Button */}
          <button
            type="button"
            className="analyze-button"
            onClick={analyzeTransaction}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Analyzing Transaction...
              </>
            ) : (
              "🔍 Analyze Transaction"
            )}
          </button>

        </section>

        {/* Results */}
        {result && (
          <section className="results">

            {/* Results Header */}
            <div className="results-header">
              <div>
                <span className="eyebrow">
                  RISK ASSESSMENT
                </span>

                <h2>
                  Transaction Analysis
                </h2>
              </div>

              <div
                className={`risk-badge ${getRiskClass(
                  result.risk_level
                )}`}
              >
                {result.risk_level}
              </div>
            </div>

            {/* Transaction Summary */}
            <div className="transaction-summary">

              <div className="summary-item">
                <span>
                  TRANSACTION HOUR
                </span>

                <strong>
                  {features[2] !== ""
                    ? `${features[2]}:00`
                    : "—"}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  TRANSACTION AMOUNT
                </span>

                <strong>
                  $
                  {Number(
                    features[0]
                  ).toFixed(2)}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  MERCHANT CATEGORY
                </span>

                <strong>
                  {features[34] || "—"}
                </strong>
              </div>

              <div className="summary-item">
                <span>
                  FEATURES PROVIDED
                </span>

                <strong>
                  {
                    features.filter(
                      (value) => value !== ""
                    ).length
                  }{" "}
                  / 35
                </strong>
              </div>

            </div>

            {/* Main Metrics */}
            <div className="metrics">

              {/* Fraud Probability */}
              <div className="metric-card risk-meter-card">

                <span>
                  FRAUD RISK SCORE
                </span>

                <div className="risk-meter-value">
                  {(
                    Number(
                      result.fraud_probability
                    ) * 100
                  ).toFixed(2)}
                  %
                </div>

                <div className="risk-meter">

                  <div className="risk-meter-track">
                    <div className="risk-zone low-zone"></div>
                    <div className="risk-zone medium-zone"></div>
                    <div className="risk-zone high-zone"></div>
                    <div className="risk-zone critical-zone"></div>
                  </div>

                  <div
                    className="risk-marker"
                    style={{
                      left: getRiskPosition(
                        result.fraud_probability
                      ),
                    }}
                  >
                    <span></span>
                  </div>

                </div>

                <div className="risk-scale">
                  <span>0%</span>
                  <span>20%</span>
                  <span>50%</span>
                  <span>80%</span>
                  <span>100%</span>
                </div>

                <div className="risk-labels">
                  <span className="low-label">
                    LOW
                  </span>

                  <span className="medium-label">
                    MEDIUM
                  </span>

                  <span className="high-label">
                    HIGH
                  </span>

                  <span className="critical-label">
                    CRITICAL
                  </span>
                </div>

              </div>

              {/* Model Decision */}
              <div className="metric-card">

                <span>
                  MODEL DECISION
                </span>

                <strong>
                  {result.risk_level === "LOW"
                    ? "LOW FRAUD RISK"
                    : `${result.risk_level} FRAUD RISK`}
                </strong>

                <small>
                  Decision threshold: 77%
                </small>

              </div>

              {/* Recommended Action */}
              <div className="metric-card">

                <span>
                  RECOMMENDED ACTION
                </span>

                <strong className="action-text">
                  {result.recommended_action}
                </strong>

              </div>

            </div>

            {/* Explanation */}
            <div className="explanation-grid">

              {/* Fraud Signals */}
              <div className="explanation-card fraud-card">

                <h3>
                  🚨 Fraud Signals
                </h3>

                <p>
                  Features pushing the model
                  toward fraud.
                </p>

                <div className="signal-list">

                  {fraudSignals.length > 0 ? (
                    fraudSignals.map(
                      (signal, index) => {

                        const width =
                          getSignalWidth(
                            signal,
                            fraudSignals
                          );

                        return (
                          <div
                            className="signal-item"
                            key={`${signal.feature}-${index}`}
                          >

                            <div className="signal-header">

                              <span>
                                {signal.feature}
                              </span>

                              <strong>
                                +
                                {Number(
                                  signal.contribution
                                ).toFixed(4)}
                              </strong>

                            </div>

                            <div className="signal-bar">

                              <div
                                className="signal-bar-fill fraud-bar"
                                style={{
                                  width: `${width}%`,
                                }}
                              ></div>

                            </div>

                          </div>
                        );
                      }
                    )
                  ) : (
                    <p>
                      No fraud signals available.
                    </p>
                  )}

                </div>

              </div>

              {/* Protective Signals */}
              <div className="explanation-card protective-card">

                <h3>
                  🛡️ Protective Signals
                </h3>

                <p>
                  Features pushing the model
                  away from fraud.
                </p>

                <div className="signal-list">

                  {protectiveSignals.length > 0 ? (
                    protectiveSignals.map(
                      (signal, index) => {

                        const width =
                          getSignalWidth(
                            signal,
                            protectiveSignals
                          );

                        return (
                          <div
                            className="signal-item"
                            key={`${signal.feature}-${index}`}
                          >

                            <div className="signal-header">

                              <span>
                                {signal.feature}
                              </span>

                              <strong>
                                {Number(
                                  signal.contribution
                                ).toFixed(4)}
                              </strong>

                            </div>

                            <div className="signal-bar">

                              <div
                                className="signal-bar-fill protective-bar"
                                style={{
                                  width: `${width}%`,
                                }}
                              ></div>

                            </div>

                          </div>
                        );
                      }
                    )
                  ) : (
                    <p>
                      No protective signals available.
                    </p>
                  )}

                </div>

              </div>

            </div>

            {/* Investigation Summary */}
            <div className="investigation-card">

              <div className="investigation-icon">
                🔎
              </div>

              <div>

                <h3>
                  RiskGuard Investigation
                </h3>

                <p>
                  The model assigned a fraud risk
                  score of{" "}
                  <strong>
                    {(
                      Number(
                        result.fraud_probability
                      ) * 100
                    ).toFixed(2)}
                    %
                  </strong>{" "}
                  and classified this
                  transaction as{" "}
                  <strong>
                    {result.risk_level}
                  </strong>.
                </p>

                <p>
                  The explanation engine
                  identified the strongest
                  contributing transaction
                  signals using SHAP.
                </p>

                {result.explanation?.note && (
                  <p>
                    <small>
                      {result.explanation.note}
                    </small>
                  </p>
                )}

              </div>

            </div>

          </section>
        )}

      </main>

      {/* Footer */}
      <footer>
        <span>
          🛡️ RiskGuard
        </span>

        <span>
          AI Fraud Detection · Explainable AI
        </span>
      </footer>

    </div>
  );
}

export default App;