import { useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/Language';

const Verses = () => {
  const { t } = useLanguage();
  const [selectedVerse, setSelectedVerse] = useState<string | null>(null);

  const featuredVerses = [
    {
      chapter: 2,
      verse: 47,
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
      english: "karmaṇy evādhikāras te mā phaleṣu kadācana, mā karma-phala-hetur bhūr mā te saṅgo 'stv akarmaṇi",
      meaning: "You have the right to perform action, but never to its fruits. Do not be motivated by the results of action, nor be attached to inaction."
    },
    {
      chapter: 4,
      verse: 7,
      sanskrit: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
      english: "yadā yadā hi dharmasya glānir bhavati bhārata, abhyutthānam adharmasya tadātmānaṁ sṛjāmy aham",
      meaning: "Whenever there is a decline in righteousness and an increase in unrighteousness, O Arjuna, at that time I manifest myself on earth."
    },
    {
      chapter: 9,
      verse: 22,
      sanskrit: "अनन्याश्चिन्तयन्तो मां ये जनाः पर्युपासते। तेषां नित्याभियुक्तानां योगक्षेमं वहाम्यहम्॥",
      english: "ananyāś cintayanto māṁ ye janāḥ paryupāsate, teṣāṁ nityābhiyuktānāṁ yoga-kṣemaṁ vahāmy aham",
      meaning: "For those who worship Me with exclusive devotion, meditating on My transcendental form, I provide what they lack and preserve what they have."
    },
    {
      chapter: 15,
      verse: 7,
      sanskrit: "ममैवांशो जीवलोके जीवभूतः सनातनः। मनःषष्ठानीन्द्रियाणि प्रकृतिस्थानि कर्षति॥",
      english: "mamaivāṁśo jīva-loke jīva-bhūtaḥ sanātanaḥ, manaḥ-ṣaṣṭhānīndriyāṇi prakṛti-sthāni karṣati",
      meaning: "The living entities in this material world are My eternal fragmental parts. Due to conditioned life, they are struggling very hard with the six senses, which include the mind."
    },
    {
      chapter: 7,
      verse: 19,
      sanskrit: "बहूनां जन्मनामन्ते ज्ञानवान्मां प्रपद्यते। वासुदेवः सर्वमिति स महात्मा सुदुर्लभः॥",
      english: "bahūnāṁ janmanām ante jñānavān māṁ prapadyate, vāsudevaḥ sarvam iti sa mahātmā sudurlabhaḥ",
      meaning: "After many births and deaths, he who is actually in knowledge surrenders unto Me, knowing Me to be the cause of all causes and all that is. Such a great soul is very rare."
    },
    {
      chapter: 18,
      verse: 66,
      sanskrit: "सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज। अहं त्वां सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः॥",
      english: "sarva-dharmān parityajya mām ekaṁ śaraṇaṁ vraja, ahaṁ tvāṁ sarva-pāpebhyo mokṣayiṣyāmi mā śucaḥ",
      meaning: "Abandon all varieties of religion and just surrender unto Me. I shall deliver you from all sinful reactions. Do not fear."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-full mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-orange-800 mb-4">{t("sacredVerses")}</h1>
          <p className="text-lg text-orange-600">
            {t("discoverWisdom")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {featuredVerses.map((verse) => {
            const key = `${verse.chapter}-${verse.verse}`;
            const isSelected = selectedVerse === key;

            return (
              <div
                key={key}
                className={`bg-white rounded-2xl shadow-lg border border-orange-100 p-6 transition-all duration-300 hover:shadow-xl cursor-pointer ${
                  isSelected ? 'ring-2 ring-orange-500 shadow-xl' : ''
                }`}
                onClick={() => setSelectedVerse(isSelected ? null : key)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-orange-800">
                      {t("chapter")} {verse.chapter}, {t("verse")} {verse.verse}
                    </h3>
                    <p className="text-sm text-orange-600 italic">{t("featuredVerse")}</p>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 text-orange-500 transition-transform duration-200 ${
                      isSelected ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {isSelected && (
                  <div className="mt-6 pt-6 border-t border-orange-100 space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t("sanskrit")}</h4>
                      <p className="text-xl font-sanskrit text-orange-800 leading-relaxed">
                        {verse.sanskrit}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t("transliteration")}</h4>
                      <p className="text-lg text-gray-700 italic leading-relaxed">
                        {verse.english}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">{t("translation")}</h4>
                      <p className="text-lg text-gray-800 leading-relaxed">
                        "{verse.meaning}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Explore All 700 Verses</h2>
            <p className="text-xl text-orange-100 mb-6">
              This is just a glimpse of the profound wisdom contained in the Bhagavad Gita
            </p>
            <button className="bg-white text-orange-600 px-8 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors duration-200 shadow-lg">
              Coming Soon: Complete Verse Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verses;
