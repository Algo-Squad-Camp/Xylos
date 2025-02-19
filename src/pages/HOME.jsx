import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";

const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";

function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bellAlert, setBellAlert] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
    if (messages.filter(msg => msg.role === "user").length >= 5) {
      setBellAlert(true);
    }
  }, [messages]);

  const fetchBotResponse = async (messages) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mixtral-8x7b-32768",
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || messages.filter(msg => msg.role === "user").length >= 5) return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const botReply = await fetchBotResponse([
        { role: "system", content: "You are a helpful assistant." },
        userMessage,
      ]);
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "error", content: error.message }]);
    }

    setIsTyping(false);
  };

  const formatMessage = (message) => {
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;
    let formattedMessage = message.replace(codeBlockRegex, (match, lang, code) => {
      return `<pre style="white-space: pre-wrap; word-wrap: break-word; background-color: #2D2D2D; padding: 10px; border-radius: 5px;"><code class='language-${lang}'>${code}</code></pre>`;
    });
    return formattedMessage.replace(/\n/g, "<br>");
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white flex">
      {isPanelOpen && (
        <aside className="w-64 bg-white p-3 pt-20 flex flex-col items-center border-r border-gray-300">
          <img src="https://avatars.githubusercontent.com/u/91828139?v=4" alt="Profile" className="w-24 h-24 rounded-full mb-2" />
          <h2 className="text-lg font-semibold text-gray-900">Ashmeet Singh</h2>
          <p className="text-gray-600 text-sm text-center">All rights are reserved by ashmeet07 go to github for colaboration................!</p>
          <a href="https://github.com/ashmeet07" target="_blank" rel="noopener noreferrer" className="mt-4 text-gray-700 hover:text-black">
            <FaGithub size={30} />
          </a>
        </aside>
      )}

      <div className="flex-grow flex flex-col">
        <header className="border-b border-gray-700 bg-[#2D2D2D]">
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center space-x-4">
              <Bars3Icon className="h-6 w-6 cursor-pointer" onClick={() => setIsPanelOpen(!isPanelOpen)} />
              <h1 className="text-xl">
                Chatbot <span className="text-blue-400">in React</span>
              </h1>
            </div>
            <BellIcon className={`h-6 w-6 ${bellAlert ? "text-red-500 animate-pulse" : "text-yellow-400"}`} />
          </div>
        </header>

        <main className="container mx-auto max-w-4xl p-4 flex-grow flex flex-col">
          <div className="flex-grow overflow-y-auto p-4 space-y-4" ref={chatContainerRef} style={{ maxHeight: "70vh", scrollbarWidth: "none", msOverflowStyle: "none" }}>
            {messages.length === 0 && (
              <div className="text-center mt-20">
                <h2 className="text-4xl mb-4">
                  <span className="text-blue-400">Hello</span>
                  <span className="text-pink-400">, beautiful.</span>
                </h2>
                <p className="text-2xl text-gray-500 ">How can I help you today?</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-4 ${message.role === "user" ? "bg-blue-600" : "bg-[#2D2D2D]"}`}>
                    <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}></div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <form onSubmit={handleSubmit} className="p-2 rounded-lg border-t border-gray-700 bg-[#2D2D2D] bg-[#ffffff] ">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter a prompt here  "
                className="w-full bg-[#1E1E1E] text-center text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={messages.filter(msg => msg.role === "user").length >= 5}
              />
              <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white" disabled={messages.filter(msg => msg.role === "user").length >= 5}>🎯</button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}

export default ChatbotUI;
