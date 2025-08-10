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
    <div
      style={{
        position: "relative",
        backgroundColor: "#1e1e1e",
        borderRadius: 6,
        padding: 12,
        cursor: "default",
        minHeight: 100,
        border: "1px dashed #555",
        fontSize: 16,
        color: "#eee",
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
      }}
    >
      <pre
        style={{ margin: 0, paddingRight: 30, userSelect: "text" }}
      >
        {text}
      </pre>

      {/* Edit icon positioned top-right */}
      <button
        onClick={() => setIsEditing(true)}
        title="Edit analysis"
        aria-label="Edit analysis"
        style={{
          position: "absolute",
          top: 8,
          right: 8,
          background: "none",
          border: "none",
          color: "#888",
          cursor: "pointer",
          fontSize: 18,
          padding: 4,
          lineHeight: 1,
          userSelect: "none",
          transition: "color 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#ddd")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#888")}
      >
        ✏️
      </button>
    </div>
  );
}
