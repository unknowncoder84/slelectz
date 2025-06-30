import React, { useState, useEffect, useContext, useRef } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'text' | 'file' | 'image';
  file_url?: string;
  file_name?: string;
  created_at: string;
  read: boolean;
  sender: {
    id: string;
    email: string;
    profiles?: {
      first_name: string;
      last_name: string;
      avatar_url?: string;
    };
  };
}

interface Conversation {
  id: string;
  participant_id: string;
  participant_name: string;
  participant_avatar?: string;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
}

const MessagingSystem: React.FC = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      // Set up real-time subscription for messages
      const subscription = supabase
        .channel('messages')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `receiver_id=eq.${user.id}`
        }, (payload) => {
          const newMessage = payload.new as Message;
          if (selectedConversation === newMessage.sender_id) {
            setMessages(prev => [...prev, newMessage]);
          }
          updateConversationLastMessage(newMessage);
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [user, selectedConversation]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchConversations = async () => {
    try {
      setLoading(true);
      
      // Get all conversations for the current user
      const { data: sentMessages } = await supabase
        .from('messages')
        .select('receiver_id, created_at, content, read')
        .eq('sender_id', user?.id)
        .order('created_at', { ascending: false });

      const { data: receivedMessages } = await supabase
        .from('messages')
        .select('sender_id, created_at, content, read')
        .eq('receiver_id', user?.id)
        .order('created_at', { ascending: false });

      // Combine and deduplicate conversations
      const conversationIds = new Set([
        ...sentMessages?.map(m => m.receiver_id) || [],
        ...receivedMessages?.map(m => m.sender_id) || []
      ]);

      const conversationsData: Conversation[] = [];

      for (const participantId of Array.from(conversationIds)) {
        const lastSentMessage = sentMessages?.find(m => m.receiver_id === participantId);
        const lastReceivedMessage = receivedMessages?.find(m => m.sender_id === participantId);

        let lastMessage = '';
        let lastMessageTime = '';
        let unreadCount = 0;

        if (lastSentMessage && lastReceivedMessage) {
          if (new Date(lastSentMessage.created_at) > new Date(lastReceivedMessage.created_at)) {
            lastMessage = lastSentMessage.content;
            lastMessageTime = lastSentMessage.created_at;
          } else {
            lastMessage = lastReceivedMessage.content;
            lastMessageTime = lastReceivedMessage.created_at;
            unreadCount = receivedMessages?.filter(m => 
              m.sender_id === participantId && !m.read
            ).length || 0;
          }
        } else if (lastSentMessage) {
          lastMessage = lastSentMessage.content;
          lastMessageTime = lastSentMessage.created_at;
        } else if (lastReceivedMessage) {
          lastMessage = lastReceivedMessage.content;
          lastMessageTime = lastReceivedMessage.created_at;
          unreadCount = receivedMessages?.filter(m => 
            m.sender_id === participantId && !m.read
          ).length || 0;
        }

        // Get participant details
        const { data: participantData } = await supabase
          .from('profiles')
          .select('first_name, last_name, avatar_url')
          .eq('id', participantId)
          .single();

        conversationsData.push({
          id: participantId,
          participant_id: participantId,
          participant_name: participantData ? 
            `${participantData.first_name} ${participantData.last_name}` : 
            'Unknown User',
          participant_avatar: participantData?.avatar_url,
          last_message: lastMessage,
          last_message_time: lastMessageTime,
          unread_count: unreadCount
        });
      }

      setConversations(conversationsData.sort((a, b) => 
        new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime()
      ));
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (participantId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .or(`and(sender_id.eq.${user?.id},receiver_id.eq.${participantId}),and(sender_id.eq.${participantId},receiver_id.eq.${user?.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);

      // Mark messages as read
      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', participantId)
        .eq('receiver_id', user?.id)
        .eq('read', false);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setSending(true);
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedConversation,
          content: newMessage.trim(),
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      await fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !selectedConversation) return;

    try {
      setSending(true);
      
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `messages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(filePath);

      // Save message with file
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user?.id,
          receiver_id: selectedConversation,
          content: `File: ${file.name}`,
          message_type: 'file',
          file_url: publicUrl,
          file_name: file.name
        });

      if (error) throw error;

      await fetchMessages(selectedConversation);
    } catch (error) {
      console.error('Error uploading file:', error);
    } finally {
      setSending(false);
    }
  };

  const updateConversationLastMessage = (message: Message) => {
    setConversations(prev =>
      prev.map(conv => {
        if (conv.participant_id === message.sender_id || conv.participant_id === message.receiver_id) {
          return {
            ...conv,
            last_message: message.content,
            last_message_time: message.created_at,
            unread_count: message.receiver_id === user?.id ? conv.unread_count + 1 : conv.unread_count
          };
        }
        return conv;
      })
    );
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg h-96">
        <div className="animate-pulse p-6">
          <div className="bg-gray-200 h-8 w-32 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 h-16 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in max-h-[80vh]">
      {/* Conversation List */}
      <div className="w-full md:w-80 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Inbox</h2>
        {loading ? (
          <div className="flex flex-col gap-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        ) : conversations.length === 0 ? (
          <div className="text-gray-500 text-center py-12">No conversations yet.</div>
        ) : (
          <ul className="space-y-2">
            {conversations.map(conv => (
              <li
                key={conv.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-emerald-100 ${selectedConversation === conv.id ? 'bg-emerald-50' : ''}`}
                onClick={() => { setSelectedConversation(conv.id); fetchMessages(conv.id); }}
              >
                {conv.participant_avatar ? (
                  <img src={conv.participant_avatar} alt={conv.participant_name} className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-200 flex items-center justify-center text-lg font-bold text-emerald-700">
                    {conv.participant_name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{conv.participant_name}</div>
                  <div className="text-xs text-gray-500 truncate">{conv.last_message}</div>
                </div>
                {conv.unread_count > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full animate-bounce">{conv.unread_count}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConversation ? (
          <>
            <div className="flex items-center gap-3 border-b border-gray-100 p-4 bg-gray-50">
              <button
                className="md:hidden text-gray-500 hover:text-gray-700 text-2xl mr-2"
                onClick={() => setSelectedConversation(null)}
                aria-label="Back to conversations"
              >
                &larr;
              </button>
              <div className="font-bold text-gray-900 text-lg">{conversations.find(c => c.id === selectedConversation)?.participant_name}</div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
              {loading ? (
                <div className="flex flex-col gap-4 animate-pulse">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-200 rounded-lg w-1/2"></div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="text-gray-500 text-center py-12">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl shadow-sm ${msg.sender_id === user?.id ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-200 animate-fade-in`}> 
                      <div className="text-sm">{msg.content}</div>
                      <div className="text-xs text-gray-300 mt-1 text-right">{formatTime(msg.created_at)}</div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-emerald-500 transition-colors duration-200 shadow-sm hover:shadow-md"
                disabled={sending}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !newMessage.trim()}
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold shadow hover:bg-emerald-700 transition-colors duration-200 disabled:bg-gray-300"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-gray-400">
            <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <div className="text-lg font-semibold">Select a conversation to start chatting</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingSystem; 