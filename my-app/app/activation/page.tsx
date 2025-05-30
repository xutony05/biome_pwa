import React from "react";

export default function ActivationPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Got your test kit?</h1>
        <p className="text-gray-600 mb-6">Activate your kit and follow the steps to get started.</p>

        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-1">Activate your kit</h2>
          <p className="text-gray-600 mb-4">Entering your serial number and filling out a short form.</p>
          <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">Start</button>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-1">Swab Time!</h2>
          <p className="text-gray-600 mb-4">Learn how to set up and follow the instructions for collecting your sample.</p>
          <button className="bg-blue-400 text-white font-medium px-5 py-2 rounded-full hover:bg-blue-500 transition">View Instructions</button>
        </div>
      </div>
    </div>
  );
}
