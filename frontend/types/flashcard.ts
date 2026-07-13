export interface FlashcardItem {
    id: string;
    question: string;
    answer: string;
  }
  
  export interface FlashcardDeck {
    id: string;
    name: string;
    subject: string;
    description: string;
    cardCount: number;
    masteredCount: number;
    color: "cyan" | "blue" | "violet" | "emerald";
    cards: FlashcardItem[];
  }
  
  export interface StudyProgressData {
    mastered: number;
    pending: number;
    streak: number;
    studyMinutes: number;
  }