import { useState } from "react";

export default function ChatInterface({ fetchResponse }: { fetchResponse: (msg: string) => Promise<{ response: string }> }) {
  const [messages, setMessages] = useState<{ user: string; bot: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setInput("");

    const botResponse = await fetchResponse(userMessage);
    setMessages([...messages, { user: userMessage, bot: botResponse.response }]);
  };

  return (
    <div className="flex flex-col h-full p-4 space-y-2">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((msg, idx) => (
          <div key={idx} className="flex flex-col">
            <div className="text-right text-blue-400">{msg.user}</div>
            <div className="text-left text-gray-300">{msg.bot}</div>
          </div>
        ))}
      </div>

      <div className="flex space-x-2">
        <input
          type="text"
          className="flex-1 p-2 bg-gray-700 rounded text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-green-500 p-2 rounded" onClick={sendMessage}>
          Send
        </button>
      </div>
    </div>
  );
}