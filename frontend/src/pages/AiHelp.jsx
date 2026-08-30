/**
 * AiHelp.jsx
 *
 * Concept: LLM API Integration + Async data fetching from API
 * This component sends user messages to the backend, which calls Google Gemini.
 * The response is a structured JSON object { reply, suggestions } parsed from the LLM.
 *
 * Concept: State management with useState
 * - messages: conversation history rendered in the chat UI
 * - input: controlled input field
 * - isTyping: shows typing indicator while awaiting LLM response
 * - suggestions: dynamic follow-up chips returned by the LLM (structured output)
 * - history: conversation history sent to backend for multi-turn context
 *
 * Concept: Side effects with useEffect
 * - Auto-scroll to the latest message whenever messages/isTyping changes
 *
 * Concept: React component composition
 * - This page is wrapped by UserLayout (Navbar + outlet) and ProtectedRoute
 */
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Send, User, ArrowLeft, Palette, Shirt, Heart, DollarSign, Sparkles } from "lucide-react";
import API from "../services/api";
import "./AiHelp.css";

// ── Default suggestion chips shown on first load ──────────────────────────────
const DEFAULT_SUGGESTIONS = [
  { label: "Venue Decor",      icon: Heart,       prompt: "Can you help me with venue decor?" },
  { label: "Reception Colors", icon: Palette,     prompt: "Suggest reception color palettes" },
  { label: "Saree Styling",    icon: Shirt,       prompt: "Suggest saree colors for an evening event" },
  { label: "Budget Advice",    icon: DollarSign,  prompt: "Help me plan my event budget" },
];

const AiHelp = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);

  // ── State management with useState ─────────────────────────────────────────
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Good evening. Welcome to Infinity Grand Events. I am Tara, your personal AI event director.\n\nIt would be my absolute pleasure to assist you in orchestrating a celebration that is nothing short of extraordinary. What kind of event are we planning today?",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState(null);

  // Structured output from LLM — suggestion chips update dynamically per response
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  // Conversation history for multi-turn LLM context
  // Each turn: { role: 'user' | 'model', text: string }
  const [history, setHistory] = useState([]);

  // ── Side effects with useEffect — auto-scroll ──────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // ─────────────────────────────────────────────────────────────────────────────
  // Concept: Async data fetching from API + async/await + Promises
  //
  // handleSend is an async function that:
  //   1. Optimistically adds the user message to UI (synchronous state update)
  //   2. Shows the typing indicator (state update)
  //   3. Awaits the backend call which calls Gemini (async — Promise)
  //   4. Parses the structured output { reply, suggestions }
  //   5. Updates messages and suggestion chips
  //
  // Concept: JavaScript — async/await
  // `await API.post(...)` pauses this async function until the Promise resolves,
  // then execution continues on the next line — without blocking the UI thread.
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSend = useCallback(async (textToSend = input) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isTyping) return;

    setError(null);

    // 1. Add user message to UI (optimistic update)
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Build updated history to send to backend (multi-turn context)
    const updatedHistory = [...history, { role: "user", text: trimmed }];

    try {
      // 2. Async API call — POST /api/ai/chat
      // Backend calls Gemini with the system prompt + history + new message
      const response = await API.post("/ai/chat", {
        message: trimmed,
        history: updatedHistory.slice(-10), // send last 10 turns to avoid token overflow
      });

      // 3. Consume the structured output from the LLM
      // Backend guarantees shape: { success: true, data: { reply: string, suggestions: string[] } }
      const { reply, suggestions: newSuggestions } = response.data.data;

      // 4. Add AI reply to chat
      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiMsg]);

      // 5. Update history for the next turn (multi-turn context memory)
      setHistory([
        ...updatedHistory,
        { role: "model", text: reply },
      ]);

      // 6. Update suggestion chips from structured LLM output
      if (Array.isArray(newSuggestions) && newSuggestions.length > 0) {
        setSuggestions(
          newSuggestions.slice(0, 4).map((label, i) => ({
            label,
            icon: [Heart, Palette, Shirt, DollarSign][i % 4],
            prompt: label,
          }))
        );
      }

    } catch (err) {
      // Server-side error handling — display user-friendly error in chat
      const errMsg =
        err.response?.data?.message ||
        err.message ||
        "I'm having trouble connecting right now. Please try again in a moment.";

      setError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          sender: "ai",
          text: `⚠️ ${errMsg}`,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isError: true,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, history]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="ai-help-container">
      <header className="ai-header">
        <button className="back-btn" onClick={() => navigate("/user/dashboard")}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="ai-title">
          <div className="Zyra-avatar-header">T</div>
          <div className="title-text">
            <h1>Tara</h1>
            <p>Infinity AI Event Director · Powered by Gemini</p>
          </div>
        </div>
        <div className="header-status">
          <span className="status-dot"></span>
          <span>Online</span>
        </div>
      </header>

      <main className="chat-area">
        <div className="messages-container">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-wrapper ${msg.sender}`}>
              <div className="message-icon">
                {msg.sender === "ai" ? (
                  <div className="tara-icon-inner">T</div>
                ) : (
                  <User size={18} />
                )}
              </div>
              <div className="message-content">
                <div className={`message-bubble${msg.isError ? " error-bubble" : ""}`}>
                  {msg.text.split("\n").map((line, i) => (
                    <React.Fragment key={i}>
                      {line}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="message-wrapper ai">
              <div className="message-icon">
                <div className="tara-icon-inner">T</div>
              </div>
              <div className="message-content">
                <div className="message-bubble typing">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Dynamic suggestion chips — updated from structured LLM output */}
        <div className="suggestions-bar">
          {suggestions.map((s, i) => {
            const Icon = s.icon;
            return (
              <button
                key={i}
                className="suggestion-chip"
                onClick={() => handleSend(s.prompt)}
                disabled={isTyping}
              >
                <Icon size={14} />
                {s.label}
              </button>
            );
          })}
        </div>
      </main>

      <footer className="chat-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Ask Tara anything about your event..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isTyping}
          />
          <button
            className="send-btn"
            onClick={() => handleSend()}
            disabled={isTyping || !input.trim()}
          >
            {isTyping ? <Sparkles size={20} className="spin" /> : <Send size={20} />}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AiHelp;
