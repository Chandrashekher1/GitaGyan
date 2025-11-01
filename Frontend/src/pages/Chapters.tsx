import React, { useEffect, useState } from "react";
import { Book, ChevronRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Chapter {
  chapter_number: number;
  name: string;
  meaning: { en: string; hi?: string };
  summary: { en: string; hi?: string };
  translation: string;
  transliteration: string;
  verses_count: number;
}

const Chapters: React.FC = () => {
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const navigate = useNavigate()

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await fetch("https://vedicscriptures.github.io/chapters/");
        const data = await response.json();
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
      }
    };

    fetchChapters();
  }, []);

  const handleVerses = (selectedChapter) => {
    navigate('/verses/' + selectedChapter)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-lg">
            <Book className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-orange-800 mb-4">18 Chapters of the Gita</h1>
          <p className="text-lg text-orange-600">
            Explore the profound teachings organized into 18 chapters, each focusing on different aspects of spiritual wisdom
          </p>
        </div>

        <div className="flex flex-wrap flex-col justify-center">
          {chapters.map((chapter) => (
            <div
              key={chapter.chapter_number}
              className={`bg-white rounded-2xl borde my-2 p-6 shadow-sm hover:shadow-md cursor-pointer transition-all duration-200 ${
                selectedChapter === chapter.chapter_number
                  ? "ring-2 ring-primary"
                  : ""
              }`}
              onClick={() =>
                setSelectedChapter(
                  selectedChapter === chapter.chapter_number
                    ? null
                    : chapter.chapter_number
                )
              }
            >
              <div className="flex items-start flex-wrap justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold dark:text-black">
                      {chapter.chapter_number}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-800">
                      {chapter.translation}
                    </h3>
                    <p className="text-sm text-orange-600 italic">
                      {chapter.meaning?.en}
                    </p>
                  </div>
                </div>
                <ChevronRight
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                    selectedChapter === chapter.chapter_number ? "rotate-90" : ""
                  }`}
                />
              </div>

              <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Book className="w-4 h-4" />
                  <span>{chapter.verses_count} verses</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4" />
                  <span>{chapter.transliteration}</span>
                </div>
              </div>

              {selectedChapter === chapter.chapter_number ? (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-800 space-y-3">
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      Summary
                    </h4>
                    <p className="text-md leading-relaxed">
                      {chapter.summary?.en}
                    </p>
                  </div>
                  <Button type="button" variant="default" onClick={() => handleVerses(selectedChapter)}>Read All Verses</Button>
                </div>
              ) : null}
            </div>
          ))}
          <div>
          </div>
        </div>

        <div className="mt-16 bg-primary dark:bg-white rounded-2xl p-8 text-white dark:text-black text-center">
          <h2 className="text-2xl font-semibold mb-4">Complete Scripture Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold mb-1">18</div>
              <p>Chapters</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">700</div>
              <p>Verses</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-1">∞</div>
              <p>Wisdom</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapters;
