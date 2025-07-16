"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  AlertTriangle,
  Camera,
  MessageCircle,
  Send,
  Settings,
  User,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const [capturedImage, setCapturedImage] = useState(null);
  const [identifiedFood, setIdentifiedFood] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [userQuestion, setUserQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (aiResponse) {
      addMessage(aiResponse, "ai");
    }
  }, [aiResponse]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.error("Error accessing the camera", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureImage = async () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        setCapturedImage(imageDataUrl);
        stopCamera();

        try {
          const response = await fetch("http://localhost:5000/predict", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: imageDataUrl }),
          });

          if (!response.ok) {
            throw new Error("Failed to upload image");
          }

          const data = await response.json();
          setAiResponse(data.result);
        } catch (error) {
          console.error("Error uploading image:", error);
          setAiResponse(
            "Sorry, there was an error processing your image. Please try again."
          );
        }
      }
    }
  };

  const handleRecapture = () => {
    setCapturedImage(null);
    setIdentifiedFood(null);
    setIngredients([]);
    setAllergens([]);
    setMessages([]);
    setAiResponse("");
    startCamera();
  };

  const handleAskQuestion = async () => {
    if (userQuestion.trim()) {
      addMessage(userQuestion, "user");
      setUserQuestion("");

      try {
        const response = await fetch("http://localhost:5000/talk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: userQuestion }),
        });

        if (!response.ok) {
          throw new Error("Failed to get AI response");
        }

        const data = await response.json();
        setAiResponse(data.result);
      } catch (error) {
        console.error("Error getting AI response:", error);
        setAiResponse(
          "I'm sorry, but there was an error processing your question. Please try again later."
        );
      }
    }
  };

  const addMessage = (text, sender) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), text, sender },
    ]);
  };

  return (
    <div className='max-w-md mx-auto p-4 space-y-4 bg-gray-900 text-gray-100'>
      <div className='flex justify-between items-center'>
        <Link href='/profile'>
          <div className='w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center'>
            <User className='text-blue-400 w-6 h-6' />
          </div>
        </Link>
        <button className='p-2 rounded-full hover:bg-gray-800'>
          <Settings className='text-blue-400 w-6 h-6' />
        </button>
      </div>

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <div className='bg-blue-600 text-gray-100 p-4 rounded-t-lg'>
          <h2 className='text-xl font-bold'>AI Food Identifier</h2>
          <p className='text-blue-200'>
            Capture a photo of your food to get started
          </p>
        </div>
        <div className='space-y-4 p-4'>
          {capturedImage ? (
            <img
              src={capturedImage}
              alt='Captured food'
              className='w-full h-64 object-cover rounded-md'
            />
          ) : (
            <div className='relative w-full h-64 bg-gray-700 rounded-md overflow-hidden'>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className='absolute inset-0 w-full h-full object-cover'
              />
              <canvas
                ref={canvasRef}
                className='hidden'
                width='640'
                height='480'
              />
              <div className='absolute inset-0 flex items-center justify-center'>
                <Camera size={48} className='text-blue-400' />
              </div>
            </div>
          )}
          {capturedImage ? (
            <button
              onClick={handleRecapture}
              className='w-full bg-blue-600 hover:bg-blue-700 text-gray-100 py-2 rounded-md flex items-center justify-center'>
              <RefreshCw className='w-5 h-5 mr-2' />
              Recapture
            </button>
          ) : (
            <>
              <button
                onClick={isCameraActive ? captureImage : startCamera}
                className='w-full bg-blue-600 hover:bg-blue-700 text-gray-100 py-2 rounded-md'>
                {isCameraActive ? "Capture Food" : "Start Camera"}
              </button>
              {isCameraActive && (
                <button
                  onClick={stopCamera}
                  className='w-full bg-red-600 hover:bg-red-700 text-gray-100 py-2 rounded-md'>
                  Stop Camera
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {identifiedFood && (
        <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
          <div className='p-4'>
            <h3 className='text-xl font-bold text-blue-400'>
              {identifiedFood}
            </h3>
            <p className='text-gray-400'>
              Identified ingredients and allergens
            </p>
          </div>
          <div className='px-4 pb-4 space-y-2'>
            <div>
              <strong className='text-gray-300'>Ingredients:</strong>{" "}
              <span className='text-gray-400'>{ingredients.join(", ")}</span>
            </div>
            <div className='flex items-center space-x-2'>
              <AlertTriangle className='text-yellow-500' />
              <span>
                <strong className='text-gray-300'>Allergens:</strong>{" "}
                <span className='text-yellow-400'>{allergens.join(", ")}</span>
              </span>
            </div>
          </div>
        </div>
      )}

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <div className='p-4'>
          <h3 className='text-xl font-bold text-blue-400'>Chat with AI</h3>
          <p className='text-gray-400'>Get information and allergen warnings</p>
        </div>
        <div className='p-4'>
          <div ref={chatRef} className='h-64 overflow-y-auto space-y-2 mb-4'>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[80%] rounded-lg p-2 ${
                    message.sender === "user"
                      ? "bg-blue-600 text-gray-100"
                      : "bg-gray-700 text-gray-100"
                  }`}>
                  {message.text}
                </div>
              </div>
            ))}
          </div>
          <div className='flex space-x-2'>
            <input
              type='text'
              value={userQuestion}
              onChange={(e) => setUserQuestion(e.target.value)}
              placeholder='Ask about allergens or ingredients...'
              className='flex-grow bg-gray-700 text-gray-100 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
            <button
              onClick={handleAskQuestion}
              className='bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded-md'>
              <Send className='w-4 h-4' />
            </button>
          </div>
        </div>
      </div>

      <div className='bg-gray-800 shadow-lg rounded-lg overflow-hidden'>
        <div className='p-4'>
          <h3 className='text-xl font-bold text-blue-400'>
            Community Insights
          </h3>
          <p className='text-gray-400'>
            Learn from others and share your knowledge
          </p>
        </div>
        <div className='px-4 pb-4 space-y-2'>
          <div className='flex items-center space-x-2 p-2 bg-gray-700 rounded-md'>
            <div className='w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-gray-100'>
              NJ
            </div>
            <div>
              <p className='text-sm font-medium text-gray-300'>
                Nutritionist Jane
              </p>
              <p className='text-xs text-gray-400'>
                Try adding some vegetables for a balanced meal!
              </p>
            </div>
          </div>
          <div className='flex items-center space-x-2 p-2 bg-gray-700 rounded-md'>
            <div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-gray-100'>
              CM
            </div>
            <div>
              <p className='text-sm font-medium text-gray-300'>Chef Mike</p>
              <p className='text-xs text-gray-400'>
                For a nut-free alternative, try sunflower seed butter.
              </p>
            </div>
          </div>
        </div>
        <div className='p-4'>
          <button className='w-full border border-blue-500 text-blue-400 hover:bg-blue-900 py-2 rounded-md flex items-center justify-center'>
            <MessageCircle className='w-4 h-4 mr-2' /> Join the Conversation
          </button>
        </div>
      </div>
    </div>
  );
}
