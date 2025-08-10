import { useState } from "react";

function App() {
  const [datasheetText, setDatasheetText] = useState("");
  const [logText, setLogText] = useState("");
  const [query, setQuery] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Remove trailing slash from env var if present
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis("");

    const payload = {
      datasheet_text: datasheetText,
      log_text: logText || null,
      query: query || null,
    };
    console.log("Sending request:", payload);

    try {
      const response = await fetch(`${API_BASE_URL}/analyze_device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("API error: " + response.statusText);
      }

      const data = await response.json();
      setAnalysis(data.analysis || "No analysis found");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20, color: "#eee", fontFamily: "system-ui" }}>
      <h1>AI Device Debug & Command Assistant</h1>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <textarea
          rows={6}
          placeholder="Paste relevant datasheet content here..."
          value={datasheetText}
          onChange={(e) => setDatasheetText(e.target.value)}
          required
          style={inputStyle}
        />
        <textarea
          rows={6}
          placeholder="Paste device logs here (optional)..."
          value={logText}
          onChange={(e) => setLogText(e.target.value)}
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Optional query (e.g., Set channel to 193.5 THz)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>}
      {analysis && (
        <div style={outputContainer}>
          <h3>Analysis & Suggestions</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{analysis}</pre>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: 12,
  fontSize: 16,
  borderRadius: 6,
  border: "1px solid #444",
  backgroundColor: "#222",
  color: "#eee",
  resize: "vertical",
  boxSizing: "border-box",
  whiteSpace: "pre-wrap",
  overflowWrap: "break-word",
  wordBreak: "break-word",
};

const buttonStyle = {
  padding: "12px 0",
  fontSize: 18,
  borderRadius: 6,
  border: "none",
  backgroundColor: "#0055ff",
  color: "white",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
};

const outputContainer = {
  backgroundColor: "#1e1e1e",
  color: "#eee",
  padding: 20,
  borderRadius: 8,
  boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
  marginTop: 20,
};

export default App;
