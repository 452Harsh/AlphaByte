"use client"
import { useState, useEffect, useRef } from 'react';
import { MicrophoneIcon } from '@heroicons/react/24/outline'; // For outline style

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [savedChats, setSavedChats] = useState([]);
  const [editingMessage, setEditingMessage] = useState(null);
  const [editedText, setEditedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [language, setLanguage] = useState('en-US'); // Default language is English
  const [sound, setSound] = useState(null); // Sound indicator (for playing start/stop sound)
  const chatEndRef = useRef(null);
  const inputRef = useRef(null); // Reference to the input element for dynamic height adjustment
  const recognitionRef = useRef(null); // Reference to SpeechRecognition instance

  // Initialize speech recognition if supported by the browser
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = true; // Keep recording until stopped
      recognitionRef.current.interimResults = true; // Get results while speaking
      recognitionRef.current.lang = language; // Set the initial language

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        setInput(transcript); // Update input with the speech-to-text result
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [language]); // Update speech recognition language whenever it changes

  // Scroll to the bottom of the chat window whenever a new message is added
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Play sound when starting or stopping speech recognition
  const playSound = (action) => {
    const audio = new Audio(`/sounds/${action}.mp3`);
    setSound(audio);
    audio.play();
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (input.trim() === '') return;
  
    const userMessage = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
  
    try {
      const response = await fetch('http://127.0.0.1:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input }),  // Ensure input is wrapped in an object with 'query' key
      });
  
      const data = await response.json();
      if (response.ok) {
        // Process the bot response
        const botMessage = { sender: 'bot', text: formatResponse(data.response)};
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  
    setInput('');
  };

  // Save chat functionality
  const handleSaveChat = () => {
    if (messages.length > 0) {
      const newSavedChat = {
        id: savedChats.length + 1,
        messages,
      };
      setSavedChats((prevChats) => [...prevChats, newSavedChat]);
      setMessages([]); // Clear current chat after saving
    }
  };

  // Handle selecting a saved chat
  const handleSelectChat = (chatId) => {
    const selectedChat = savedChats.find((chat) => chat.id === chatId);
    setMessages(selectedChat ? selectedChat.messages : []);
  };

  // Handle editing a message
  const handleEditMessage = (index) => {
    const messageToEdit = messages[index];
    setEditingMessage(index);
    setEditedText(messageToEdit.text);
  };

  // Update the edited message
  const handleUpdateMessage = () => {
    if (editedText.trim() === '') return;

    const updatedMessages = [...messages];
    updatedMessages[editingMessage].text = editedText;

    setMessages(updatedMessages);
    setEditingMessage(null);
    setEditedText('');
  };

  // Cancel editing the message
  const handleCancelEdit = () => {
    setEditingMessage(null);
    setEditedText('');
  };

  // Dynamically adjust the height of the textarea based on its content
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height to auto before recalculating
      textarea.style.height = `${textarea.scrollHeight}px`; // Adjust height to fit content
    }
  };

  // Start or stop speech recognition
  const toggleSpeechRecognition = () => {
    if (isRecording) {
      recognitionRef.current.stop(); // Stop speech recognition
      playSound('stop'); // Play stop sound
      setIsRecording(false);
    } else {
      recognitionRef.current.start(); // Start speech recognition
      playSound('start'); // Play start sound
      setIsRecording(true);
    }
  };

  // Handle language selection
  const handleLanguageChange = (e) => {
    const selectedLang = e.target.value;
    setLanguage(selectedLang); // Update language
  };

  // Function to format the bot's response text
  const formatResponse = (response) => {
    // Convert newline (\n) to <br> tags
    let formattedText = response.replace(/\n/g, '<br/>');

    // Convert tab characters (\t) to spaces
    formattedText = formattedText.replace(/\t/g, '    ');

    // Convert text between ** ** to bold text
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

    // Convert URLs to clickable links
    formattedText = formattedText.replace(
      /(https?:\/\/[^\s]+)/g,
      (url) => `<a href="${url}" target="_blank" class="text-blue-500">${url}</a>`
    );

    return formattedText;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-60 bg-gray-900 text-white p-4 space-y-4">
        <h2 className="text-2xl font-semibold">Saved Chats</h2>
        <div className="space-y-2">
          {savedChats.map((chat) => (
            <button
              key={chat.id}
              className="w-full text-left p-2 rounded-lg hover:bg-gray-700"
              onClick={() => handleSelectChat(chat.id)}
            >
              Chat {chat.id}
            </button>
          ))}
        </div>
        <button
          onClick={handleSaveChat}
          className="w-full mt-4 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save Chat
        </button>
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-chat-bg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b bg-white">
          <h2 className="text-xl font-semibold">Sandalwood Bot</h2>
          {/* Language Selector */}
          <select
            value={language}
            onChange={handleLanguageChange}
            className="mt-2 p-2 bg-gray-100 text-gray-900 rounded-lg"
          >
            <option value="en-US">English</option>
            <option value="kn-IN">Kannada</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
            <option value="it-IT">Italian</option>
            <option value="ja-JP">Japanese</option>
            <option value="ko-KR">Korean</option>
            <option value="zh-CN">Chinese</option>
          </select>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {messages.map((message, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div
                className={`${
                  message.sender === 'user'
                    ? 'self-end bg-gray-200 text-gray-900 rounded-lg p-2'
                    : 'self-start bg-white text-black rounded-lg p-2'
                }`}
                dangerouslySetInnerHTML={{
                  __html: message.text, // Render HTML formatted message
                }}
              />
              {message.sender === 'user' && (
                <button
                  onClick={() => handleEditMessage(index)}
                  className="text-blue-500 p-2"
                >
                  Edit
                </button>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Chat Input Area */}
        <div className="p-4 bg-gray-100">
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleSpeechRecognition}
              className="p-3 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <MicrophoneIcon className="w-6 h-6" />
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              className="flex-1 p-3 bg-white text-gray-900 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type a message..."
            />
            <button
              onClick={handleSendMessage}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
