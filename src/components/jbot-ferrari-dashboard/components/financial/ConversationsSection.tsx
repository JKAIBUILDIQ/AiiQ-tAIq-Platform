import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/spinner';
import { Select } from '@/components/ui/select';

interface ConversationsSectionProps {
  conversations: any[];
  setConversations: (conversations: any[]) => void;
  documents: any[];
}

export const ConversationsSection: React.FC<ConversationsSectionProps> = ({
  conversations,
  setConversations,
  documents,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState('all');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/conversations');
      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }
      const data = await response.json();
      setConversations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const filteredConversations = selectedSource === 'all'
    ? conversations
    : conversations.filter(conv => conv.source === selectedSource);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-red-500">{error}</p>
        <button
          onClick={fetchConversations}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Conversation History</h2>
        <Select
          value={selectedSource}
          onValueChange={setSelectedSource}
          className="w-48 bg-[#1a1b1f] border border-gray-700 rounded-md"
        >
          <option value="all">All Sources</option>
          <option value="ollama">Ollama</option>
          <option value="gemma">Gemma</option>
          <option value="claude">Claude</option>
        </Select>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4">
        {filteredConversations.map((conversation, index) => (
          <div
            key={index}
            className="bg-[#1a1b1f] rounded-lg p-4 hover:bg-[#2a2b2f] transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{conversation.topic || 'Untitled Conversation'}</h3>
              <span className="text-sm text-gray-400">{conversation.timestamp}</span>
            </div>
            <div className="text-gray-300 text-sm">
              <pre className="whitespace-pre-wrap font-sans">
                {conversation.messages[0]?.content || 'No messages'}
              </pre>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm px-2 py-1 rounded-full bg-blue-600">
                {conversation.source}
              </span>
              <button
                onClick={() => {/* Add view details handler */}}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 