import SmoothScroll from '@/components/SmoothScroll';
import SplashScreen from '@/components/SplashScreen';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatIsLinuxSection from '@/components/WhatIsLinuxSection';
import TransitionSection from '@/components/TransitionSection';
import PlaygroundSection from '@/components/PlaygroundSection';
import CommandExplorerSection from '@/components/CommandExplorerSection';
import DistributionsSection from '@/components/DistributionsSection';
import EcosystemSection from '@/components/EcosystemSection';
import QuizSection from '@/components/QuizSection';
import JourneyFooterSection from '@/components/JourneyFooterSection';

export default function Home() {
  return (
    <SmoothScroll>
      <SplashScreen />
      <div className="min-h-screen bg-[#F0F0F0] text-black selection:bg-[#FFC500] selection:text-black">
        <Navbar />
        <main>
          <HeroSection />
          <WhatIsLinuxSection />
          <TransitionSection />
          <PlaygroundSection />
          <CommandExplorerSection />
          <DistributionsSection />
          <EcosystemSection />
          <QuizSection />
          <JourneyFooterSection />
        </main>
      </div>
    </SmoothScroll>
  );
}
