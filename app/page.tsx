"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import UnicornScene from "unicornstudio-react";

export default function Home() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnicornLoaded, setIsUnicornLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setIsAnalyzing(false);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const analyzeImage = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageBase64 }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze image");
      }

      const data = await response.json();
      
      // Store image and analysis in sessionStorage for results page
      sessionStorage.setItem("analysisImage", imageBase64);
      sessionStorage.setItem("analysisResult", JSON.stringify(data)); // Store as JSON
      
      // Navigate to results page
      router.push("/results");
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err instanceof Error ? err.message : "Failed to analyze image");
      setIsAnalyzing(false);
    }
  };

  // Automatically analyze when image is uploaded
  useEffect(() => {
    if (uploadedImage && !isAnalyzing) {
      analyzeImage(uploadedImage);
    }
  }, [uploadedImage]);

  // Add a timeout fallback in case onLoad doesn't fire
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsUnicornLoaded(true);
    }, 2000); // Assume loaded after 2 seconds if no callback

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-transparent font-sans">
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
        {/* Main Navigation */}
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
        <div className="max-w-2xl mx-auto">
          {/* Upload Area */}
          <div
            className={`relative rounded-3xl bg-white/95 backdrop-blur-sm p-8 md:p-12 shadow-2xl border-2 border-dashed transition-all duration-300 overflow-hidden ${
              isDragging
                ? "border-[#FFA9C6] scale-[1.02]"
                : "border-[#FFA9C6]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative z-10">
              {uploadedImage ? (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden border-4 border-[#FFD700]">
                    <img
                      src={uploadedImage}
                      alt="Uploaded fermentation"
                      className="w-full h-auto max-h-[500px] object-contain bg-gray-50"
                    />
                    {isAnalyzing && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-4"></div>
                          <p className="text-white font-bold text-lg">Analyzing your fermentation...</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="rounded-xl bg-red-50 border-2 border-red-300 p-4">
                      <p className="text-red-800 font-medium">{error}</p>
                      <button
                        onClick={() => setError(null)}
                        className="mt-2 text-red-600 text-sm hover:underline"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                  {!isAnalyzing && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 top-2 left-2 rounded-full" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 10px, #ffffff 10px, #ffffff 20px)',
                          zIndex: -1
                        }}></div>
                        <button
                          onClick={handleClick}
                          className="relative w-full px-6 py-4 bg-[#32CD32] border-2 border-[#1a1a1a] text-white font-bold text-lg rounded-full hover:bg-[#28a828] transition-all duration-200"
                          style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}
                        >
                          Change Image →
                        </button>
                      </div>
                      <div className="flex-1 relative">
                        <div className="absolute inset-0 top-2 left-2 rounded-full" style={{
                          backgroundImage: 'repeating-linear-gradient(45deg, #1a1a1a 0px, #1a1a1a 10px, #ffffff 10px, #ffffff 20px)',
                          zIndex: -1
                        }}></div>
                        <button
                          onClick={handleRemove}
                          className="relative w-full px-6 py-4 bg-[#32CD32] border-2 border-[#1a1a1a] text-white font-bold text-lg rounded-full hover:bg-[#28a828] transition-all duration-200"
                          style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}
                        >
                          Remove →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 relative z-10" style={{ fontFamily: 'var(--font-bitblast-serif)', letterSpacing: '0.06em' }}>
                    Drop your fermentation image here
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg relative z-10">
                    or click to browse from your device
                  </p>
                  <div className="relative z-10 inline-block">
                    <button
                      onClick={handleClick}
                      className="px-8 py-4 bg-[#32CD32] border-2 border-[#1a1a1a] text-white font-bold text-lg rounded-full hover:bg-[#28a828] transition-all duration-200 inline-flex items-center gap-2"
                      style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}
                    >
                      Choose File →
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4 relative z-10">
                    Supports JPG, PNG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full bg-[#F5F1E8] border-t border-[#1a1a1a] mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[#1a1a1a] text-sm" style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}>
              © 2024 Ferment Buddy. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[#1a1a1a] text-sm hover:underline transition-colors" style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}>
                Privacy
              </a>
              <a href="#" className="text-[#1a1a1a] text-sm hover:underline transition-colors" style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}>
                Terms
              </a>
              <a href="#" className="text-[#1a1a1a] text-sm hover:underline transition-colors" style={{ fontFamily: 'var(--font-bitblast-sans)', letterSpacing: '0.06em' }}>
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
