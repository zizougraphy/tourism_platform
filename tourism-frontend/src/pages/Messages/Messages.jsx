import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Search, Send, Image, Paperclip, MoreVertical, Phone, Video } from 'lucide-react';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Sidebar from '../../components/Sidebar/Sidebar';
import * as api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

const Messages = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [inbox, setInbox] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null); // partner_id
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingInbox, setLoadingInbox] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);

  // Fetch inbox on mount
  useEffect(() => {
    fetchInbox();
  }, []);

  // Handle passed state from "Contact Provider"
  useEffect(() => {
    if (location.state?.provider_id && !loadingInbox) {
      const pId = location.state.provider_id;
      // Ensure the provider is in the inbox, or select them if they exist
      if (!inbox.find(chat => Number(chat.partner_id) === Number(pId))) {
        setInbox(prev => [{
          partner_id: pId,
          partner_name: location.state.provider_name,
          content: 'Start of conversation',
          created_at: new Date().toISOString(),
          unread: 0
        }, ...prev]);
      }
      setSelectedChatId(pId);
    }
  }, [location.state, loadingInbox]);

  // Fetch conversation when a chat is selected
  useEffect(() => {
    if (selectedChatId) {
      fetchConversation(selectedChatId);
    }
  }, [selectedChatId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchInbox = async () => {
    try {
      const res = await api.getInbox();
      setInbox(res.data.data || []);
      if (!location.state?.provider_id && res.data.data?.length > 0) {
        setSelectedChatId(res.data.data[0].partner_id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInbox(false);
    }
  };

  const fetchConversation = async (userId) => {
    setLoadingMessages(true);
    try {
      const res = await api.getConversation(userId);
      setMessages(res.data.data || []);
      
      // Update inbox to mark read
      setInbox(prev => prev.map(chat => 
        Number(chat.partner_id) === Number(userId) ? { ...chat, is_read: 1 } : chat
      ));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChatId) return;

    try {
      const res = await api.sendMessage({ receiver_id: Number(selectedChatId), content: newMessage });
      const newMsg = res.data.data;
      
      setMessages(prev => [...prev, { ...newMsg, created_at: newMsg.sent_at || newMsg.created_at }]);
      setNewMessage('');
      
      // Update inbox with latest message
      setInbox(prev => {
        const existing = prev.find(c => Number(c.partner_id) === Number(selectedChatId));
        if (existing) {
          return [
            { ...existing, content: newMsg.content, created_at: newMsg.sent_at || newMsg.created_at },
            ...prev.filter(c => Number(c.partner_id) !== Number(selectedChatId))
          ];
        } else {
          return [{
            partner_id: selectedChatId,
            partner_name: activeChat?.partner_name || 'User',
            content: newMsg.content,
            created_at: newMsg.sent_at || newMsg.created_at
          }, ...prev];
        }
      });
    } catch (err) {
      console.error(err);
    }
  };


  const activeChat = inbox.find(c => Number(c.partner_id) === Number(selectedChatId));

  const isDashboard = location.pathname.includes('/dashboard');

  return (
    <div className={`${isDashboard ? 'flex bg-slate-50 dark:bg-slate-950 min-h-screen' : 'pt-24 pb-0 h-[calc(100vh-80px)] flex flex-col bg-white dark:bg-slate-950'}`}>
      {isDashboard && <Sidebar />}
      <div className={`flex-grow flex overflow-hidden ${isDashboard ? 'm-8 rounded-[2rem] bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 h-[calc(100vh-64px)]' : 'max-w-7xl mx-auto w-full border-x border-slate-100 dark:border-slate-800'}`}>
        {/* Sidebar */}
        <aside className="w-full md:w-96 flex flex-col border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-10">
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight font-heading dark:text-white">Messages</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input placeholder="Search conversations..." className="pl-12 rounded-2xl bg-slate-50 dark:bg-slate-800 border-none h-12" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {loadingInbox ? (
              <div className="text-center py-10 text-slate-400">Loading inbox...</div>
            ) : inbox.length > 0 ? (
              inbox.map((chat) => (
                <div 
                  key={chat.partner_id} 
                  onClick={() => setSelectedChatId(chat.partner_id)}
                  className={`flex items-center gap-4 p-6 cursor-pointer border-l-4 transition-all ${
                    Number(selectedChatId) === Number(chat.partner_id) ? 'bg-brand-50/50 dark:bg-brand-900/20 border-brand-600' : 'border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="relative">
                    <img src={`https://ui-avatars.com/api/?name=${chat.partner_name}&background=random`} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt={chat.partner_name} />
                    {chat.is_read === 0 && chat.sender_id !== user?.id && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-600 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <div className="font-bold truncate text-slate-900 dark:text-white font-heading">{chat.partner_name || 'User'}</div>
                      <div className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                        {chat.created_at ? new Date(chat.created_at).toLocaleDateString() : ''}
                      </div>
                    </div>
                    <div className={`text-sm truncate ${chat.is_read === 0 && chat.sender_id !== user?.id ? 'text-slate-900 dark:text-white font-bold' : 'text-slate-500 dark:text-slate-400 font-medium'}`}>
                      {chat.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400">No conversations yet.</div>
            )}
          </div>
        </aside>

        {/* Chat Window */}
        <main className={`${selectedChatId ? 'flex' : 'hidden'} md:flex flex-col flex-grow bg-slate-50/30 dark:bg-slate-950/50 w-full`}>
          {activeChat ? (
            <>
              {/* Header */}
              <header className="p-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <img src={`https://ui-avatars.com/api/?name=${activeChat.partner_name}&background=random`} className="w-12 h-12 rounded-full shadow-sm" alt="Active" />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white font-heading">{activeChat.partner_name || 'User'}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Active</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:bg-slate-100 hidden sm:flex">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:bg-slate-100 hidden sm:flex">
                    <Video className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:bg-slate-100">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </div>
              </header>

              {/* Messages List */}
              <div className="flex-grow overflow-y-auto p-4 md:p-10 space-y-8">
                {loadingMessages ? (
                  <div className="text-center text-slate-400">Loading messages...</div>
                ) : (
                  <div className="flex flex-col gap-6">
                    {messages.map((msg, i) => {
                      const isMe = msg.sender_id === user?.id;
                      return (
                        <div key={msg.id || i} className={`flex gap-4 max-w-[85%] md:max-w-[70%] ${isMe ? 'self-end' : ''}`}>
                          {!isMe && (
                            <img src={`https://ui-avatars.com/api/?name=${activeChat.partner_name}&background=random`} className="w-8 h-8 rounded-full self-end shadow-sm hidden sm:block" alt="Avatar" />
                          )}
                          <div className={`${isMe ? 'bg-brand-600 shadow-lg shadow-brand-600/20 text-white rounded-t-3xl rounded-bl-3xl' : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-t-3xl rounded-br-3xl'} p-4 md:p-6`}>
                            <p className="text-sm leading-relaxed font-medium">
                              {msg.content}
                            </p>
                            <div className={`text-[10px] font-bold mt-3 uppercase tracking-widest ${isMe ? 'text-brand-200' : 'text-slate-300'}`}>
                              {new Date(msg.created_at || msg.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input Area */}
              <footer className="p-4 md:p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <div className="flex gap-2 md:gap-4 items-center bg-slate-50 dark:bg-slate-800 p-2 rounded-[2rem] border border-slate-200 dark:border-slate-700 focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-500 transition-all">
                  <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-brand-600 hidden sm:flex">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <textarea 
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-grow bg-transparent border-none focus:ring-0 p-3 text-sm max-h-32 resize-none outline-none font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                    placeholder="Write your message..."
                    rows={1}
                  />
                  <div className="flex items-center gap-1 md:gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-brand-600 hidden sm:flex">
                      <Image className="w-5 h-5" />
                    </Button>
                    <Button onClick={handleSendMessage} variant="primary" size="icon" className="rounded-full h-10 w-10 md:h-12 md:w-12 shrink-0 shadow-lg shadow-brand-500/30">
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </Button>
                  </div>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex-grow flex items-center justify-center text-slate-400 font-medium h-full">
              {inbox.length === 0 ? 'No conversations yet.' : 'Select a conversation to start messaging'}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Messages;
