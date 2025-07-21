import React, { useState, useRef } from "react";

const ChatBox = ({ user, onUserUpdate }) => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [autoPlayVoice, setAutoPlayVoice] = useState(true); // Voice setting
  const recognitionRef = useRef(null);

  // Load PDF.js dynamically with better error handling
  const loadPdfJs = async () => {
    if (window.pdfjsLib) {
      return window.pdfjsLib;
    }
    
    try {
      // Use a more reliable CDN and specific version
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js';
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          if (window.pdfjsLib) {
            // Use the same CDN for worker
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
            console.log('PDF.js loaded successfully:', window.pdfjsLib.version);
            resolve(window.pdfjsLib);
          } else {
            reject(new Error('PDF.js not available after loading'));
          }
        };
        script.onerror = (error) => {
          console.error('Script loading error:', error);
          reject(new Error('Failed to load PDF.js script'));
        };
        
        // Timeout after 15 seconds
        setTimeout(() => {
          if (!window.pdfjsLib) {
            reject(new Error('PDF.js loading timeout'));
          }
        }, 15000);
      });
    } catch (error) {
      console.error('Failed to load PDF.js:', error);
      throw error;
    }
  };

  const handleAsk = async () => {
    setLoading(true);
    setResponse("");
    try {
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
      const token = localStorage.getItem('aibuddy_token');
      
      const res = await fetch(`${apiBaseUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ 
          prompt,
          document_content: documentContent 
        }),
      });
      
      const data = await res.json();
      
      if (res.status === 429) {
        // Rate limit exceeded
        setResponse(`❌ ${data.error}\n\n🔗 Need more queries? Contact support: ${data.contact}`);
      } else if (data.response) {
        setResponse(data.response);
        
        // Auto-play voice if enabled
        if (autoPlayVoice) {
          speakResponse(data.response);
        }
        
        // Update user usage info
        if (data.prompts_remaining !== undefined && onUserUpdate) {
          const updatedUser = {
            ...user,
            prompts_used: (user.prompts_limit || 5) - (typeof data.prompts_remaining === 'number' ? data.prompts_remaining : 0)
          };
          onUserUpdate(updatedUser);
          localStorage.setItem('aibuddy_user', JSON.stringify(updatedUser));
        }
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

  const speakResponse = (text, forcePlay = false) => {
    const synth = window.speechSynthesis;
    if (!synth) {
      console.warn("Speech synthesis not supported in this browser");
      return;
    }

    // Only play automatically if autoPlayVoice is enabled or forcePlay is true
    if (!autoPlayVoice && !forcePlay) {
      return;
    }

    // Stop any current speech
    synth.cancel();

    // Clean text for better speech output
    const cleanText = text
      .replace(/[#*_`]/g, '') // Remove markdown formatting
      .replace(/\n+/g, '. ') // Replace line breaks with pauses
      .replace(/\s+/g, ' ') // Normalize spaces
      .replace(/###|##|#/g, '') // Remove heading markers
      .replace(/\*\*/g, '') // Remove bold markers
      .replace(/^\s*[-•]\s*/gm, '') // Remove bullet points
      .trim();

    // Split long text into chunks (speech synthesis has limits)
    const maxLength = 200;
    const chunks = [];
    let currentChunk = '';
    
    const sentences = cleanText.split(/[.!?]+/);
    
    for (let sentence of sentences) {
      if (currentChunk.length + sentence.length > maxLength) {
        if (currentChunk) chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? '. ' : '') + sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk.trim());

    // Speak chunks sequentially
    let chunkIndex = 0;
    const speakNextChunk = () => {
      if (chunkIndex >= chunks.length) return;
      
      const utter = new SpeechSynthesisUtterance(chunks[chunkIndex]);
      utter.lang = "en-US";
      utter.rate = 0.9;
      utter.pitch = 1;
      utter.volume = 0.8;
      
      utter.onend = () => {
        chunkIndex++;
        if (chunkIndex < chunks.length) {
          setTimeout(speakNextChunk, 500); // Pause between chunks
        }
      };
      
      utter.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
        // Try to continue with next chunk
        chunkIndex++;
        if (chunkIndex < chunks.length) {
          setTimeout(speakNextChunk, 1000);
        }
      };
      
      synth.speak(utter);
    };

    speakNextChunk();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      alert("File size exceeds 5MB limit. Please choose a smaller file.");
      event.target.value = "";
      return;
    }

    // Handle different file types
    if (file.type === "application/pdf") {
      await handlePdfUpload(file);
    } else if (file.type === "text/plain" || file.name.endsWith('.txt')) {
      await handleTextUpload(file);
    } else {
      alert("Please upload a PDF (.pdf) or text (.txt) file only.");
      event.target.value = "";
      return;
    }
  };

  const handleTextUpload = async (file) => {
    setLoading(true);
    try {
      const text = await file.text();
      setDocumentContent(text);
      setUploadedFileName(file.name);
      setPrompt(`I have uploaded a text document "${file.name}". Please analyze this document and provide insights.`);
      alert(`Successfully loaded "${file.name}"! You can now ask questions about the document.`);
    } catch (error) {
      console.error("Text file reading error:", error);
      alert("Error reading text file. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (file) => {
    setLoading(true);
    console.log('Starting PDF processing...', file.name);
    
    try {
      // Load PDF.js library
      const pdfjsLib = await loadPdfJs();
      console.log('PDF.js loaded successfully');
      
      const fileReader = new FileReader();
      
      fileReader.onload = async function (e) {
        try {
          console.log('File read successfully, processing PDF...');
          const arrayBuffer = e.target.result;
          const typedArray = new Uint8Array(arrayBuffer);
          
          // Load PDF document with comprehensive error handling
          const loadingTask = pdfjsLib.getDocument({
            data: typedArray,
            verbosity: 0, // Reduce console output
            useSystemFonts: true, // Better font handling
            stopAtErrors: false, // Continue processing even if some pages fail
            maxImageSize: 1024 * 1024 * 5, // 5MB max image size
            disableFontFace: false, // Enable font loading
            disableRange: false, // Enable range requests for better performance
            disableStream: false // Enable streaming
          });
          
          const pdf = await loadingTask.promise;
          console.log(`PDF loaded: ${pdf.numPages} pages`);
          
          let extractedText = "";
          
          // Extract text from all pages
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            try {
              const page = await pdf.getPage(pageNum);
              const textContent = await page.getTextContent();
              
              // Combine text items
              const pageText = textContent.items
                .map(item => item.str)
                .join(' ')
                .trim();
              
              if (pageText) {
                extractedText += `Page ${pageNum}:\n${pageText}\n\n`;
              }
              
              console.log(`Processed page ${pageNum}/${pdf.numPages}`);
            } catch (pageError) {
              console.warn(`Error processing page ${pageNum}:`, pageError);
              extractedText += `Page ${pageNum}: [Error reading page content]\n\n`;
            }
          }
          
          if (extractedText.trim()) {
            // Store document content separately and set a helpful prompt
            setDocumentContent(extractedText);
            setUploadedFileName(file.name);
            setPrompt(`I have uploaded a document "${file.name}". Please analyze this document and provide insights.`);
            
            console.log('PDF processing completed successfully');
            alert(`Successfully processed "${file.name}"! You can now ask questions about the document.`);
          } else {
            console.warn('No text content extracted from PDF');
            alert('No text content could be extracted from this PDF. It might be an image-based PDF or corrupted.');
          }
          
        } catch (pdfError) {
          console.error("PDF processing error:", pdfError);
          alert(`Error processing PDF: ${pdfError.message || 'Unknown error'}. Please try a different PDF file.`);
        } finally {
          setLoading(false);
        }
      };
      
      fileReader.onerror = function() {
        console.error("File reading error");
        alert("Error reading the file. Please try again.");
        setLoading(false);
      };
      
      // Read file as array buffer
      fileReader.readAsArrayBuffer(file);
      
    } catch (error) {
      console.error("Error loading PDF.js or initializing:", error);
      alert("Error initializing PDF reader. Please refresh the page and try again.");
      setLoading(false);
    }
  };

  const clearDocument = () => {
    setDocumentContent("");
    setUploadedFileName("");
    setPrompt("");
    const fileInput = document.getElementById("file-upload");
    if (fileInput) fileInput.value = "";
  };

  return (
    <div className="chatbox">
      {uploadedFileName && (
        <div className="document-status">
          <div className="document-info">
            📄 Document loaded: <strong>{uploadedFileName}</strong>
          </div>
          <button 
            className="btn btn-secondary clear-doc-btn" 
            onClick={clearDocument}
            title="Clear document and start fresh"
          >
            ✖️ Clear
          </button>
        </div>
      )}
      
      <div className="input-section">
        <textarea
          className="chat-textarea"
          placeholder={uploadedFileName 
            ? "Ask questions about your uploaded document..." 
            : "Ask a question, paste your notes, or upload a PDF..."
          }
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
        
        <button 
          className={`btn ${autoPlayVoice ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setAutoPlayVoice(!autoPlayVoice)}
          title={autoPlayVoice ? 'Auto-voice enabled' : 'Auto-voice disabled'}
        >
          {autoPlayVoice ? '🔊 Auto-Voice ON' : '🔇 Auto-Voice OFF'}
        </button>
        
        <div className="file-input-wrapper">
          <input 
            type="file" 
            accept=".pdf,.txt" 
            onChange={handleFileUpload}
            className="file-input"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="file-input-label">
            📄 Upload Document (PDF/TXT - Max 5MB)
          </label>
        </div>
      </div>
      
      <div className="response-section">
        <div className="response-header">
          <h3 className="response-title">AI Response</h3>
          {response && (
            <button 
              className="btn btn-secondary" 
              onClick={() => speakResponse(response, true)}
              title="Listen to response"
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