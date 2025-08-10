import { useState, useRef, useEffect } from "react";

function InlineEditableAnalysis({ text, onChange }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(text);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCurrentText(text);
  }, [text]);

  useEffect(() => {
    if (isEditing) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(currentText.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      textareaRef.current.blur(); // triggers handleBlur
    } else if (e.key === "Escape") {
      setCurrentText(text);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        value={currentText}
        onChange={(e) => setCurrentText(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        rows={6}
        style={{
          width: "100%",
          fontSize: 16,
          padding: 12,
          borderRadius: 6,
          border: "1px solid #555",
          backgroundColor: "#222",
          color: "#eee",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />
    );
  }

  return (
    <pre
      onClick={() => setIsEditing(true)}
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        cursor: "pointer",
        padding: 12,
        borderRadius: 6,
        backgroundColor: "#1e1e1e",
        border: "1px dashed #555",
        fontSize: 16,
        minHeight: 100,
      }}
      title="Click to edit analysis"
    >
      {text}
    </pre>
  );
}

function App() {
  const [datasheetText, setDatasheetText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnalysis("");

    const payload = {
      datasheet_text: datasheetText,
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
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        padding: 20,
        color: "#eee",
        fontFamily: "system-ui",
      }}
    >
      <h1>AI Device Debug & Command Assistant</h1>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 12 }}
      >
        <textarea
          rows={6}
          placeholder="Paste relevant datasheet content here..."
          value={datasheetText}
          onChange={(e) => setDatasheetText(e.target.value)}
          required
          style={inputStyle}
        />

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>Error: {error}</p>
      )}

      {analysis && (
        <div style={outputContainer}>
          <h3>Analysis & Suggestions (click text to edit)</h3>
          <InlineEditableAnalysis text={analysis} onChange={setAnalysis} />
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
