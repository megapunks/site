import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import TwitterNoticeSection from "@/components/TwitterNoticeSection";
import GameSection from "@/components/GameSection";
import NftGallerySection from "@/components/NftGallerySection";
import WhatsNextSection from "@/components/WhatsNextSection";
import VisionSection from "@/components/VisionSection";
import FinalLineSection from "@/components/FinalLineSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#1e1b4b] text-yellow-200 font-pixel">
      <HeroSection />
      <AboutSection />
      <TwitterNoticeSection />
      <GameSection />
       <NftGallerySection />
       <WhatsNextSection />
       <VisionSection />
       <FinalLineSection />
    </main>
  );
}
