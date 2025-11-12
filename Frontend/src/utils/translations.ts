import { Language } from "@/context/Language";

export interface Translations {
  // Common
  home: string;
  askGita: string;
  aboutGita: string;
  chapters: string;
  meditation: string;
  yoga: string;
  profile: string;
  login: string;
  signUp: string;
  logout: string;
  createAccount: string;
  
  // Home Page
  findWisdomIn: string;
  sacredDialogue: string;
  askLifesDeepestQuestions: string;
  receivePersonalizedGuidance: string;
  fromTimelessTeachings: string;
  ofBhagavadGita: string;
  embarkOnSpiritualJourney: string;
  startSacredChat: string;
  beginYourJourney: string;
  beginYourJourneyToday: string;
  joinThousandsSeeking: string;
  wisdomAndClarity: string;
  throughSacredDialogue: string;
  enterSacredSpace: string;
  
  // Chat Page
  askForWisdom: string;
  askForWisdomHindi: string;
  send: string;
  
  // About Page
  theBhagavadGita: string;
  gitaQuote: string;
  gitaQuoteTranslation: string;
  originAndContext: string;
  originContent1: string;
  originContent2: string;
  originContent3: string;
  teachingsAndPhilosophy: string;
  teachingsContent1: string;
  teachingsContent2: string;
  teachingsContent3: string;
  highlights: {
    yearsOld: string;
    yearsOldDesc: string;
    universalTruth: string;
    universalTruthDesc: string;
    chapters: string;
    chaptersDesc: string;
    globalImpact: string;
    globalImpactDesc: string;
  };
  
  // Yoga Page
  yogaMode: string;
  findBalanceAndStrength: string;
  chooseYourLevel: string;
  beginner: string;
  intermediate: string;
  advanced: string;
  focusMode: string;
  fullscreenModeWithMinimalDistractions: string;
  enable: string;
  enabled: string;
  ambientSound: string;
  selectAmbientSound: string;
  selectLevelToView: string;
  asanas: string;
  startSession: string;
  completed: string;
  minutes: string;
  steps: string;
  previous: string;
  next: string;
  allSteps: string;
  benefits: string;
  precautions: string;
  practicing: string;
  readyToBegin: string;
  exitFocusMode: string;
  currentlyPlaying: string;
  step: string;
  of: string;
  
  // Meditation Page
  meditationMode: string;
  selectDuration: string;
  startMeditation: string;
  pause: string;
  resume: string;
  reset: string;
  exit: string;
  
  // Profile Page
  chatHistory: string;
  yogaActivity: string;
  totalSessions: string;
  totalTime: string;
  levelsCompleted: string;
  noYogaSessions: string;
  noChatHistory: string;
  
  // Chapters & Verses
  selectChapter: string;
  selectVerse: string;
  chapter: string;
  verse: string;
  chaptersOfGita: string;
  exploreTeachings: string;
  verses: string;
  sacredVerses: string;
  discoverWisdom: string;
  featuredVerse: string;
    sanskrit: string;
    english: string;
    meaning: string;
    transliteration: string;
    translation: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Common
    home: "Home",
    askGita: "Ask Gita",
    aboutGita: "About Gita",
    chapters: "Chapters",
    meditation: "Meditation",
    yoga: "Yoga",
    profile: "Profile",
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout",
    createAccount: "Create Account",
    
    // Home Page
    findWisdomIn: "Find Wisdom in",
    sacredDialogue: "Sacred Dialogue",
    askLifesDeepestQuestions: "Ask life's deepest questions and and receive personalized guidance",
    receivePersonalizedGuidance: "",
    fromTimelessTeachings: "from the timeless teachings",
    ofBhagavadGita: "of the Bhagavad Gita",
    embarkOnSpiritualJourney: "and embark on your spiritual journey.",
    startSacredChat: "Start Sacred Chat",
    beginYourJourney: "Begin Your",
    beginYourJourneyToday: "Journey Today",
    joinThousandsSeeking: "Join thousands seeking",
    wisdomAndClarity: "wisdom and clarity",
    throughSacredDialogue: "through sacred dialogue",
    enterSacredSpace: "Enter the Sacred Space",
    
    // Chat Page
    askForWisdom: "Ask for wisdom and guidance from the Bhagavad Gita...",
    askForWisdomHindi: "",
    send: "Send",
    
    // About Page
    theBhagavadGita: "The Bhagavad Gita",
    gitaQuote: '"गीता सुगीता कर्तव्या किमन्यैः शास्त्रविस्तरैः"',
    gitaQuoteTranslation: '"The Gita should be sung (studied) beautifully; what is the need for other elaborate scriptures?"',
    originAndContext: "Origin & Context",
    originContent1: "The Bhagavad Gita, meaning \"Song of God,\" is a 700-verse dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra. This sacred text forms part of the Mahabharata.",
    originContent2: "Facing a moral dilemma, Arjuna questions the purpose of duty and life. Krishna imparts timeless wisdom on dharma, karma, and the nature of reality.",
    originContent3: "The Gita addresses universal questions: What is the purpose of life? How should we act? How do we find peace?",
    teachingsAndPhilosophy: "Teachings & Philosophy",
    teachingsContent1: "The Gita presents three paths to spiritual realization: Karma Yoga (path of action), Bhakti Yoga (path of devotion), and Jnana Yoga (path of knowledge).",
    teachingsContent2: "It teaches the importance of performing one's duty without attachment to results, a concept known as Nishkama Karma.",
    teachingsContent3: "The text emphasizes selfless service, meditation, and the understanding that the true self (Atman) is eternal and beyond the physical body.",
    highlights: {
      yearsOld: "5000+ Years Old",
      yearsOldDesc: "Ancient wisdom that remains relevant today",
      universalTruth: "Universal Truth",
      universalTruthDesc: "Teachings that transcend culture and religion",
      chapters: "18 Chapters",
      chaptersDesc: "700 verses of profound spiritual guidance",
      globalImpact: "Global Impact",
      globalImpactDesc: "Studied and revered worldwide",
    },
    
    // Yoga Page
    yogaMode: "Yoga Mode",
    findBalanceAndStrength: "Find balance and strength through guided yoga practice",
    chooseYourLevel: "Choose Your Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    focusMode: "Focus Mode",
    fullscreenModeWithMinimalDistractions: "Fullscreen mode with minimal distractions during practice",
    enable: "Enable",
    enabled: "Enabled",
    ambientSound: "Ambient Sound",
    selectAmbientSound: "Select an ambient sound to play during your yoga session",
    selectLevelToView: "Select your level to view guided yoga sessions.",
    asanas: "Asanas",
    startSession: "Start Session",
    completed: "✓ Completed",
    minutes: "minutes",
    steps: "steps",
    previous: "Previous",
    next: "Next",
    allSteps: "All Steps",
    benefits: "Benefits",
    precautions: "Precautions",
    practicing: "Practicing...",
    readyToBegin: "Ready to begin",
    exitFocusMode: "Exit Focus Mode",
    currentlyPlaying: "Currently Playing",
    step: "Step",
    of: "of",
    
    // Meditation Page
    meditationMode: "Meditation Mode",
    selectDuration: "Select Duration",
    startMeditation: "Start Meditation",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    exit: "Exit",

    // Profile Page
    chatHistory: "Chat History",
    yogaActivity: "Yoga Activity",
    totalSessions: "Total Sessions",
    totalTime: "Total Time",
    levelsCompleted: "Levels Completed",
    noYogaSessions: "No yoga sessions completed yet.",
    noChatHistory: "No chat history available.",
    
