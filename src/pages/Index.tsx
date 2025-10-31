import { useState } from "react";
import Onboarding, { UserProfile } from "@/components/Onboarding";
import ChatInterface from "@/components/ChatInterface";

const Index = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleOnboardingComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
  };

  return (
    <>
      {!profile ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : (
        <ChatInterface profile={profile} />
      )}
    </>
  );
};

export default Index;
