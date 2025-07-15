import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { messageApi, userApi } from '../services/api';
import { Message, User as UserType } from '../types';

const MessagesPage: React.FC = () => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState<UserType[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedUser && user) {
            fetchMessages(user.userId, selectedUser.userId);
        }
    }, [selectedUser, user]);

    const fetchUsers = async () => {
        try {
            const response = await userApi.getAllUsers();
            // Filter out current user and show potential conversation partners
            const otherUsers = response.data.filter(u => u.userId !== user?.userId);
            setConversations(otherUsers);
        } catch (err) {
            console.error('Failed to fetch users:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (userId1: string, userId2: string) => {
        try {
            // Note: The API expects Long but we're passing string IDs
            // This might need adjustment based on your backend implementation
            const response = await messageApi.getConversation(Number(userId1), Number(userId2));
            setMessages(response.data);
        } catch (err) {
            console.error('Failed to fetch messages:', err);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedUser || !user) return;

        try {
            const messageData = {
                sender: user,
                receiver: selectedUser,
                content: newMessage.trim(),
            };

            await messageApi.sendMessage(messageData);
            setNewMessage('');
            // Refresh messages
            fetchMessages(user.userId, selectedUser.userId);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Please log in to view messages.</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
                    <p className="text-gray-600 mt-2">Communicate with property owners and tenants</p>
                </div>

                <div className="card overflow-hidden" style={{ height: '600px' }}>
                    <div className="flex h-full">
                        {/* Conversations List */}
                        <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                            <div className="p-4 border-b border-gray-200">
                                <h2 className="font-semibold text-gray-900">Conversations</h2>
                            </div>

                            <div className="overflow-y-auto h-full">
                                {conversations.length === 0 ? (
                                    <div className="p-4 text-center text-gray-600">
                                        <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p>No conversations yet</p>
                                    </div>
                                ) : (
                                    conversations.map((conversation) => (
                                        <button
                                            key={conversation.userId}
                                            onClick={() => setSelectedUser(conversation)}
                                            className={`w-full p-4 text-left hover:bg-gray-100 border-b border-gray-100 transition-colors ${
                                                selectedUser?.userId === conversation.userId ? 'bg-primary-50 border-primary-200' : ''
                                            }`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {conversation.username.charAt(0).toUpperCase()}
                          </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium text-gray-900 truncate">
                                                        {conversation.username}
                                                    </p>
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conversation.userRole}
                                                    </p>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 flex flex-col">
                            {selectedUser ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 bg-white">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-primary-600 font-medium">
                          {selectedUser.username.charAt(0).toUpperCase()}
                        </span>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{selectedUser.username}</h3>
                                                <p className="text-sm text-gray-600">{selectedUser.userRole}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-gray-600 mt-8">
                                                <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                                <p>No messages yet. Start a conversation!</p>
                                            </div>
                                        ) : (
                                            messages.map((message) => (
                                                <div
                                                    key={message.id}
                                                    className={`flex ${
                                                        message.sender.userId === user.userId ? 'justify-end' : 'justify-start'
                                                    }`}
                                                >
                                                    <div
                                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                            message.sender.userId === user.userId
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-gray-200 text-gray-900'
                                                        }`}
                                                    >
                                                        <p>{message.content}</p>
                                                        <p className={`text-xs mt-1 ${
                                                            message.sender.userId === user.userId ? 'text-primary-100' : 'text-gray-500'
                                                        }`}>
                                                            {new Date(message.sentAt).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Message Input */}
                                    <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
                                        <div className="flex space-x-2">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Type your message..."
                                                className="flex-1 input-field"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!newMessage.trim()}
                                                className="btn-primary flex items-center space-x-2 px-4"
                                            >
                                                <Send className="w-4 h-4" />
                                                <span>Send</span>
                                            </button>
                                        </div>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center text-gray-600">
                                        <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
                                        <p>Choose a user from the left to start messaging</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MessagesPage;