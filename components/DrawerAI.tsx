"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "./ui/button";
import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai"; // Importing Gemini API

// Define the props for DrawerAI
interface DrawerProps {
  description?: string | null;
}

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY as string; // Set your API key from environment variables
const genAI = new GoogleGenerativeAI(apiKey); // Initialize GoogleGenerativeAI

// Gemini API model configuration
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

// DrawerAI component
const DrawerAI: React.FC<DrawerProps> = () => {
  const [open, setOpen] = useState<boolean>(false); // Properly typed state
  const [description, setDescription] = useState<string>(""); // Input state
  const [hiveSuggestion, setHiveSuggestion] = useState<string>(""); // Suggestion state
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state

  // Function to handle the Hive suggestion generation using Gemini API
  const handleHiveSuggestion = async () => {
    if (!description) {
      alert("Please enter a description");
      return;
    }
    setIsLoading(true); // Set loading state

    try {
      const chatSession = await model.startChat({
        generationConfig,
        history: [], // Empty history for now
      });

      const result = await chatSession.sendMessage(description);
      setHiveSuggestion(result.response.text()); // Set the response text from Gemini API
    } catch (error) {
      console.error("Error while asking Hive suggestion:", error); // Error handling
    } finally {
      setIsLoading(false); // Ensure loading is stopped in any case
    }
  };

  // Function to handle input changes
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  return (
    <div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger>
          <Button className="gradient-blue flex h-9 gap-1 px-4">
            Ask Your Hive 🤖
          </Button>
        </DrawerTrigger>
        <DrawerContent className="bg-[#09111f]">
          <DrawerHeader>
            <DrawerTitle>
              Oyyy! Hive Here! I am Helping you with Your Writing and Research
              Work Here 📝
            </DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <input
              type="text"
              value={description}
              onChange={handleChange}
              className="w-full p-2 bg-gray-800 text-white rounded"
              placeholder="Enter your description..."
            />
          </div>

          <DrawerFooter>
            <Button
              onClick={handleHiveSuggestion}
              className="gradient-blue flex h-9 gap-1 px-4"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Suggestion"}
            </Button>
          </DrawerFooter>

          {hiveSuggestion && (
            <div className="p-4 text-white">
              <h3 className="font-bold">Hive Suggestion:</h3>
              <p>{hiveSuggestion}</p>
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default DrawerAI;
