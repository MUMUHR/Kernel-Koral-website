import SmoothScroll from '@/components/SmoothScroll';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import WhatIsLinuxSection from '@/components/WhatIsLinuxSection';
import TransitionSection from '@/components/TransitionSection';
import PlaygroundSection from '@/components/PlaygroundSection';

export default function Home() {
  return (
    <SmoothScroll>
      <div className="min-h-screen bg-[#F0F0F0] text-black selection:bg-[#FFC500] selection:text-black">
        <Navbar />
        <main>
          <HeroSection />
          <WhatIsLinuxSection />
          <TransitionSection />
          <PlaygroundSection />
        </main>
      </div>
    </SmoothScroll>
  );
}
