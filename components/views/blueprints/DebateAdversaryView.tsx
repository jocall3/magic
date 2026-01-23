import React, { useState } from 'react';

interface DebateTurn {
  speaker: 'USER' | 'AI';
  text: string;
  fallacyDetected?: string;
}

const DebateAdversaryView: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [persona, setPersona] = useState('Skeptical Physicist');
  const [history, setHistory] = useState<DebateTurn[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendArgument = async () => {
    if(!userInput) return;
    const userTurn: DebateTurn = { speaker: 'USER', text: userInput };
    setIsLoading(true);
    setHistory(prev => [...prev, userTurn]);
    setUserInput('');

    // MOCK API
    const aiResponse: DebateTurn = await new Promise(res => setTimeout(() => res({
      speaker: 'AI',
      text: 'While your premise is emotionally appealing, you have not provided empirical evidence to support it. Your conclusion relies on an anecdotal fallacy.',
      fallacyDetected: 'Anecdotal Fallacy'
    }), 2000));
    setHistory(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI Debate Adversary</h1>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="Debate Topic" className="p-2 bg-gray-700 rounded"/>
        <input type="text" value={persona} onChange={e => setPersona(e.target.value)} placeholder="AI Persona" className="p-2 bg-gray-700 rounded"/>
      </div>
      <div className="bg-gray-900 p-4 rounded-lg h-80 overflow-y-auto mb-4 space-y-4">
        {history.map((turn, i) => (
          <div key={i} className={`p-2 rounded-lg ${turn.speaker === 'USER' ? 'bg-cyan-800 ml-10' : 'bg-gray-700 mr-10'}`}>
            <p><strong>{turn.speaker === 'USER' ? 'You' : persona}:</strong> {turn.text}</p>
            {turn.fallacyDetected && <p className="text-red-400 text-xs mt-1"><em>Fallacy Detected: {turn.fallacyDetected}</em></p>}
          </div>
        ))}
      </div>
      <textarea value={userInput} onChange={e => setUserInput(e.target.value)} placeholder="Your argument..." disabled={isLoading || !topic} className="w-full p-2 bg-gray-700 rounded mb-2" rows={3}/>
      <button onClick={handleSendArgument} disabled={isLoading || !userInput} className="w-full p-2 bg-cyan-600 rounded disabled:opacity-50">Submit Argument</button>
    </div>
  );
};
export default DebateAdversaryView;
