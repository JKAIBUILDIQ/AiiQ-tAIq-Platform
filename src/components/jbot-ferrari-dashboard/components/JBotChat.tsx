'use client';

import { useState, useRef } from 'react';
import { MotionDiv, MotionButton, AnimatePresence } from '@/components/motion';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface JBotChatProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JBotChat({ isOpen, onClose }: JBotChatProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <AnimatePresence mode="popLayout">
            {isOpen && (
                <MotionDiv
                    key="chat-window"
                    initial={{ opacity: 0, x: 400 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 400 }}
                    transition={{ type: "spring", damping: 20 }}
                    className="fixed right-0 top-[72px] w-[420px] h-[calc(100vh-72px)] bg-[#1a1625]/80 flex flex-col z-50 backdrop-blur-xl border-l border-blue-500/20"
                >
                    <div className="p-4 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-white">JBot Ferrari Dashboard</h2>
                        <div className="flex items-center gap-2">
                            <MotionButton
                                key="menu-button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-400 hover:text-white p-2"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Bars3Icon className="w-6 h-6" />
                            </MotionButton>
                            <MotionButton
                                key="close-button"
                                onClick={onClose}
                                className="text-gray-400 hover:text-white p-2"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <XMarkIcon className="w-6 h-6" />
                            </MotionButton>
                        </div>
                    </div>
                </MotionDiv>
            )}
        </AnimatePresence>
    );
} 