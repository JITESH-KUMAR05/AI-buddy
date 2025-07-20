import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const ChatBox = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  const handleAsk = async () => {
    setLoading(true);
    setResponse("");
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const res = await fetch(`${apiBaseUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.response) {
        setResponse(data.response);
        speakResponse(data.response);
      } else {
        setResponse("Error: " + data.error);
      }
    } catch (err) {
      setResponse("Error connecting to server.");
    }
    setLoading(false);
  };

  const startSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setPrompt((prev) => prev + " " + transcript);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const speakResponse = (text) => {
    const synth = window.speechSynthesis;
    if (!synth) return;

    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "en-US";
    synth.speak(utter);
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      const fileReader = new FileReader();
      fileReader.onload = async function () {
        const typedArray = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }
        setPrompt(text);
      };
      fileReader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="chatbox">
      <div className="input-section">
        <textarea
          className="chat-textarea"
          placeholder="Ask a question, paste your notes, or upload a PDF..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
      </div>
      
      <div className="controls-section">
        <button 
          className="btn btn-primary" 
          onClick={handleAsk} 
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="loading-spinner"></span>
              Processing...
            </>
          ) : (
            <>
              ✨ Submit
            </>
          )}
        </button>
        
        <button 
          className="btn btn-secondary" 
          onClick={startSpeechRecognition}
        >
          🎙️ Voice Input
        </button>
        
        <div className="file-input-wrapper">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handlePdfUpload}
            className="file-input"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="file-input-label">
            📄 Upload PDF
          </label>
        </div>
      </div>
      
      <div className="response-section">
        <div className="response-header">
          <h3 className="response-title">AI Response</h3>
          {response && (
            <button 
              className="btn btn-secondary" 
              onClick={() => speakResponse(response)}
            >
              🔊 Listen
            </button>
          )}
        </div>
        <div className="response-content">
          {response ? (
            <p>{response}</p>
          ) : (
            <div className="response-empty">
              Your AI assistant's response will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBox;