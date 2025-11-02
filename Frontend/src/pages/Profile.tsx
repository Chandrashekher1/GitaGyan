import React, { useState, useEffect } from 'react';
import { User, MessageCircle, Calendar, Search, Trash2, Download, Star } from 'lucide-react';

// ✅ Inline type definitions
interface Verse {
  sanskrit: string;
  english: string;
  meaning: string;
  chapter: number;
  verseNumber: number;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  category?: string;
  timestamp: Date;
  verse?: Verse;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: Date;
  lastUpdated: Date;
  messages: ChatMessage[];
}

const Profile: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock user data
  const userData = {
    name: 'Spiritual Seeker',
    email: 'seeker@gitagyan.com',
    joinDate: new Date('2024-01-15'),
    totalQuestions: 47,
    favoriteChapter: 'Chapter 2 - Sankhya Yoga',
    streak: 12
  };

  // Load chat sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('gitagyan-chat-sessions');
    if (savedSessions) {
      const sessions = JSON.parse(savedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        lastUpdated: new Date(session.lastUpdated),
        messages: session.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }))
      }));
      setChatSessions(sessions);
    } else {
      // Demo data
      const sampleSessions: ChatSession[] = [
        {
          id: '1',
          title: 'Finding Life Purpose',
          createdAt: new Date('2024-01-20'),
          lastUpdated: new Date('2024-01-20'),
          messages: [
            {
              id: '1',
              type: 'user',
              content: 'How do I find my life purpose according to the Gita?',
              category: 'spiritual',
              timestamp: new Date('2024-01-20T10:00:00')
            },
            {
              id: '2',
              type: 'bot',
              content:
                'According to the Bhagavad Gita, your life purpose is found through understanding your dharma - your righteous duty...',
              timestamp: new Date('2024-01-20T10:01:00'),
              verse: {
                sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।',
                english: 'karmaṇy evādhikāras te mā phaleṣu kadācana',
                meaning:
                  'You have the right to perform action, but never to its fruits...',
                chapter: 2,
                verseNumber: 47
              }
            }
          ]
        }
      ];
      setChatSessions(sampleSessions);
      localStorage.setItem('gitagyan-chat-sessions', JSON.stringify(sampleSessions));
    }
  }, []);

  const filteredSessions = chatSessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.messages.some((msg) =>
        msg.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const deleteSession = (id: string) => {
    const updated = chatSessions.filter((s) => s.id !== id);
    setChatSessions(updated);
    localStorage.setItem('gitagyan-chat-sessions', JSON.stringify(updated));
    if (selectedSession?.id === id) setSelectedSession(null);
  };

  const exportSession = (session: ChatSession) => {
    const content = `Chat Session: ${session.title}\nDate: ${session.createdAt.toLocaleDateString()}\n\n${session.messages
      .map(
        (msg) =>
          `${msg.type === 'user' ? 'You' : 'GitaGyan'}: ${msg.content}${
            msg.verse
              ? `\n\nVerse: ${msg.verse.sanskrit}\nTranslation: ${msg.verse.meaning}`
              : ''
          }`
      )
      .join('\n\n')}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${session.title.replace(/\s+/g, '_')}_chat.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-xl">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-orange-800 mb-4">Your Profile</h1>
          <p className="text-xl text-orange-600 mx-auto">
            Track your spiritual journey and revisit past conversations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8 mb-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Joined</span>
                  </div>
                  <span className="font-semibold text-gray-800">
                    {userData.joinDate.toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <MessageCircle className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Questions Asked</span>
                  </div>
                  <span className="font-semibold text-gray-800">{userData.totalQuestions}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-orange-600" />
                    <span className="text-gray-700">Daily Streak</span>
                  </div>
                  <span className="font-semibold text-gray-800">{userData.streak} days</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-orange-500 to-amber-600 rounded-xl text-white">
                <h3 className="font-semibold mb-2">Favorite Chapter</h3>
                <p className="text-orange-100 text-sm">{userData.favoriteChapter}</p>
              </div>
            </div>
          </div>

          {/* Chat History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Chat History</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No conversations found
                  </h3>
                  <p className="text-gray-500">
                    Start a conversation to see your chat history here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`border rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                        selectedSession?.id === session.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                      }`}
                      onClick={() =>
                        setSelectedSession(
                          selectedSession?.id === session.id ? null : session
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800 mb-1">{session.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{session.createdAt.toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{session.messages.length} messages</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              exportSession(session);
                            }}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Export chat"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteSession(session.id);
                            }}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete chat"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {selectedSession?.id === session.id && (
                        <div className="mt-4 pt-4 border-t border-orange-200 space-y-4 max-h-96 overflow-y-auto">
                          {session.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div className={`max-w-3xl ${msg.type === 'user' ? 'ml-12' : 'mr-12'}`}>
                                <div
                                  className={`rounded-2xl px-4 py-3 ${
                                    msg.type === 'user'
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  <p className="text-sm">{msg.content}</p>
                                  <p
                                    className={`text-xs mt-2 ${
                                      msg.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                                    }`}
                                  >
                                    {msg.timestamp.toLocaleTimeString()}
                                  </p>
                                </div>

                                {msg.verse && (
                                  <div className="mt-3 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
                                    <div className="text-center mb-3">
                                      <span className="inline-block bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-semibold">
                                        Chapter {msg.verse.chapter}, Verse {msg.verse.verseNumber}
                                      </span>
                                    </div>
                                    <p className="text-orange-800 font-sanskrit text-center mb-2 text-sm">
                                      {msg.verse.sanskrit}
                                    </p>
                                    <p className="text-gray-700 text-xs text-center italic">
                                      "{msg.verse.meaning}"
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
