'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  ChevronRight,
  Send,
  ArrowLeft,
  Search,
  X,
  Paperclip,
  Smile,
  Image as ImageIcon,
  MoreVertical,
  Phone,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Input } from '@/components/ui/input';

/* ── Color gradient per conversation user ── */
const userColorMap: Record<string, string> = {
  GundamHub: 'from-blue-400 to-indigo-500',
  CardStation: 'from-orange-400 to-red-400',
  HobiVault: 'from-emerald-400 to-teal-500',
};

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function MessagesPage() {
  const { navigate, conversations, messages, fetchConversations, fetchMessages, sendMessage } = useAppStore();
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showChat, setShowChat] = useState(false);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation);
  }, [selectedConversation, fetchMessages]);

  const filteredMessages = useMemo(() => {
    if (!searchQuery) return conversations;
    return conversations.filter((m: any) =>
      (m.other?.name || '').toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, conversations]);

  const handleSelectConversation = (convId: number) => {
    setSelectedConversation(convId);
    setShowChat(true);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return;
    sendMessage(selectedConversation, messageInput.trim());
    setMessageInput('');
  };

  const selectedMessage = conversations.find(
    (m: any) => m.id === selectedConversation,
  );
  const chatMessages = messages || [];

  const handleSend = () => {
    if (!messageInput.trim()) return;
    handleSendMessage();
  };

  return (
    <div className="min-h-screen bg-[hobbyco-cream]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[gray-200]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => navigate('home')}
                  className="cursor-pointer text-[gray-500] hover:text-[hobbyco-orange] transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[gray-200]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[hobbyco-dark] font-black">
                  Messages
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-black text-[hobbyco-dark]">
            Messages
          </h1>
          <p className="text-sm text-[gray-500] mt-1">
            Chat with sellers and traders
          </p>
        </div>

        {/* Two-column layout */}
        <div className="bg-white rounded-2xl border border-[gray-200] overflow-hidden shadow-sm">
          <div className="flex h-[600px] sm:h-[650px]">
            {/* ── Conversation List (Left) ── */}
            <div
              className={`w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-[gray-200] flex flex-col ${
                showChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              {/* Search */}
              <div className="p-4 border-b border-[gray-200]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-9 h-9 rounded-xl border-[gray-200] bg-[hobbyco-cream] text-xs focus-visible:ring-[hobbyco-orange]/20 focus-visible:border-[hobbyco-orange]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Conversation Items */}
              <div className="flex-1 overflow-y-auto">
                {filteredMessages.length > 0 ? (
                  filteredMessages.map((msg) => {
                    const isSelected = msg.id === selectedConversation;
                    const color =
                      userColorMap[msg.user] || 'from-gray-300 to-gray-400';
                    return (
                      <button
                        key={msg.id}
                        onClick={() => handleSelectConversation(msg.id)}
                        className={`w-full text-left flex items-center gap-3 px-4 py-3.5 transition-colors ${
                          isSelected
                            ? 'bg-[hobbyco-orange]/8 border-r-2 border-[hobbyco-orange]'
                            : 'hover:bg-[hobbyco-cream]'
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-10 h-10 rounded-full bg-[hobbyco-orange] ${color} flex items-center justify-center flex-shrink-0 relative`}
                        >
                          <span className="text-xs font-black text-white">
                            {getInitials(msg.user)}
                          </span>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span
                              className={`text-sm font-black truncate ${
                                isSelected
                                  ? 'text-[hobbyco-orange]'
                                  : 'text-[hobbyco-dark]'
                              }`}
                            >
                              {msg.user}
                            </span>
                            <span className="text-[11px] text-gray-300 flex-shrink-0">
                              {msg.time}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-0.5">
                            {msg.lastMessage}
                          </p>
                        </div>

                        {/* Unread badge */}
                        {msg.unread > 0 && (
                          <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[hobbyco-orange] text-white text-[10px] font-black flex-shrink-0">
                            {msg.unread}
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="py-12 text-center">
                    <p className="text-sm text-gray-400">
                      No conversations found
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Chat Area (Right) ── */}
            <div
              className={`flex-1 flex flex-col ${
                !showChat ? 'hidden md:flex' : 'flex'
              }`}
            >
              {selectedMessage ? (
                <>
                  {/* Chat Header */}
                  <div className="flex items-center gap-3 px-4 sm:px-5 py-3.5 border-b border-[gray-200] bg-white">
                    {/* Back button on mobile */}
                    <button
                      onClick={() => setShowChat(false)}
                      className="md:hidden p-1 -ml-1 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-500" />
                    </button>

                    <div
                      className={`w-9 h-9 rounded-full bg-[hobbyco-orange] ${
                        userColorMap[selectedMessage.user] ||
                        'from-gray-300 to-gray-400'
                      } flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-xs font-black text-white">
                        {getInitials(selectedMessage.user)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-black text-[hobbyco-dark] truncate">
                          {selectedMessage.user}
                        </h3>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      </div>
                      <p className="text-[11px] text-green-500 font-medium">
                        Active now
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <Phone className="w-4 h-4 text-gray-400" />
                      </button>
                      <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3 bg-[#FAFBFC]">
                    {/* Date separator */}
                    <div className="flex items-center gap-3 my-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-[11px] text-gray-400 font-medium">
                        Today
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>

                    {chatMessages.map((chat) => (
                      <div
                        key={chat.id}
                        className={`flex ${
                          chat.sender === 'me' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[75%] sm:max-w-[65%] ${
                            chat.sender === 'me'
                              ? 'bg-[hobbyco-orange] text-white rounded-2xl rounded-br-md'
                              : 'bg-white border border-gray-100 text-[hobbyco-dark] rounded-2xl rounded-bl-md shadow-sm'
                          } px-4 py-2.5`}
                        >
                          <p className="text-sm leading-relaxed">
                            {chat.text}
                          </p>
                          <div
                            className={`flex items-center justify-end gap-1 mt-1 ${
                              chat.sender === 'me'
                                ? 'text-white/60'
                                : 'text-gray-300'
                            }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span className="text-[10px]">{chat.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-[gray-200] bg-white p-3 sm:p-4">
                    <div className="flex items-end gap-2">
                      <div className="flex items-center gap-1">
                        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                          <Paperclip className="w-4 h-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                          <ImageIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </div>

                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type a message..."
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                          className="w-full h-10 rounded-xl border-[gray-200] bg-[hobbyco-cream] text-sm pr-10 focus-visible:ring-[hobbyco-orange]/20 focus-visible:border-[hobbyco-orange]"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <Smile className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={handleSend}
                        disabled={!messageInput.trim()}
                        className={`p-2.5 rounded-xl transition-all ${
                          messageInput.trim()
                            ? 'bg-[hobbyco-orange] text-white hover:bg-[hobbyco-orange-dark] active:scale-95 shadow-lg shadow-orange-500/20'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Empty chat state */
                <div className="flex-1 flex items-center justify-center bg-[#FAFBFC]">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-base font-black text-[hobbyco-dark]">
                      Select a conversation
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">
                      Choose a conversation to start chatting
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
