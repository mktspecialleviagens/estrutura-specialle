import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import DestinationsStrip from "@/components/DestinationsStrip";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import DestinationsGrid from "@/components/DestinationsGrid";
import ForWhoSection from "@/components/ForWhoSection";
import AboutSection from "@/components/AboutSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import StepForm from "@/components/StepForm";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import FooterCTA from "@/components/FooterCTA";

const Index = () => {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <DestinationsStrip />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <DestinationsGrid />
        <ForWhoSection />
        <AboutSection />
        <TestimonialsSection />
        <StepForm />
        <FAQSection />
        <FinalCTA />
      </main>
      <FooterCTA />
    </>
  );
};

export default Index;
