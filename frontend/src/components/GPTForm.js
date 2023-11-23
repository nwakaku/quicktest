import React, { useState } from 'react';
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: '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', dangerouslyAllowBrowser: true });

const GPTForm = () => {
  const [formData, setFormData] = useState({
    url: '',
    match: '',
    maxPagesToCrawl: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Assuming your server is running on http://localhost:5000
      const response = await fetch(`http://localhost:4000/crawl?url=${formData.url}&match=${formData.match}&maxPagesToCrawl=${formData.maxPagesToCrawl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data3 = await response.json();

      console.log(data3)

      // Upload the JSON content to OpenAI
      const file = await openai.files.create({
        files: [{ data: new Blob([data3], { type: 'application/json' }), name: 'file.json1' }],
        purpose: 'fine-tune',
      });
      
      console.log('File uploaded to OpenAI:', file);

      // Create OpenAI assistant with the obtained file ID
      const myAssistant = await openai.beta.assistants.create({
        instructions: "You are a developer documentation bot, and you have access to files to answer developers' questions about documentation, give links where necessary.",
        name: "Dev_Advocate",
        tools: [{ type: "retrieval" }],
        model: "gpt-3.5-turbo-1106",
        file_ids: [file.id], // Use the obtained file ID here
      });

      console.log('OpenAI Assistant created:', myAssistant);

      console.log('Form submitted successfully');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gradient-to-r from-purple-800 to-black bg-opacity-70 sm:p-8 rounded-md shadow-md w-full md:w-1/2 lg:w-1/3">
        <form onSubmit={handleSubmit} className="text-black">
          <label className="block mb-4">
            <span className="text-lg">URL:</span>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500 bg-opacity-50"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-lg">Match Pattern:</span>
            <input
              type="text"
              name="match"
              value={formData.match}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500 bg-opacity-50"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-lg">Max Pages to Crawl:</span>
            <input
              type="number"
              name="maxPagesToCrawl"
              value={formData.maxPagesToCrawl}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full focus:outline-none focus:border-blue-500 bg-opacity-50"
              required
            />
          </label>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md"
            >
              CreateGPT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GPTForm;
