import { useState } from "react";

function App() {
  const [meetingText, setMeetingText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Remove trailing slash from backend URL if present
  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSummary("");

    try {
      const response = await fetch(`${API_BASE_URL}/summarize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meeting_text: meetingText }),
      });

      if (!response.ok) {
        throw new Error("API error: " + response.statusText);
      }

      const data = await response.json();

      setSummary(data.choices?.[0]?.message?.content || "No summary found");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h1>Meeting Summarizer</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <textarea
          rows={8}
          style={{
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
          }}
          placeholder="Paste your meeting notes here..."
          value={meetingText}
          onChange={(e) => setMeetingText(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "12px 0",
            fontSize: 18,
            borderRadius: 6,
            border: "none",
            backgroundColor: loading ? "#555" : "#0055ff",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {loading ? "Summarizing..." : "Summarize"}
        </button>
      </form>

      {error && (
        <p
          style={{
            color: "red",
            fontWeight: "bold",
          }}
        >
          Error: {error}
        </p>
      )}

      {summary && (
        <div
          style={{
            backgroundColor: "#1e1e1e",
            color: "#eee",
            padding: 20,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.7)",
            whiteSpace: "pre-wrap",
            overflowWrap: "break-word",
            wordBreak: "break-word",
            fontSize: 16,
            lineHeight: 1.5,
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: 12 }}>Summary & Action Items</h3>
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {summary}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
