"use client"
import React, { useState } from 'react';
import ConnectButton from './ConnectButton';

const Navbar = () => {
  const [isConnected, setConnected] = useState(false);

  const handleConnect = (connected) => {
    setConnected(connected);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-800 via-black to-white text-white shadow-lg">
      <div className="container mx-auto py-4 flex justify-between">
        <a href="/" className="text-3xl text-white font-bold">GPTMarket</a>

        <ul className="flex space-x-4">
          {isConnected && (
            <>
              <li><a href="/dashboard" className="text-white hover:bg-white hover:text-black mt-2 px-4 py-2 rounded">Dashboard</a></li>
              <li><a href="/marketPlace" className="text-white hover:bg-white hover:text-black px-4 py-2 rounded">Marketplace</a></li>
            </>
          )}

          <li>
            <ConnectButton onConnect={handleConnect} />
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
