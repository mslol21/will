import * as React from "react";
import { Bot, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";

export function VirtualAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<{role: "user" | "ai", content: string}[]>([
    { role: "ai", content: "Olá! Sou a inteligência artificial do seu Empório. Como posso ajudar nas vendas ou relatórios hoje?" }
  ]);
  const [input, setInput] = React.useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setInput("");

    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "ai", 
        content: "Ainda estou em fase de treinamento, mas em breve poderei analisar seus dados de estoque e vendas em tempo real!" 
      }]);
    }, 1000);
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Button 
              onClick={() => setIsOpen(true)}
              className="w-14 h-14 rounded-full shadow-2xl flex items-center justify-center bg-[#8B5E34] hover:bg-[#1F2A44] text-white p-0 relative group"
            >
              <Bot className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:animate-ping duration-1000"></div>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 w-[350px] shadow-2xl"
          >
            <Card className="flex flex-col h-[500px] border border-slate-200 dark:border-slate-800 overflow-hidden">
              {/* Header */}
              <div className="bg-[#1F2A44] dark:bg-slate-950 text-white p-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Empório AI</h3>
                    <p className="text-[10px] text-slate-300">Assistente Virtual</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Chat Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
                {messages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-2xl p-3 text-xs shadow-sm ${
                        msg.role === "user" 
                          ? "bg-[#8B5E34] text-white rounded-br-none" 
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700 rounded-bl-none"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-3 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
                <form onSubmit={handleSend} className="flex gap-2">
                  <Input
                    placeholder="Pergunte sobre vendas..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-900"
                  />
                  <Button type="submit" size="icon" className="shrink-0 bg-[#8B5E34] hover:bg-[#1F2A44]">
                    <Send className="w-4 h-4" />
                  </Button>
                </form>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
