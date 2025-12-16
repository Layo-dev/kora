import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Check } from "lucide-react";

interface EditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onSave: (value: string) => void;
  initialValue?: string;
}

export const EditTextSheet = ({
  open,
  onOpenChange,
  title,
  onSave,
  initialValue = "",
}: EditSheetProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter your ${title.toLowerCase()}`}
            className="bg-muted"
          />
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} className="w-full rounded-full">
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export const EditBioSheet = ({
  open,
  onOpenChange,
  title,
  onSave,
  initialValue = "",
}: EditSheetProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSave = () => {
    onSave(value);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4">
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Write something about yourself..."
            className="bg-muted min-h-32"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground mt-2 text-right">
            {value.length}/500
          </p>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} className="w-full rounded-full">
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface SelectOption {
  value: string;
  label: string;
}

interface EditSelectSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options: SelectOption[];
  onSave: (value: string) => void;
  initialValue?: string;
}

export const EditSelectSheet = ({
  open,
  onOpenChange,
  title,
  options,
  onSave,
  initialValue = "",
}: EditSelectSheetProps) => {
  const [selected, setSelected] = useState(initialValue);

  const handleSelect = (value: string) => {
    setSelected(value);
  };

  const handleSave = () => {
    onSave(selected);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-80 overflow-y-auto">
          <div className="space-y-2">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                  selected === option.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                <span>{option.label}</span>
                {selected === option.value && <Check className="w-5 h-5" />}
              </button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} className="w-full rounded-full">
            Save
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

interface EditInterestsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: string[];
  onSave: (values: string[]) => void;
  initialValues?: string[];
}

export const EditInterestsSheet = ({
  open,
  onOpenChange,
  options,
  onSave,
  initialValues = [],
}: EditInterestsSheetProps) => {
  const [selected, setSelected] = useState<string[]>(initialValues);

  const toggleInterest = (interest: string) => {
    setSelected((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSave = () => {
    onSave(selected);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select your interests</DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-4 max-h-80 overflow-y-auto">
          <div className="flex flex-wrap gap-2">
            {options.map((interest) => (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selected.includes(interest)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
        <DrawerFooter>
          <Button onClick={handleSave} className="w-full rounded-full">
            Save ({selected.length} selected)
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full rounded-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

// Options data for various attributes
export const attributeOptions = {
  relationship_status: [
    { value: "single", label: "Single" },
    { value: "divorced", label: "Divorced" },
    { value: "separated", label: "Separated" },
    { value: "widowed", label: "Widowed" },
    { value: "complicated", label: "It's complicated" },
  ],
  sexuality: [
    { value: "straight", label: "Straight" },
    { value: "gay", label: "Gay" },
    { value: "lesbian", label: "Lesbian" },
    { value: "bisexual", label: "Bisexual" },
    { value: "pansexual", label: "Pansexual" },
    { value: "asexual", label: "Asexual" },
    { value: "queer", label: "Queer" },
    { value: "questioning", label: "Questioning" },
  ],
  children: [
    { value: "none", label: "Don't have children" },
    { value: "have", label: "Have children" },
    { value: "want", label: "Want children" },
    { value: "dont_want", label: "Don't want children" },
    { value: "open", label: "Open to children" },
  ],
  smoking: [
    { value: "never", label: "Never" },
    { value: "sometimes", label: "Sometimes" },
    { value: "regularly", label: "Regularly" },
    { value: "trying_to_quit", label: "Trying to quit" },
  ],
  drinking: [
    { value: "never", label: "Never" },
    { value: "socially", label: "Socially" },
    { value: "regularly", label: "Regularly" },
    { value: "rarely", label: "Rarely" },
  ],
  star_sign: [
    { value: "aries", label: "Aries" },
    { value: "taurus", label: "Taurus" },
    { value: "gemini", label: "Gemini" },
    { value: "cancer", label: "Cancer" },
    { value: "leo", label: "Leo" },
    { value: "virgo", label: "Virgo" },
    { value: "libra", label: "Libra" },
    { value: "scorpio", label: "Scorpio" },
    { value: "sagittarius", label: "Sagittarius" },
    { value: "capricorn", label: "Capricorn" },
    { value: "aquarius", label: "Aquarius" },
    { value: "pisces", label: "Pisces" },
  ],
  pets: [
    { value: "none", label: "No pets" },
    { value: "dog", label: "Dog" },
    { value: "cat", label: "Cat" },
    { value: "both", label: "Dog & Cat" },
    { value: "other", label: "Other pets" },
  ],
  religion: [
    { value: "agnostic", label: "Agnostic" },
    { value: "atheist", label: "Atheist" },
    { value: "buddhist", label: "Buddhist" },
    { value: "catholic", label: "Catholic" },
    { value: "christian", label: "Christian" },
    { value: "hindu", label: "Hindu" },
    { value: "jewish", label: "Jewish" },
    { value: "muslim", label: "Muslim" },
    { value: "spiritual", label: "Spiritual" },
    { value: "other", label: "Other" },
  ],
  personality: [
    { value: "intj", label: "INTJ - Architect" },
    { value: "intp", label: "INTP - Logician" },
    { value: "entj", label: "ENTJ - Commander" },
    { value: "entp", label: "ENTP - Debater" },
    { value: "infj", label: "INFJ - Advocate" },
    { value: "infp", label: "INFP - Mediator" },
    { value: "enfj", label: "ENFJ - Protagonist" },
    { value: "enfp", label: "ENFP - Campaigner" },
    { value: "istj", label: "ISTJ - Logistician" },
    { value: "isfj", label: "ISFJ - Defender" },
    { value: "estj", label: "ESTJ - Executive" },
    { value: "esfj", label: "ESFJ - Consul" },
    { value: "istp", label: "ISTP - Virtuoso" },
    { value: "isfp", label: "ISFP - Adventurer" },
    { value: "estp", label: "ESTP - Entrepreneur" },
    { value: "esfp", label: "ESFP - Entertainer" },
  ],
  education_level: [
    { value: "high_school", label: "High school" },
    { value: "some_college", label: "Some college" },
    { value: "bachelors", label: "Bachelor's degree" },
    { value: "masters", label: "Master's degree" },
    { value: "doctorate", label: "Doctorate" },
    { value: "trade_school", label: "Trade school" },
  ],
  intent: [
    { value: "dating", label: "Here to date" },
    { value: "chat", label: "Open to chat" },
    { value: "relationship", label: "Ready for a relationship" },
  ],
  gender: [
    { value: "woman", label: "Woman" },
    { value: "man", label: "Man" },
    { value: "non-binary", label: "Non-binary" },
    { value: "other", label: "Other" },
  ],
};

export const interestOptions = [
  "Travel",
  "Music",
  "Movies",
  "Reading",
  "Cooking",
  "Fitness",
  "Gaming",
  "Art",
  "Photography",
  "Dancing",
  "Hiking",
  "Yoga",
  "Coffee",
  "Wine",
  "Food",
  "Fashion",
  "Tech",
  "Sports",
  "Nature",
  "Animals",
  "Writing",
  "Comedy",
  "Meditation",
  "Volunteering",
];
