'use client';

import { Heart, ArrowRight, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function LoanMatchCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/80 backdrop-blur-md rounded-xl overflow-hidden border border-gray-700/50"
    >
      <div className="relative">
        <div className="h-40 bg-gradient-to-r from-red-800 to-pink-800 overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex space-x-2">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg"
                  style={{ transform: `translateX(${(i-2)*10}px)` }}
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 to-transparent"></div>
          <div className="absolute top-4 left-4">
            <h3 className="text-xl font-bold text-white flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-400" />
              LoanMatch
              <span className="ml-2 text-sm bg-red-700 px-2 py-0.5 rounded-full">New</span>
            </h3>
            <p className="text-sm text-gray-300">Tinder for loan matching</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <h4 className="font-bold text-white mb-1">Find your perfect loan match</h4>
          <p className="text-sm text-gray-300">
            Swipe right on qualified applicants and match with the perfect loans for your portfolio.
          </p>
        </div>
        
        <div className="bg-gradient-to-r from-red-900/50 to-pink-900/50 p-3 rounded-lg mb-4 border border-red-600/30">
          <div className="flex items-center">
            <Star className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" />
            <p className="text-sm font-medium text-pink-200">
              24 new loan applications waiting for your review!
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>68 lenders active</span>
          </div>
          <div>92% match rate</div>
        </div>
        
        <Link
          href="/loan-matching"
          className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white py-2 px-4 rounded-md flex items-center justify-center transition-colors"
        >
          <span>Start Matching</span>
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </motion.div>
  );
} 

