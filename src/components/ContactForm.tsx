import { useState } from "react";

export default function ContactForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendEmail = async () => {
    setStatus("Sending...");
    await fetch("/api/send-email", {
      method: "POST",
      body: JSON.stringify({ email, message }),
      headers: { "Content-Type": "application/json" },
    });
    setStatus("Sent!");
  };

  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h2>Contact Us</h2>
      <input className="w-full p-2 my-2 bg-gray-700 rounded" placeholder="Your email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <textarea className="w-full p-2 my-2 bg-gray-700 rounded" placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} />
      <button className="bg-blue-500 p-2 rounded" onClick={sendEmail}>
        Send
      </button>
      {status && <p className="mt-2">{status}</p>}
    </div>
  );
}