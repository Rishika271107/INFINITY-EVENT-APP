import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Send, 
  User, 
  ArrowLeft, 
  Sparkles, 
  Palette, 
  Shirt, 
  Gem, 
  Heart,
  Clock,
  DollarSign,
  Info
} from "lucide-react";
import "./AiHelp.css";

const AiHelp = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // ─── STATE ───
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Good evening. Welcome to Infinity Grand Events. I am Tara, your personal AI event director.\n\nIt would be my absolute pleasure to assist you in orchestrating a celebration that is nothing short of extraordinary. What kind of event are we planning today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // ─── CONVERSATION MEMORY ───
  const [session, setSession] = useState({
    eventType: null,
    culture: null,
    outfit: null,
    timing: null,
    style: null,
    color: null,
    venue: null,
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // ─── STRICT INTENT-BASED ENGINE ───

  const detectIntent = (text) => {
    const t = text.toLowerCase();

    if (t.match(/^(hi|hello|hey|good morning|good evening)/)) return "GREETING";
    if (t.includes("how are you")) return "SOCIAL";
    if (t.includes("thank you")) return "APPRECIATION";
    
    if (t.includes("venue decor") || t.includes("decoration") || t.includes("decor ideas")) return "VENUE_DECOR";
    if (t.includes("color") || t.includes("palette") || t.includes("shades")) return "COLORS";
    if (t.includes("saree") || (t.includes("outfit") && t.includes("style"))) return "SAREE_STYLING";
    if (t.includes("fashion") || t.includes("style")) return "FASHION";
    if (t.includes("budget") || t.includes("cost") || t.includes("planning budget")) return "BUDGET";
    if (t.includes("wedding planning")) return "WEDDING_PLANNING";
    if (t.includes("confused") || t.includes("stressed")) return "EMOTIONAL_SUPPORT";
    if (t.includes("photography")) return "PHOTOGRAPHY";
    if (t.includes("catering") || t.includes("food")) return "CATERING";
    if (t.includes("entertainment") || t.includes("music")) return "ENTERTAINMENT";

    return "GENERAL";
  };

  const generateResponse = (userInput) => {
    const intent = detectIntent(userInput);
    const t = userInput.toLowerCase();
    
    // Update session info silently if detected
    const newSession = { ...session };
    if (t.includes("saree")) newSession.outfit = "saree";
    if (t.includes("evening")) newSession.timing = "evening";
    if (t.includes("soft-glam") || t.includes("soft glam")) newSession.style = "soft-glam";
    if (t.includes("emerald")) newSession.color = "emerald green";
    setSession(newSession);

    // ─── RELEVANT RESPONSES ONLY ───

    switch (intent) {
      case "GREETING":
        if (t.includes("hi")) return "Hello and welcome. I’m Tara, your personal AI event consultant. What kind of celebration are you planning today?";
        if (t.includes("hello")) return "Good to see you. I’d be delighted to help you plan something memorable. Are you organizing a wedding, reception, engagement, birthday, or another special event?";
        return "Hey there. I’m excited to help you create a beautiful event experience. What are we planning today?";

      case "SOCIAL":
        return "I’m doing wonderfully and ready to help you plan every detail perfectly. How may I assist you today?";

      case "APPRECIATION":
        return "It’s my pleasure. I’m always here to help make your celebration extraordinary.";

      case "VENUE_DECOR":
        return `Absolutely. I’d be delighted to help you design a beautiful venue atmosphere.\n\nTo recommend decor concepts that perfectly suit your event, could you tell me:\n• Is the venue indoor or outdoor?\n• Daytime or evening event?\n• Traditional elegance or modern luxury style?\n• Approximate guest count?\n\nMeanwhile, here are a few premium decor directions:\n\n**Modern Luxury:**\n• White floral installations, Champagne gold accents, and warm ambient lighting.\n\n**Royal Traditional:**\n• Grand floral entrances, Candle-lit pathways, and Crystal chandeliers.\n\n**Garden Elegance:**\n• Hanging floral decor, Fairy lights, and soft pastel palettes.`;

      case "COLORS":
        return `For an elegant reception atmosphere, these premium color combinations work beautifully:\n\n• **Emerald Green + Champagne Gold**\n• **Wine Red + Ivory**\n• **Royal Blue + Silver**\n• **Mauve + Rose Gold**\n\nThese shades create a luxurious ambiance, especially under warm evening lighting.\n\nWould you also like matching stage decor ideas, outfit coordination, or floral styling?`;

      case "SAREE_STYLING":
        return `For evening events, rich jewel tones and elegant soft-glam palettes work beautifully in sarees.\n\nSome stunning options include:\n• **Emerald Green** (luxurious & sophisticated)\n• **Wine Red** (rich & elegant)\n• **Midnight Blue** (modern & refined)\n• **Mauve Rose** (soft-glam aesthetic)\n\nTo complement the look, I recommend antique gold jewelry and a sleek hairstyle. Would you like matching makeup or footwear ideas?`;

      case "BUDGET":
        return `I can absolutely help you organize the event budget professionally. \n\nTo prepare a structured breakdown, could you share:\n• Event type?\n• Approximate guest count?\n• Luxury or minimal style preference?\n\nI’ll then create a detailed budget roadmap for you.`;

      case "WEDDING_PLANNING":
        return `Planning a wedding is a beautiful journey. To help you orchestrate every ceremony professionally, could you tell me which regional tradition you are following (e.g., Hindu, Muslim, Christian)? I can then guide you through Mehendi, Haldi, Mandap decor, and timelines.`;

      case "EMOTIONAL_SUPPORT":
        return `That’s completely understandable. Planning an important celebration involves many decisions, and it can sometimes feel overwhelming. Don’t worry — I’ll help simplify everything step-by-step.\n\nWould you like to start with theme selection, color combinations, or budget organization?`;

      case "GENERAL":
        if (t.includes("modern luxury decor")) {
          return `A modern luxury atmosphere would pair beautifully with your styling. I recommend warm ambient lighting, white floral installations, gold metallic accents, and minimal elegant stage design. This creates a refined high-end atmosphere.`;
        }
        return `I’d love to assist you with that! To give you a truly professional recommendation, could you tell me a bit more about the vibe you're envisioning or the specific event type?`;

      default:
        return "I'm here to help you plan your dream event. What specific area can I assist you with right now—decor, styling, budget, or themes?";
    }
  };

  const handleSend = (textToSend = input) => {
    if (!textToSend.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const responseText = generateResponse(textToSend);
      const taraMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, taraMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="ai-help-container">
      <header className="ai-header">
        <button className="back-btn" onClick={() => navigate("/user/dashboard")}>
          <ArrowLeft size={18} />
          <span>Dashboard</span>
        </button>
        <div className="ai-title">
          <div className="tara-avatar-header">T</div>
          <div className="title-text">
            <h1>Tara</h1>
            <p>Infinity AI Event Director</p>
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
                {msg.sender === "ai" ? <div className="tara-icon-inner">T</div> : <User size={18} />}
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.text.split('\n').map((line, i) => (
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
              <div className="message-icon"><div className="tara-icon-inner">T</div></div>
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

        <div className="suggestions-bar">
          <button className="suggestion-chip" onClick={() => handleSend("Can you help me with venue decor?")}>
            <Heart size={14} /> Venue Decor
          </button>
          <button className="suggestion-chip" onClick={() => handleSend("Suggest reception colors")}>
            <Palette size={14} /> Reception Colors
          </button>
          <button className="suggestion-chip" onClick={() => handleSend("Suggest saree colors")}>
            <Shirt size={14} /> Saree Styling
          </button>
          <button className="suggestion-chip" onClick={() => handleSend("Budget planning")}>
            <DollarSign size={14} /> Budget Advice
          </button>
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
          />
          <button className="send-btn" onClick={() => handleSend()}>
            <Send size={20} />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default AiHelp;
