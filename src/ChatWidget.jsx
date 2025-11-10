import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FaCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import "./style.css";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", {
        query: userMsg.content,
      });

      const botMsg = {
        role: "assistant",
        content: res.data.answer,
        sources: res.data.sources || [],
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ Error: Could not reach backend." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating icon */}
      <div
        className="chat-icon"
        onClick={() => setOpen(!open)}
        title="Chat with Aziro Bot"
      >
        {open ? <FaTimes /> : <FaCommentDots />}
      </div>

      {/* Chatbox */}
      {open && (
        <div className="chatbox">
          <div className="chat-header">Aziro Chatbot</div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`message ${
                  msg.role === "user" ? "user" : "assistant"
                }`}
              >
                {/* Markdown formatted answer */}
                <div className="markdown">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ node, ...props }) => (
                        <table
                          style={{
                            borderCollapse: "collapse",
                            width: "100%",
                            margin: "8px 0",
                            border: "1px solid #ccc",
                            fontSize: "14px",
                          }}
                          {...props}
                        />
                      ),
                      th: ({ node, ...props }) => (
                        <th
                          style={{
                            border: "1px solid #ccc",
                            padding: "6px",
                            textAlign: "left",
                            background: "#f3f3f3",
                          }}
                          {...props}
                        />
                      ),
                      td: ({ node, ...props }) => (
                        <td
                          style={{
                            border: "1px solid #ccc",
                            padding: "6px",
                          }}
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          style={{ color: "#667eea" }}
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          style={{ paddingLeft: "20px", margin: "4px 0" }}
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li style={{ marginBottom: "4px" }} {...props} />
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Sources */}
                {msg.role === "assistant" &&
                  msg.sources &&
                  msg.sources.length > 0 && (
                    <div className="sources">
                      <strong>Sources:</strong>
                      <ul>
                        {msg.sources.map((src, j) => (
                          <li key={j}>
                            <a
                              href={src.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {src.url}
                            </a>{" "}
                            ({(src.similarity * 100).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            ))}

            {loading && <div className="loading">🤔 Thinking...</div>}
          </div>

          {/* Input area */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Ask about Aziro..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} disabled={loading}>
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
