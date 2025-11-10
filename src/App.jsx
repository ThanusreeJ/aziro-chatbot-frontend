import ChatWidget from "./ChatWidget";

export default function App() {
  return (
    <div>
      <h1 style={{ textAlign: "center", marginTop: "50px", color: "#333" }}>
        Aziro Technologies Chatbot
      </h1>
      <p style={{ textAlign: "center", color: "#666" }}>
        Ask about services, leadership, or capabilities.
      </p>
      <ChatWidget />
    </div>
  );
}
