"use client";


import { FiSearch } from "react-icons/fi";


export default function SearchBar() {
    return (
      
        <div className="relative">
          <FiSearch  className="absolute mt-5 left-3 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 outline-none"
          />
        </div>
    
      );
  };

 

