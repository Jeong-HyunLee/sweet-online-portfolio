import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import PublicationsSection from "@/components/PublicationsSection";
import MembersSection from "@/components/MembersSection";
import Footer from "@/components/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <AboutSection />
    <PublicationsSection />
    <MembersSection />
    <Footer />
  </div>
);

export default Index;
