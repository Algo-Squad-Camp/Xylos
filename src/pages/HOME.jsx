import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Bars3Icon,
  BellIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";
import { FaGithub } from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bellAlert, setBellAlert] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("chatHistory")) || []
  );

  const chatContainerRef = useRef(null);
  const MAX_MESSAGES = 10;

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
    if (messages.filter((msg) => msg.role === "user").length >= MAX_MESSAGES) {
      setBellAlert(true);
    }
  }, [messages]);

  const fetchBotResponse = async (messages) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const chat = await model.startChat({
        history: messages.map((msg) => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }],
        })),
        generationConfig: { maxOutputTokens: 200 },
      });

      const result = await chat.sendMessage(input);
      return result.response.text();
    } catch (error) {
      console.error("Error fetching chatbot response:", error);
      return "Sorry, I couldn't process your request.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !input.trim() ||
      messages.filter((msg) => msg.role === "user").length >= MAX_MESSAGES
    )
      return;

    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setHistory([...history, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const botReply = await fetchBotResponse([...messages, userMessage]);
      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { role: "error", content: error.message },
      ]);
    }

    setIsTyping(false);
  };
  const formatMessage = (message) => {
    // Regular expression to detect code blocks (```language \n code \n ```)
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;

    // Regular expression to detect bold text (**bold**)
    const boldRegex = /\*\*(.*?)\*\*/g;

    // Regular expression to detect italic text (*italic*)
    const italicRegex = /\*(.*?)\*/g;

    // Regular expression to detect unordered lists (- item)
    const listRegex = /(^|\n)- (.*)/g;

    let formattedMessage = message
      .replace(codeBlockRegex, (match, lang, code) => {
        return `<pre class="bg-gray-900 text-green-400 p-3 rounded-md overflow-x-auto">
        <code class='language-${lang}'>${code}</code>
        </pre>`;
      })
      .replace(boldRegex, "<strong>$1</strong>") // Convert **bold** to <strong>
      .replace(italicRegex, "<em>$1</em>") // Convert *italic* to <em>
      .replace(listRegex, "<li class='ml-4'>• $2</li>"); // Convert list items

    return formattedMessage.replace(/\n/g, "<br>"); // Preserve line breaks
  };

  return (
    <div
      className={`${
        theme === "dark" ? "bg-white text-black" : "bg-gray-900 text-white"
      } min-h-screen flex`}
    >
      {/* Sidebar */}
      <motion.aside
        initial={{ x: "-100%" }}
        animate={{ x: isPanelOpen ? 0 : "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        className={`${
          theme === "dark" ? "bg-white text-black" : "bg-gray-900 text-white"
        } fixed left-0 top-0 h-full w-64 p-4 flex flex-col border-r border-gray-700 shadow-lg z-50`}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="text-gray-100 dark:text-white"
          >
            {theme === "light" ? (
              <MoonIcon className="h-6 w-6" />
            ) : (
              <SunIcon className="h-6 w-6 text-black" />
            )}
          </button>
          <button
            onClick={() => setIsPanelOpen(false)}
            className="text-gray-400 hover:text-white"
          >
            ✖
          </button>
        </div>
        <div className="mt-4 space-y-2 flex-1 overflow-y-auto max-h-[70vh]">
          {history.map((item, index) => (
            <div
              key={index}
              className="cursor-pointer text-white p-2 bg-gray-800 rounded hover:bg-gray-700"
            >
              {item.content}
            </div>
          ))}
        </div>
        <div className="text-center mt-auto">
          <img
            src="https://avatars.githubusercontent.com/u/91828139?v=4"
            alt="Profile"
            className="w-16 h-16 rounded-full mx-auto mb-2"
          />
          <h2 className="text-sm font-medium">Ashmeet Singh</h2>
          <a
            href="https://github.com/ashmeet07"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white"
          >
            <FaGithub size={20} />
          </a>
        </div>
      </motion.aside>

      {/* Main Content (Shrinks when Sidebar Opens) */}
      <motion.div
        className="flex-grow flex flex-col transition-all duration-300 relative"
        animate={{ scale: isPanelOpen ? 0.9 : 1 }}
        style={{
          transformOrigin: "center",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        {/* Overlay when sidebar is open */}
        {isPanelOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md z-40"
            onClick={() => setIsPanelOpen(false)}
          ></div>
        )}

        {/* Navbar */}
        <nav className="flex items-center justify-between p-4 bg-white">
          <div className="flex items-center gap-4">
            <Bars3Icon
              className="h-6 w-6 cursor-pointer text-pink-400"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
            />
            <h1 className="text-xl font-bold text-black">Xylos</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <BellIcon className="h-6 w-6 cursor-pointer text-gray-700 dark:text-white" />
              {bellAlert && (
                <span className="absolute top-0 right-0 bg-red-500 h-3 w-3 rounded-full" />
              )}
            </div>
          </div>
        </nav>

        {/* Chat Messages */}
        <main className="w-full flex flex-col h-screen justify-center items-center">
          <div
            ref={chatContainerRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 scrollbar-hide"
            style={{
              maxHeight: "calc(90vh - 100px)",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {messages.length === 0 && (
              <div className="text-center mt-20">
                <h2 className="text-2xl sm:text-4xl mb-4">
                  <span className="text-blue-400">Hello</span>,{" "}
                  <span className="text-pink-400">Buddy.</span>
                </h2>
                <p
                  className={`text-lg sm:text-2xl ${
                    theme === "dark" ? "text-gray-400" : "text-gray-300"
                  }`}
                >
                  I'm here to help what can i do for you?
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                } ${isTyping && message.role === "bot" ? "blur-sm" : ""}`}
              >
                <div
                  className={`w-full text-right rounded-lg p-3 text-sm sm:text-base ${
                    message.role === "user"
                      ? "bg-white text-black w-auto"
                      : "bg-gray-200 text-black w-auto"
                  } shadow-md border border-none`}
                  dangerouslySetInnerHTML={{
                    __html: formatMessage(message.content),
                  }}
                ></div>
              </motion.div>
            ))}

            {isTyping && (
              <div className="text-gray-400">
                Typing<span className="animate-pulse">...</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-1 rounded-full border-t bg-gray-100 dark:bg-gray-800 w-[60%]"
          >
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Search any thing......"
                className="w-full rounded-full px-4 py-3 focus:outline-none bg-gray-700 dark:bg-gray-900 dark:text-black border border-gray-300 dark:border-gray-700 border-none"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                🎯
              </button>
            </div>
          </form>
        </main>
      </motion.div>
    </div>
  );
}
export default ChatbotUI;
