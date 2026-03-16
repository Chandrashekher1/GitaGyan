export const WELLNESS_TAGS = [
  "anxiety",
  "overwhelmed",
  "sadness",
  "anger",
  "stress",
  "focus",
  "sleep",
  "energy",
  "balance",
  "grounding",
  "confidence",
] as const;

export type WellnessTag = (typeof WELLNESS_TAGS)[number];

export interface YogaPoseCatalogItem {
  id: number;
  name: string;
  nameHindi: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  benefits: string[];
  imageUrl: string;
  mentalHealthTags: WellnessTag[];
}

export interface MeditationSoundCatalogItem {
  id: string;
  name: string;
  description: string;
  type: "chanting" | "instrumental" | "nature" | "bells";
  file: string;
  mentalHealthTags: WellnessTag[];
}

export const YOGA_POSES: YogaPoseCatalogItem[] = [
  {
    id: 1,
    name: "Tadasana (Mountain Pose)",
    nameHindi: "ताड़ासन",
    difficulty: "beginner",
    description:
      "A foundational standing pose. It promotes balance, improves posture, and strengthens the thighs, knees, and ankles.",
    benefits: ["Improves posture", "Strengthens lower body", "Increases awareness"],
    imageUrl: "/poses/tadasana.png",
    mentalHealthTags: ["overwhelmed", "stress", "focus", "balance"],
  },
  {
    id: 2,
    name: "Vrikshasana (Tree Pose)",
    nameHindi: "वृक्षासन",
    difficulty: "beginner",
    description:
      "Improves balance and focus while strengthening the legs, ankles, and core.",
    benefits: ["Improves balance", "Strengthens legs", "Enhances focus"],
    imageUrl: "/poses/vrikshasana.png",
    mentalHealthTags: ["anxiety", "focus", "balance", "confidence"],
  },
  {
    id: 3,
    name: "Adho Mukha Svanasana (Downward-Facing Dog)",
    nameHindi: "अधोमुखश्वानासन",
    difficulty: "beginner",
    description:
      "Stretches the back, hamstrings, and calves while strengthening the arms and shoulders.",
    benefits: ["Stretches full body", "Energizes", "Relieves tension"],
    imageUrl: "/poses/adho_mukha_svanasana.png",
    mentalHealthTags: ["stress", "overwhelmed", "energy", "grounding"],
  },
  {
    id: 4,
    name: "Virabhadrasana II (Warrior II)",
    nameHindi: "वीरभद्रासन II",
    difficulty: "intermediate",
    description:
      "Builds stamina, stretches hips and groins, and strengthens legs and arms.",
    benefits: ["Builds stamina", "Stretches hips", "Strengthens legs"],
    imageUrl: "/poses/virabhadrasana_ii.png",
    mentalHealthTags: ["confidence", "anger", "energy", "focus"],
  },
  {
    id: 5,
    name: "Bhujangasana (Cobra Pose)",
    nameHindi: "भुजंगासन",
    difficulty: "beginner",
    description:
      "Opens the chest, strengthens the spine, and soothes sciatica.",
    benefits: ["Strengthens spine", "Opens chest", "Improves posture"],
    imageUrl: "/poses/bhujangasana.png",
    mentalHealthTags: ["sadness", "stress", "energy", "confidence"],
  },
  {
    id: 6,
    name: "Balasana (Child's Pose)",
    nameHindi: "बालासन",
    difficulty: "beginner",
    description:
      "A resting pose that stretches the hips, thighs, and ankles while calming the brain and relieving stress.",
    benefits: ["Calms the brain", "Stretches hips", "Relieves back pain"],
    imageUrl: "/poses/balasana.png",
    mentalHealthTags: ["anxiety", "overwhelmed", "stress", "sleep"],
  },
  {
    id: 7,
    name: "Trikonasana (Triangle Pose)",
    nameHindi: "त्रिकोणासन",
    difficulty: "intermediate",
    description:
      "Stretches the legs, muscles around the knee, ankle joints, hips, groin muscles, hamstrings, calves, shoulders, chest, and spine.",
    benefits: ["Improves digestion", "Reduces back pain", "Stretches legs"],
    imageUrl: "/poses/trikonasana.png",
    mentalHealthTags: ["overwhelmed", "stress", "balance", "focus"],
  },
  {
    id: 8,
    name: "Setu Bandhasana (Bridge Pose)",
    nameHindi: "सेतु बन्धासन",
    difficulty: "beginner",
    description:
      "Calms the brain and helps alleviate stress and mild depression, stretches the chest, neck, and spine.",
    benefits: ["Calms the brain", "Stretches chest", "Stimulates abdominal organs"],
    imageUrl: "/poses/setu_bandhasana.png",
    mentalHealthTags: ["sadness", "anxiety", "stress", "energy"],
  },
  {
    id: 9,
    name: "Shavasana (Corpse Pose)",
    nameHindi: "शवासन",
    difficulty: "beginner",
    description:
      "A pose of total relaxation, making it one of the most challenging but most rewarding yoga poses.",
    benefits: ["Deep relaxation", "Reduces headache", "Lowers blood pressure"],
    imageUrl: "/poses/shavasana.png",
    mentalHealthTags: ["anxiety", "stress", "sleep", "grounding"],
  },
  {
    id: 10,
    name: "Sukhasana (Easy Seated Pose)",
    nameHindi: "सुखासन",
    difficulty: "beginner",
    description:
      "A comfortable seated posture for meditation that strengthens the back and stretches the knees and ankles.",
    benefits: ["Improves posture", "Strengthens back", "Promotes inner calm"],
    imageUrl: "/poses/sukhasana.png",
    mentalHealthTags: ["anxiety", "overwhelmed", "focus", "grounding"],
  },
];

export const MEDITATION_SOUNDS: MeditationSoundCatalogItem[] = [
  {
    id: "om-chanting",
    name: "Om Chanting",
    description: "Sacred Om vibrations",
    type: "chanting",
    file: "/sounds/om_Chanting.mp3",
    mentalHealthTags: ["anxiety", "overwhelmed", "stress", "focus"],
  },
  {
    id: "krishna-flute",
    name: "Krishna's Flute",
    description: "Peaceful flute melodies",
    type: "instrumental",
    file: "/sounds/krishna.mp3",
    mentalHealthTags: ["sadness", "anger", "stress", "sleep"],
  },
  {
    id: "temple-bells",
    name: "Temple Bells",
    description: "Gentle temple ambience",
    type: "bells",
    file: "/sounds/temple_Sound.mp3",
    mentalHealthTags: ["overwhelmed", "anxiety", "balance", "focus"],
  },
  {
    id: "nature-sounds",
    name: "Nature Sounds",
    description: "Forest and water sounds",
    type: "nature",
    file: "/sounds/nature.mp3",
    mentalHealthTags: ["stress", "sleep", "sadness", "grounding"],
  },
];

export function findYogaPoseByName(name: string) {
  return YOGA_POSES.find((pose) => pose.name === name);
}

export function findMeditationSoundById(id: string) {
  return MEDITATION_SOUNDS.find((sound) => sound.id === id);
}

export function formatWellnessTag(tag: string) {
  return tag
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}
