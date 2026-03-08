import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import AboutSection from "@/components/AboutSection";
import ResearchSection from "@/components/ResearchSection";
import GallerySection from "@/components/GallerySection";
import PublicationsSection from "@/components/PublicationsSection";
import MembersSection from "@/components/MembersSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <NewsSection />
    <AboutSection />
    <ResearchSection />
    <GallerySection />
    <PublicationsSection />
    <MembersSection />
    <Footer />
  </div>
);

export default Index;
