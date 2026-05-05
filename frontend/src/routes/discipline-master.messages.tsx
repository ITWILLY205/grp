import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useMessageStore } from "@/lib/messageStore";
import { 
  MessageSquare, 
  Search, 
  Send, 
  Plus, 
  MoreHorizontal, 
  Phone, 
  CheckCheck,
  Zap
} from "lucide-react";

export const Route = createFileRoute('/discipline-master/messages')({
  component: MessageCenter,
});

interface Chat {
  id: number;
  name: string;
  role: 'Parent' | 'Teacher' | 'Student';
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  avatar: string;
}

const mockChats: Chat[] = [
  { id: 1, name: "Mr. Gakuba (Parent)", role: 'Parent', lastMessage: "I wanted to check on Alice's conduct marks this term.", time: "10:45 AM", unread: 2, online: true, avatar: "G" },
  { id: 2, name: "Madame Rose (Teacher)", role: 'Teacher', lastMessage: "I have submitted the behavior report for Form 4.", time: "9:30 AM", unread: 0, online: false, avatar: "R" },
  { id: 3, name: "David M. (Student)", role: 'Student', lastMessage: "Sir, I have arrived back from permission safely.", time: "Yesterday", unread: 0, online: true, avatar: "D" },
  { id: 4, name: "Mrs. Uwase (Parent)", role: 'Parent', lastMessage: "Thank you for the update on the school attendance.", time: "Yesterday", unread: 1, online: false, avatar: "U" },
];

function MessageCenter() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [inputText, setInputText] = useState("");
  const { messages, sendMessage, receiveMessage } = useMessageStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages.filter(m => m.chatId === selectedChat?.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  const handleSend = () => {
    if (!inputText.trim() || !selectedChat) return;
    sendMessage(selectedChat.id, inputText);
    setInputText("");
  };

  const handleSimulateReply = () => {
    if (!selectedChat) return;
    const replies = [
      "Thank you for your response, I understand.",
      "Can we discuss this further tomorrow?",
      "Perfect, I will inform the others.",
      "The student is ready for the meeting.",
      "Roger that, Discipline Master."
    ];
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    setTimeout(() => {
      receiveMessage(selectedChat.id, randomReply);
    }, 1000);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Sidebar - Chat List */}
      <div className="w-full md:w-80 lg:w-96 flex flex-col gap-6">
        <div className="flex flex-col gap-4">
           <div className="flex justify-between items-center px-1">
              <h1 className="text-2xl font-black text-foreground">Message Center</h1>
              <button className="bg-primary/10 text-primary p-2.5 rounded-2xl hover:bg-primary/20 transition-all shadow-sm">
                 <Plus className="h-5 w-5" />
              </button>
           </div>
           
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full bg-white border border-border px-11 py-3.5 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all shadow-sm"
              />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
           {mockChats.map((chat) => (
              <button 
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`w-full p-4 rounded-[28px] flex items-center gap-4 transition-all duration-300 ${selectedChat?.id === chat.id ? 'bg-hero-gradient text-white shadow-xl shadow-primary/20' : 'bg-white hover:bg-surface border border-border/50'}`}
              >
                 <div className="relative flex-shrink-0">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-lg ${selectedChat?.id === chat.id ? 'bg-white/20' : 'bg-primary/10 text-primary'}`}>
                       {chat.avatar}
                    </div>
                    {chat.online && <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full" />}
                 </div>
                 
                 <div className="flex-1 text-left min-w-0">
                    <div className="flex justify-between items-center">
                       <span className="font-bold text-sm block truncate">{chat.name}</span>
                       <span className={`text-[10px] whitespace-nowrap ml-2 ${selectedChat?.id === chat.id ? 'text-white/70' : 'text-muted-foreground'}`}>{chat.time}</span>
                    </div>
                    <p className={`text-xs truncate mt-1 ${selectedChat?.id === chat.id ? 'text-white/80' : 'text-muted-foreground font-medium'}`}>
                       {messages.filter(m => m.chatId === chat.id).slice(-1)[0]?.text || chat.lastMessage}
                    </p>
                 </div>
              </button>
           ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 glass-card rounded-[40px] flex flex-col overflow-hidden border-glow shadow-2xl bg-white/40 backdrop-blur-xl">
         {selectedChat ? (
            <>
               {/* Chat Header */}
               <div className="p-6 border-b border-border/50 flex justify-between items-center bg-white/50 px-8">
                  <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-lg shadow-inner">
                        {selectedChat.avatar}
                     </div>
                     <div>
                        <h2 className="font-black text-foreground">{selectedChat.name}</h2>
                        <div className="flex items-center gap-2">
                           <div className={`h-2 w-2 rounded-full ${selectedChat.online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-muted-foreground'}`} />
                           <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{selectedChat.online ? 'Active Now' : 'Offline'}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                     <button 
                        onClick={handleSimulateReply}
                        title="Simulate Receiving a Message"
                        className="p-3 hover:bg-orange-50 rounded-2xl transition-all text-orange-600 border border-orange-200 bg-orange-50/50 shadow-sm flex items-center gap-2"
                     >
                        <Zap className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase">Test Reply</span>
                     </button>
                     <button className="p-3 hover:bg-surface rounded-2xl transition-all text-primary border border-border/50 bg-white shadow-sm">
                        <Phone className="h-4 w-4" />
                     </button>
                     <button className="p-3 hover:bg-surface rounded-2xl transition-all text-muted-foreground border border-border/50 bg-white shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                     </button>
                  </div>
               </div>

               {/* Messages List Area */}
               <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 bg-surface/5 custom-scrollbar pb-12">
                  {activeMessages.map((msg) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'} gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                       <div className={`px-6 py-4 rounded-[30px] max-w-[80%] shadow-md ${msg.sender === 'me' ? 'bg-hero-gradient text-white rounded-tr-none' : 'bg-white text-foreground border border-border/50 rounded-tl-none'}`}>
                          <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                       </div>
                       <div className={`flex items-center gap-1.5 px-2`}>
                          <span className="text-[10px] text-muted-foreground font-black uppercase">{msg.timestamp}</span>
                          {msg.sender === 'me' && <CheckCheck className="h-3 w-3 text-primary" />}
                       </div>
                    </div>
                  ))}
               </div>

               {/* Input Area */}
               <div className="p-6 border-t border-border/50 bg-white/50 backdrop-blur-md">
                  <form 
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="relative flex items-center gap-4"
                  >
                     <div className="relative flex-1">
                        <input 
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder="Write your message..." 
                          className="w-full bg-white border border-border px-8 py-4 rounded-3xl text-sm focus:ring-4 focus:ring-primary/10 outline-none transition-all shadow-md pr-16"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                           <span className="text-lg opacity-40 hover:opacity-100 cursor-pointer transition-opacity">😊</span>
                        </div>
                     </div>
                     <button 
                       type="submit"
                       disabled={!inputText.trim()}
                       className="bg-hero-gradient text-white p-4 rounded-2xl shadow-xl shadow-primary/20 hover:glow-primary hover:scale-105 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                     >
                        <Send className="h-5 w-5" />
                     </button>
                  </form>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
               <div className="h-24 w-24 rounded-[40px] bg-primary/5 flex items-center justify-center shadow-inner">
                  <MessageSquare className="h-10 w-10 text-primary opacity-30" />
               </div>
               <div><h3 className="text-xl font-black">Open a conversation</h3><p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">Click a contact on the left to start messaging.</p></div>
            </div>
         )}
      </div>
    </div>
  );
}
