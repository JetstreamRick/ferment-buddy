"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UnicornScene from "unicornstudio-react";

interface AnalysisData {
  analysis: string;
  rating: number | null;
  ratingLabel: string | null;
}

export default function ResultsPage() {
  const [image, setImage] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUnicornLoaded, setIsUnicornLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Get data from sessionStorage
    const storedImage = sessionStorage.getItem("analysisImage");
    const storedAnalysis = sessionStorage.getItem("analysisResult");

    if (storedImage && storedAnalysis) {
      setImage(storedImage);
      try {
        const parsed = JSON.parse(storedAnalysis);
        setAnalysisData(parsed);
      } catch {
        // Fallback for old format or parsing errors
        setAnalysisData({
          analysis: storedAnalysis,
          rating: null,
          ratingLabel: null,
        });
      }
      // Show loading screen for a moment, then reveal content
      setTimeout(() => {
        setIsLoading(false);
        // Trigger animation after loading is done
        setTimeout(() => setIsVisible(true), 100);
      }, 800);
    } else {
      router.push("/");
    }
  }, [router]);

  // Add a timeout fallback in case onLoad doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnicornLoaded(true);
    }, 2000); // Assume loaded after 2 seconds if no callback

    return () => clearTimeout(timer);
  }, []);

  const handleNewUpload = () => {
    sessionStorage.removeItem("analysisImage");
    sessionStorage.removeItem("analysisResult");
    router.push("/");
  };

  const getRatingColor = (rating: number | null) => {
    if (!rating) return "bg-gray-400";
    if (rating <= 2) return "bg-red-600";
    if (rating <= 4) return "bg-orange-500";
    if (rating <= 6) return "bg-yellow-500";
    if (rating <= 8) return "bg-green-500";
    return "bg-emerald-600";
  };

  const getRatingEmoji = (rating: number | null) => {
    if (!rating) return "🤷";
    if (rating <= 2) return "💀";
    if (rating <= 4) return "😬";
    if (rating <= 6) return "🤔";
    if (rating <= 8) return "👍";
    return "🌟";
  };

  const getDeathVerdict = (rating: number | null) => {
    if (!rating) return "Unknown fate";
    if (rating <= 2) return "RIP in peace";
    if (rating <= 4) return "Probably gonna regret this";
    if (rating <= 6) return "50/50 chance of survival";
    if (rating <= 8) return "You'll probably live";
    return "Safe to eat!";
  };

  const getFunnySubtext = (rating: number | null) => {
    if (!rating) return "We have no idea what this is";
    if (rating <= 2) return "Call your loved ones. Maybe write a will.";
    if (rating <= 4) return "Maybe have a friend on standby with the ER number?";
    if (rating <= 6) return "It's a gamble, but you do you.";
    if (rating <= 8) return "Looks pretty safe! Probably.";
    return "This is fermentation gold! Eat with confidence!";
  };

  if (!image || !analysisData || isLoading) {
    return (
      <div className="relative min-h-screen font-sans">
        {/* Loading background - only show while UnicornScene is loading */}
        {!isUnicornLoaded && (
          <div className="fixed inset-0 w-full h-full bg-[#FFA9C6] z-0"></div>
        )}
        <div className="fixed inset-0 w-full h-full pointer-events-none">
          <UnicornScene
            projectId="6tSkyfWMOOIlSma7aqe5"
            width="100%"
            height="100%"
            scale={1}
            dpi={1.5}
            lazyLoad={true}
            production={true}
            altText="Unicorn Studio page background"
            ariaLabel="Interactive page background scene"
            onLoad={() => setIsUnicornLoaded(true)}
          />
        </div>
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
            <p className="text-white font-bold text-lg">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans">
      {/* Loading background - only show while UnicornScene is loading */}
      {!isUnicornLoaded && (
        <div className="fixed inset-0 w-full h-full bg-[#FFA9C6] z-0"></div>
      )}
      {/* Unicorn Studio Background */}
      <div className="fixed inset-0 w-full h-full pointer-events-none">
        <UnicornScene
          projectId="6tSkyfWMOOIlSma7aqe5"
          width="100%"
          height="100%"
          scale={1}
          dpi={1.5}
          lazyLoad={true}
          production={true}
          altText="Unicorn Studio page background"
          ariaLabel="Interactive page background scene"
          onLoad={() => setIsUnicornLoaded(true)}
        />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 w-full bg-[#FFA9C6] border-b border-[#1a1a1a]">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {/* Logo */}
            <Link href="/" className="text-white font-bold text-3xl font-serif" style={{ fontFamily: 'var(--font-bitblast-serif)', letterSpacing: '0.06em' }}>
              Will this ferment kill me?
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex-1 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Rating Section */}
          {analysisData.rating !== null && (
            <div className={`mb-8 rounded-3xl bg-white/95 backdrop-blur-sm p-8 shadow-2xl border-2 border-dashed border-[#FFA9C6] transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}>
              <div className="text-center">
                <div className="text-6xl mb-4">{getRatingEmoji(analysisData.rating)}</div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-bitblast-serif)', letterSpacing: '0.06em' }}>
                  {getDeathVerdict(analysisData.rating)}
                </h2>
                <p className="text-xl text-gray-600 mb-4 italic">
                  {getFunnySubtext(analysisData.rating)}
                </p>
                <p className="text-lg text-gray-500 mb-4">
                  {analysisData.ratingLabel || `Safety Rating: ${analysisData.rating}/10`}
                </p>
              </div>
            </div>
          )}

          {/* Two Column Layout: Image and Analysis */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Image Section */}
            <div className={`rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl border-2 border-dashed border-[#FFA9C6] transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-2'}`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-4" style={{ fontFamily: 'var(--font-bitblast-serif)', letterSpacing: '0.06em' }}>
                The Evidence
              </h3>
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={image}
                  alt="Analyzed fermentation"
                  className="w-full h-auto object-contain bg-gray-50"
                />
              </div>
            </div>

            {/* Analysis Results Section */}
            <div className={`rounded-3xl bg-white/95 backdrop-blur-sm p-6 shadow-2xl border-2 border-dashed border-[#FFA9C6] transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 -rotate-2'}`}>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'var(--font-bitblast-serif)', letterSpacing: '0.06em' }}>
                The Grim Details
              </h2>
              <p className="text-sm text-gray-500 mb-6 italic">What our AI thinks about your questionable life choices</p>
              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed text-lg">
                  {analysisData.analysis}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-repeat rounded-full" style={{
                backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px',
                opacity: 0.2,
                zIndex: -1
              }}></div>
              <button
                onClick={handleNewUpload}
                className="relative px-8 py-4 bg-[#32CD32] border-2 border-[#1a1a1a] text-white font-bold text-lg rounded-full hover:bg-[#28a828] transition-all duration-200"
                style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}
              >
                Upload New Image →
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-repeat rounded-full" style={{
                backgroundImage: 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a), linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 75%, #1a1a1a 75%, #1a1a1a)',
                backgroundSize: '8px 8px',
                backgroundPosition: '0 0, 4px 4px',
                opacity: 0.2,
                zIndex: -1
              }}></div>
              <Link
                href="/"
                className="relative px-8 py-4 bg-[#32CD32] border-2 border-[#1a1a1a] text-white font-bold text-lg rounded-full hover:bg-[#28a828] transition-all duration-200 text-center inline-flex items-center justify-center"
                style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}
              >
                Back to Home →
              </Link>
            </div>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#F5F1E8] border-t border-[#1a1a1a] mt-12 py-8">
        <div className="container mx-auto px-4 text-center text-[#1a1a1a] text-sm" style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}>
          <p className="mb-2">© 2024 Ferment Buddy. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
