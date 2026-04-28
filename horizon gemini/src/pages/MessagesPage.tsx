import { motion } from 'motion/react';
import { Search, Send, Image, Paperclip, MoreVertical, Phone, Video, ChevronLeft } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import * as React from 'react';

const MessagesPage = () => {
  const [selectedChat, setSelectedChat] = React.useState(0);

  const chats = [
    { id: 1, name: 'Azure Hospitality', lastMsg: 'Your booking has been confirmed!', time: '5m ago', unread: 2, img: 'https://i.pravatar.cc/150?u=12' },
    { id: 2, name: 'Heritage Guides', lastMsg: 'The tour starts at 9:00 AM sharp.', time: '2h ago', unread: 0, img: 'https://i.pravatar.cc/150?u=34' },
    { id: 3, name: 'Sarah Wilson', lastMsg: 'Can you recommend a good restaurant nearby?', time: '1d ago', unread: 0, img: 'https://i.pravatar.cc/150?u=56' },
  ];

  return (
    <div className="pt-24 pb-0 h-screen flex flex-col bg-white">
      <div className="flex-grow flex overflow-hidden max-w-7xl mx-auto w-full border-x border-slate-100">
        {/* Sidebar */}
        <aside className="w-full md:w-96 flex flex-col border-r border-slate-100">
          <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <Input placeholder="Search conversations..." className="pl-12 rounded-2xl bg-slate-50 border-none h-12" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            {chats.map((chat, i) => (
              <div 
                key={chat.id} 
                onClick={() => setSelectedChat(i)}
                className={`flex items-center gap-4 p-6 cursor-pointer border-l-4 transition-all ${
                  selectedChat === i ? 'bg-brand-50/50 border-brand-600' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="relative">
                  <img src={chat.img} className="w-14 h-14 rounded-full border-2 border-white shadow-sm" alt={chat.name} />
                  {chat.unread > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-bold truncate text-slate-900">{chat.name}</div>
                    <div className="text-[10px] uppercase font-bold text-slate-400">{chat.time}</div>
                  </div>
                  <div className={`text-sm truncate ${chat.unread > 0 ? 'text-slate-900 font-bold' : 'text-slate-500 font-medium'}`}>
                    {chat.lastMsg}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Chat Window */}
        <main className="hidden md:flex flex-col flex-grow bg-slate-50/30">
          {/* Header */}
          <header className="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={chats[selectedChat].img} className="w-12 h-12 rounded-full" alt="Active" />
              <div>
                <div className="font-bold text-slate-900">{chats[selectedChat].name}</div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">Online Now</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                <Video className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </header>

          {/* Messages List */}
          <div className="flex-grow overflow-y-auto p-10 space-y-8">
            <div className="flex justify-center">
              <div className="bg-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-slate-400 border border-slate-100">
                Today, Aug 21
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <div className="flex gap-4 max-w-[80%]">
                <img src={chats[selectedChat].img} className="w-8 h-8 rounded-full self-end" alt="Avatar" />
                <div className="bg-white p-6 rounded-t-3xl rounded-br-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Hello! We've received your request for the Ocean View Suite. Everything is ready for your arrival next week.
                  </p>
                  <div className="text-[10px] font-bold text-slate-300 mt-4 uppercase">10:42 AM</div>
                </div>
              </div>

              <div className="flex gap-4 max-w-[80%] self-end">
                <div className="bg-brand-600 p-6 rounded-t-3xl rounded-bl-3xl shadow-lg">
                  <p className="text-white text-sm leading-relaxed">
                    That's perfect! Thank you so much. Is it possible to arrange for an airport pickup?
                  </p>
                  <div className="text-[10px] font-bold text-white/40 mt-4 uppercase">10:45 AM</div>
                </div>
              </div>

              <div className="flex gap-4 max-w-[80%]">
                <img src={chats[selectedChat].img} className="w-8 h-8 rounded-full self-end" alt="Avatar" />
                <div className="bg-white p-6 rounded-t-3xl rounded-br-3xl shadow-sm border border-slate-100">
                  <p className="text-slate-700 text-sm leading-relaxed">
                    Absolutely! Our private driver will be waiting for you at the terminal. Your booking has been confirmed!
                  </p>
                  <div className="text-[10px] font-bold text-slate-300 mt-4 uppercase">10:48 AM</div>
                </div>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <footer className="p-8 bg-white border-t border-slate-100">
            <div className="flex gap-4 items-center bg-slate-50 p-2 rounded-[2rem] border border-slate-100">
              <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                <Paperclip className="w-5 h-5" />
              </Button>
              <textarea 
                className="flex-grow bg-transparent border-none focus:ring-0 p-4 text-sm max-h-32 resize-none"
                placeholder="Write your message..."
                rows={1}
              />
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full text-slate-400">
                  <Image className="w-5 h-5" />
                </Button>
                <Button variant="primary" size="icon" className="rounded-full h-12 w-12 shrink-0 shadow-lg shadow-brand-500/20">
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default MessagesPage;
