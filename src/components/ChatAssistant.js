'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';

export default function ChatAssistant() {
    const [messages, setMessages] = useState([
        { id: 1, role: 'assistant', text: 'Hi! I can help you find the best stops, food, and scenic routes. Where are you heading?' }
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);
    const messageIdCounter = useRef(2); // Start from 2 since initial message has id 1

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = { id: messageIdCounter.current++, role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        // Mock AI Response
        setTimeout(() => {
            let responseText = "That sounds great! I can help you plan that.";
            const lowerInput = input.toLowerCase();

            if (lowerInput.includes('cheap') || lowerInput.includes('budget')) {
                responseText = "I found a route that saves $15 on tolls. Would you like to see it?";
            } else if (lowerInput.includes('food') || lowerInput.includes('eat')) {
                responseText = "There's a highly rated cafe 'The Coffee Club' about 50km from your start point. It has great reviews!";
            } else if (lowerInput.includes('scenic')) {
                responseText = "Taking the Grand Pacific Drive offers beautiful coastal views, though it adds 30 mins to your trip.";
            }

            setMessages(prev => [...prev, { id: messageIdCounter.current++, role: 'assistant', text: responseText }]);
        }, 1000);
    };

    return (
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', marginTop: '0' }}>
            <div style={{ padding: '1rem', borderBottom: '1px solid hsl(var(--border))', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bot size={20} color="hsl(var(--primary))" />
                <h3 style={{ fontSize: '1rem', fontWeight: '600' }}>Trip Assistant</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        style={{
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '80%',
                            background: msg.role === 'user' ? 'hsl(var(--primary))' : 'hsl(var(--background) / 0.5)',
                            color: msg.role === 'user' ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                            padding: '0.75rem',
                            borderRadius: '1rem',
                            borderBottomRightRadius: msg.role === 'user' ? '0.25rem' : '1rem',
                            borderBottomLeftRadius: msg.role === 'assistant' ? '0.25rem' : '1rem',
                            fontSize: '0.9rem',
                            lineHeight: '1.4'
                        }}
                    >
                        {msg.text}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid hsl(var(--border))', display: 'flex', gap: '0.5rem' }}>
                <input
                    type="text"
                    placeholder="Ask about stops, food..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: '1px solid hsl(var(--border))',
                        background: 'hsl(var(--background) / 0.5)',
                        color: 'hsl(var(--foreground))',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.75rem', borderRadius: '0.5rem' }}
                >
                    <Send size={18} />
                </button>
            </form>
        </div>
    );
}
