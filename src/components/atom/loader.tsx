import React from 'react';

export default function Loader() {
  return (
    <div className="flex items-center bg-none justify-center w-full min-h-screen p-5  min-w-[100vw]">
      <div className="flex space-x-2 animate-pulse">
        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
        <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
      </div>
    </div>
  );
}