    // Chapters & Verses
    selectChapter: "Select Chapter",
    selectVerse: "Select Verse",
    chapter: "Chapter",
    verse: "Verse",
    chaptersOfGita: "18 Chapters of the Gita",
    exploreTeachings: "Explore the profound teachings organized into 18 chapters, each focusing on different aspects of spiritual wisdom",
    verses: "verses",
    sacredVerses: "Sacred Verses",
    discoverWisdom: "Discover the timeless wisdom through the most profound verses of the Bhagavad Gita",
    featuredVerse: "Featured Verse",
    sanskrit: "Sanskrit",
    english: "English",
    meaning: "Meaning",
    transliteration: "Transliteration",
    translation: "Translation",
  },
  hi: {
    // Common
    home: "होम",
    askGita: "गीता से पूछें",
    aboutGita: "गीता के बारे में",
    chapters: "अध्याय",
    meditation: "ध्यान",
    yoga: "योग",
    profile: "प्रोफ़ाइल",
    login: "लॉगिन",
    signUp: "साइन अप",
    logout: "लॉगआउट",
    createAccount: "खाता बनाएं",
    
    // Home Page
    findWisdomIn: "ज्ञान खोजें",
    sacredDialogue: "पवित्र संवाद में",
    askLifesDeepestQuestions: "जीवन के गहरे प्रश्न पूछें और व्यक्तिगत मार्गदर्शन प्राप्त करें",
    receivePersonalizedGuidance: "",
    fromTimelessTeachings: "भगवद्गीता की",
    ofBhagavadGita: "शाश्वत शिक्षाओं से",
    embarkOnSpiritualJourney: "और अपनी आध्यात्मिक यात्रा शुरू करें।",
    startSacredChat: "पवित्र चैट शुरू करें",
    beginYourJourney: "अपनी",
    beginYourJourneyToday: "यात्रा आज शुरू करें",
    joinThousandsSeeking: "हजारों लोगों से जुड़ें जो खोज रहे हैं",
    wisdomAndClarity: "ज्ञान और स्पष्टता",
    throughSacredDialogue: "पवित्र संवाद के माध्यम से",
    enterSacredSpace: "पवित्र स्थान में प्रवेश करें",
    
    // Chat Page
    askForWisdom: "भगवद्गीता से ज्ञान और मार्गदर्शन प्राप्त करें...",
    askForWisdomHindi: "",
    send: "भेजें",
    
    // About Page
    theBhagavadGita: "भगवद्गीता",
    gitaQuote: '"गीता सुगीता कर्तव्या किमन्यैः शास्त्रविस्तरैः"',
    gitaQuoteTranslation: '"गीता को सुंदरता से गाया (अध्ययन) जाना चाहिए; अन्य विस्तृत शास्त्रों की क्या आवश्यकता है?"',
    originAndContext: "उत्पत्ति और संदर्भ",
    originContent1: "भगवद्गीता, जिसका अर्थ है \"भगवान का गीत,\" कुरुक्षेत्र के युद्धक्षेत्र में राजकुमार अर्जुन और भगवान कृष्ण के बीच 700 श्लोकों का संवाद है। यह पवित्र ग्रंथ महाभारत का हिस्सा है।",
    originContent2: "एक नैतिक दुविधा का सामना करते हुए, अर्जुन कर्तव्य और जीवन के उद्देश्य पर प्रश्न करता है। कृष्ण धर्म, कर्म और वास्तविकता की प्रकृति पर शाश्वत ज्ञान प्रदान करते हैं।",
    originContent3: "गीता सार्वभौमिक प्रश्नों को संबोधित करती है: जीवन का उद्देश्य क्या है? हमें कैसे कार्य करना चाहिए? हम शांति कैसे पाते हैं?",
    teachingsAndPhilosophy: "शिक्षाएं और दर्शन",
    teachingsContent1: "गीता आध्यात्मिक साक्षात्कार के तीन मार्ग प्रस्तुत करती है: कर्म योग (कर्म का मार्ग), भक्ति योग (भक्ति का मार्ग), और ज्ञान योग (ज्ञान का मार्ग)।",
    teachingsContent2: "यह परिणामों से लगाव के बिना अपने कर्तव्य का पालन करने के महत्व को सिखाती है, एक अवधारणा जिसे निष्काम कर्म के रूप में जाना जाता है।",
    teachingsContent3: "यह ग्रंथ निःस्वार्थ सेवा, ध्यान और इस समझ पर जोर देता है कि वास्तविक स्व (आत्मन) शाश्वत है और शारीरिक शरीर से परे है।",
    highlights: {
      yearsOld: "5000+ वर्ष पुराना",
      yearsOldDesc: "प्राचीन ज्ञान जो आज भी प्रासंगिक है",
      universalTruth: "सार्वभौमिक सत्य",
      universalTruthDesc: "शिक्षाएं जो संस्कृति और धर्म से परे हैं",
      chapters: "18 अध्याय",
      chaptersDesc: "गहन आध्यात्मिक मार्गदर्शन के 700 श्लोक",
      globalImpact: "वैश्विक प्रभाव",
      globalImpactDesc: "दुनिया भर में अध्ययन और सम्मानित",
    },
    
    // Yoga Page
    yogaMode: "योग मोड",
    findBalanceAndStrength: "निर्देशित योग अभ्यास के माध्यम से संतुलन और शक्ति खोजें",
    chooseYourLevel: "अपना स्तर चुनें",
    beginner: "शुरुआती",
    intermediate: "मध्यम",
    advanced: "उन्नत",
    focusMode: "फोकस मोड",
    fullscreenModeWithMinimalDistractions: "अभ्यास के दौरान न्यूनतम व्याकुलता के साथ पूर्णस्क्रीन मोड",
    enable: "सक्षम करें",
    enabled: "सक्षम",
    ambientSound: "परिवेश ध्वनि",
    selectAmbientSound: "अपने योग सत्र के दौरान बजाने के लिए एक परिवेश ध्वनि चुनें",
    selectLevelToView: "निर्देशित योग सत्र देखने के लिए अपना स्तर चुनें।",
    asanas: "आसन",
    startSession: "सत्र शुरू करें",
    completed: "✓ पूर्ण",
    minutes: "मिनट",
    steps: "चरण",
    previous: "पिछला",
    next: "अगला",
    allSteps: "सभी चरण",
    benefits: "लाभ",
    precautions: "सावधानियां",
    practicing: "अभ्यास कर रहे हैं...",
    readyToBegin: "शुरू करने के लिए तैयार",
    exitFocusMode: "फोकस मोड से बाहर निकलें",
    currentlyPlaying: "वर्तमान में चल रहा है",
    step: "चरण",
    of: "का",
    
    // Meditation Page
    meditationMode: "ध्यान मोड",
    selectDuration: "अवधि चुनें",
    startMeditation: "ध्यान शुरू करें",
    pause: "रोकें",
    resume: "जारी रखें",
    reset: "रीसेट",
    exit: "बाहर निकलें",
    
    // Profile Page
    chatHistory: "चैट इतिहास",
    yogaActivity: "योग गतिविधि",
    totalSessions: "कुल सत्र",
    totalTime: "कुल समय",
    levelsCompleted: "पूर्ण स्तर",
    noYogaSessions: "अभी तक कोई योग सत्र पूर्ण नहीं हुआ है।",
    noChatHistory: "कोई चैट इतिहास उपलब्ध नहीं है।",
    
    // Chapters & Verses
    selectChapter: "अध्याय चुनें",
    selectVerse: "श्लोक चुनें",
    chapter: "अध्याय",
    verse: "श्लोक",
    chaptersOfGita: "गीता के 18 अध्याय",
    exploreTeachings: "18 अध्यायों में व्यवस्थित गहन शिक्षाओं का अन्वेषण करें, प्रत्येक आध्यात्मिक ज्ञान के विभिन्न पहलुओं पर केंद्रित",
    verses: "श्लोक",
    sacredVerses: "पवित्र श्लोक",
    discoverWisdom: "भगवद्गीता के सबसे गहन श्लोकों के माध्यम से शाश्वत ज्ञान की खोज करें",
    featuredVerse: "विशेष श्लोक",
    sanskrit: "संस्कृत",
    english: "अंग्रेजी",
    meaning: "अर्थ",
    transliteration: "लिप्यंतरण",
    translation: "अनुवाद",
  },
  sa: {
    // Sanskrit - using English as fallback for now
    home: "Home",
    askGita: "Ask Gita",
    aboutGita: "About Gita",
    chapters: "Chapters",
    meditation: "Meditation",
    yoga: "Yoga",
    profile: "Profile",
    login: "Login",
    signUp: "Sign Up",
    logout: "Logout",
    createAccount: "Create Account",
    findWisdomIn: "Find Wisdom in",
    sacredDialogue: "Sacred Dialogue",
    askLifesDeepestQuestions: "Ask life's deepest questions and and receive personalized guidance",
    receivePersonalizedGuidance: "",
    fromTimelessTeachings: "from the timeless teachings",
    ofBhagavadGita: "of the Bhagavad Gita",
    embarkOnSpiritualJourney: "and embark on your spiritual journey.",
    startSacredChat: "Start Sacred Chat",
    beginYourJourney: "Begin Your",
    beginYourJourneyToday: "Journey Today",
    joinThousandsSeeking: "Join thousands seeking",
    wisdomAndClarity: "wisdom and clarity",
    throughSacredDialogue: "through sacred dialogue",
    enterSacredSpace: "Enter the Sacred Space",
    askForWisdom: "Ask for wisdom and guidance from the Bhagavad Gita...",
    askForWisdomHindi: "",
    send: "Send",
    theBhagavadGita: "The Bhagavad Gita",
    gitaQuote: '"गीता सुगीता कर्तव्या किमन्यैः शास्त्रविस्तरैः"',
    gitaQuoteTranslation: '"The Gita should be sung (studied) beautifully; what is the need for other elaborate scriptures?"',
    originAndContext: "Origin & Context",
    originContent1: "The Bhagavad Gita, meaning \"Song of God,\" is a 700-verse dialogue between Prince Arjuna and Lord Krishna on the battlefield of Kurukshetra. This sacred text forms part of the Mahabharata.",
    originContent2: "Facing a moral dilemma, Arjuna questions the purpose of duty and life. Krishna imparts timeless wisdom on dharma, karma, and the nature of reality.",
    originContent3: "The Gita addresses universal questions: What is the purpose of life? How should we act? How do we find peace?",
    teachingsAndPhilosophy: "Teachings & Philosophy",
    teachingsContent1: "The Gita presents three paths to spiritual realization: Karma Yoga (path of action), Bhakti Yoga (path of devotion), and Jnana Yoga (path of knowledge).",
    teachingsContent2: "It teaches the importance of performing one's duty without attachment to results, a concept known as Nishkama Karma.",
    teachingsContent3: "The text emphasizes selfless service, meditation, and the understanding that the true self (Atman) is eternal and beyond the physical body.",
    highlights: {
      yearsOld: "5000+ Years Old",
      yearsOldDesc: "Ancient wisdom that remains relevant today",
      universalTruth: "Universal Truth",
      universalTruthDesc: "Teachings that transcend culture and religion",
      chapters: "18 Chapters",
      chaptersDesc: "700 verses of profound spiritual guidance",
      globalImpact: "Global Impact",
      globalImpactDesc: "Studied and revered worldwide",
    },
    yogaMode: "Yoga Mode",
    findBalanceAndStrength: "Find balance and strength through guided yoga practice",
    chooseYourLevel: "Choose Your Level",
    beginner: "Beginner",
    intermediate: "Intermediate",
    advanced: "Advanced",
    focusMode: "Focus Mode",
    fullscreenModeWithMinimalDistractions: "Fullscreen mode with minimal distractions during practice",
    enable: "Enable",
    enabled: "Enabled",
    ambientSound: "Ambient Sound",
    selectAmbientSound: "Select an ambient sound to play during your yoga session",
    selectLevelToView: "Select your level to view guided yoga sessions.",
    asanas: "Asanas",
    startSession: "Start Session",
    completed: "✓ Completed",
    minutes: "minutes",
    steps: "steps",
    previous: "Previous",
    next: "Next",
    allSteps: "All Steps",
    benefits: "Benefits",
    precautions: "Precautions",
    practicing: "Practicing...",
    readyToBegin: "Ready to begin",
    exitFocusMode: "Exit Focus Mode",
    currentlyPlaying: "Currently Playing",
    step: "Step",
    of: "of",
    meditationMode: "Meditation Mode",
    selectDuration: "Select Duration",
    startMeditation: "Start Meditation",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    exit: "Exit",
    chatHistory: "Chat History",
    yogaActivity: "Yoga Activity",
    totalSessions: "Total Sessions",
    totalTime: "Total Time",
    levelsCompleted: "Levels Completed",
    noYogaSessions: "No yoga sessions completed yet.",
    noChatHistory: "No chat history available.",
    selectChapter: "Select Chapter",
    selectVerse: "Select Verse",
    chapter: "Chapter",
    verse: "Verse",
    chaptersOfGita: "18 Chapters of the Gita",
    exploreTeachings: "Explore the profound teachings organized into 18 chapters, each focusing on different aspects of spiritual wisdom",
    verses: "verses",
    sacredVerses: "Sacred Verses",
    discoverWisdom: "Discover the timeless wisdom through the most profound verses of the Bhagavad Gita",
    featuredVerse: "Featured Verse",
    sanskrit: "Sanskrit",
    english: "English",
    meaning: "Meaning",
    transliteration: "Transliteration",
    translation: "Translation",
  },
};

// Helper function to get translation
export const t = (key: keyof Translations, language: Language = "en"): string => {
  const value = translations[language]?.[key] ?? translations.en[key];
  return typeof value === "string" ? value : key;
};
