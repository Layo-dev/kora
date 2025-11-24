import profile1 from "@/assets/profile-1.jpg";
import profile2 from "@/assets/profile-2.jpg";
import profile3 from "@/assets/profile-3.jpg";
import profile4 from "@/assets/profile-4.jpg";
import profile5 from "@/assets/profile-5.jpg";
import profile6 from "@/assets/profile-6.jpg";

export interface Profile {
  id: number;
  name: string;
  age: number;
  image: string;
  isOnline?: boolean;
  verified?: boolean;
  relationshipGoal?: string;
  aboutMe?: string;
  personalInfo?: {
    relationshipStatus?: string;
    orientation?: string;
    familyPlans?: string;
    smoking?: string;
    drinking?: string;
    language?: string;
    education?: string;
    personality?: string;
  };
  education?: string;
  interests?: string[];
  location?: string;
}

export const profiles: Profile[] = [
  {
    id: 1,
    name: "Emma",
    age: 24,
    image: profile1,
    isOnline: true,
    verified: true,
    relationshipGoal: "Ready for a relationship",
    aboutMe: "Love hiking, good coffee, and deep conversations. Looking for someone who can make me laugh and isn't afraid of adventure.",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Straight",
      familyPlans: "Want someday",
      smoking: "Non-smoker",
      drinking: "Socially",
      language: "English",
      education: "Undergraduate degree",
      personality: "Introvert",
    },
    education: "Bachelor's in Psychology",
    interests: ["Travel", "Coffee", "Hiking", "Reading", "Photography"],
    location: "2 miles away",
  },
  {
    id: 2,
    name: "Sophie",
    age: 26,
    image: profile2,
    isOnline: false,
    verified: true,
    relationshipGoal: "Looking for something casual",
    aboutMe: "Yoga instructor and food enthusiast. Life's too short for bad vibes and bad wine.",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Straight",
      familyPlans: "Open to kids",
      smoking: "Never",
      drinking: "Often",
      language: "English, Spanish",
      education: "Graduate degree",
      personality: "Extrovert",
    },
    education: "Master's in Health Sciences",
    interests: ["Yoga", "Cooking", "Wine Tasting", "Dancing", "Wellness"],
    location: "5 miles away",
  },
  {
    id: 3,
    name: "Olivia",
    age: 23,
    image: profile3,
    isOnline: true,
    verified: false,
    relationshipGoal: "Ready for a relationship",
    aboutMe: "Artist by day, stargazer by night. Looking for my creative partner in crime.",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Bisexual",
      familyPlans: "Don't want",
      smoking: "Non-smoker",
      drinking: "Socially",
      language: "English, French",
      education: "Undergraduate degree",
      personality: "Ambivert",
    },
    education: "Bachelor's in Fine Arts",
    interests: ["Art", "Museums", "Astronomy", "Music", "Poetry"],
    location: "3 miles away",
  },
  {
    id: 4,
    name: "Mia",
    age: 27,
    image: profile4,
    isOnline: true,
    verified: true,
    relationshipGoal: "Open to anything",
    aboutMe: "Fitness junkie and dog mom. If you can keep up with me and my golden retriever, we'll get along.",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Straight",
      familyPlans: "Have and want more",
      smoking: "Non-smoker",
      drinking: "Rarely",
      language: "English",
      education: "Undergraduate degree",
      personality: "Extrovert",
    },
    education: "Bachelor's in Kinesiology",
    interests: ["Fitness", "Running", "Dogs", "Nutrition", "Beach"],
    location: "1 mile away",
  },
  {
    id: 5,
    name: "Ava",
    age: 25,
    image: profile5,
    isOnline: false,
    verified: true,
    relationshipGoal: "Ready for a relationship",
    aboutMe: "Software developer who loves board games and bubble tea. Let's debug life together.",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Straight",
      familyPlans: "Want soon",
      smoking: "Non-smoker",
      drinking: "Socially",
      language: "English, Mandarin",
      education: "Graduate degree",
      personality: "Introvert",
    },
    education: "Master's in Computer Science",
    interests: ["Gaming", "Tech", "Board Games", "Anime", "Cats"],
    location: "4 miles away",
  },
  {
    id: 6,
    name: "Isabella",
    age: 28,
    image: profile6,
    isOnline: true,
    verified: true,
    relationshipGoal: "Ready for a relationship",
    aboutMe: "Travel blogger exploring the world one city at a time. Join me on my next adventure?",
    personalInfo: {
      relationshipStatus: "Single",
      orientation: "Straight",
      familyPlans: "Open to kids",
      smoking: "Non-smoker",
      drinking: "Socially",
      language: "English, Italian, Spanish",
      education: "Undergraduate degree",
      personality: "Extrovert",
    },
    education: "Bachelor's in Journalism",
    interests: ["Travel", "Photography", "Writing", "Food", "Languages"],
    location: "6 miles away",
  },
];
