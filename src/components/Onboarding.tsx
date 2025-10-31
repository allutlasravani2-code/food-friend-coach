import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Apple, Target, User } from "lucide-react";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: string;
  goal: string;
}

const Onboarding = ({ onComplete }: OnboardingProps) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const updateProfile = (field: keyof UserProfile, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleSubmit = () => {
    if (profile.age && profile.weight && profile.height && profile.gender && profile.goal) {
      onComplete(profile as UserProfile);
    }
  };

  const isStepComplete = () => {
    if (step === 1) return profile.age && profile.weight && profile.height;
    if (step === 2) return profile.gender;
    if (step === 3) return profile.goal;
    return false;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-elevated animate-in fade-in duration-500">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            {step === 1 && <User className="w-8 h-8 text-primary" />}
            {step === 2 && <Apple className="w-8 h-8 text-primary" />}
            {step === 3 && <Target className="w-8 h-8 text-primary" />}
          </div>
          <CardTitle className="text-2xl">Welcome to Your AI Diet Coach</CardTitle>
          <CardDescription>
            Let's personalize your nutrition journey (Step {step} of 3)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={profile.age || ""}
                  onChange={(e) => updateProfile("age", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="70"
                  value={profile.weight || ""}
                  onChange={(e) => updateProfile("weight", parseInt(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="175"
                  value={profile.height || ""}
                  onChange={(e) => updateProfile("height", parseInt(e.target.value))}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label>Gender</Label>
                <Select
                  value={profile.gender}
                  onValueChange={(value) => updateProfile("gender", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in slide-in-from-right duration-300">
              <div className="space-y-2">
                <Label>Fitness Goal</Label>
                <Select
                  value={profile.goal}
                  onValueChange={(value) => updateProfile("goal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lose_weight">Lose Weight</SelectItem>
                    <SelectItem value="gain_muscle">Gain Muscle</SelectItem>
                    <SelectItem value="maintain_health">Maintain Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={!isStepComplete()}
                className="flex-1 btn-primary"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!isStepComplete()}
                className="flex-1 btn-primary"
              >
                Start Coaching
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
