import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import AnimatedSection, { AnimatedItem } from "../components/common/AnimatedSection";
import AnimatedCounter from "../components/common/AnimatedCounter";
import AnimatedCard from "../components/common/AnimatedCard";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import HeroSection from "../components/hero/HeroSection";

const Home = () => {
  // eslint-disable-next-line no-unused-vars
  const { currentUser } = useAuth();

  // eslint-disable-next-line no-unused-vars
  const gradientAnimation = {
    animate: {
      background: [
        "linear-gradient(120deg, #3b82f6 0%, #2563eb 100%)",
        "linear-gradient(120deg, #2563eb 0%, #1d4ed8 100%)",
        "linear-gradient(120deg, #1d4ed8 0%, #3b82f6 100%)",
      ],
      transition: {
        duration: 8,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section with Animation */}
      <HeroSection 
        title="MonetizeAI Marketplace"
        subtitle="The platform that connects AI model developers with users. Publish your models, set pricing, and reach a global audience or discover and use cutting-edge AI models for your applications."
        primaryCta="Explore Models"
        secondaryCta="Become a Developer"
        primaryCtaLink="/marketplace"
        secondaryCtaLink="/register"
      />

      {/* Stats Section */}
      <div className="bg-white py-10 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="staggerChildren" className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <AnimatedItem className="flex flex-col items-center">
              <AnimatedCounter 
                end={500} 
                suffix="+" 
                className="text-3xl font-bold text-primary-600"
              />
              <p className="mt-2 text-gray-600">AI Models</p>
            </AnimatedItem>
            <AnimatedItem className="flex flex-col items-center">
              <AnimatedCounter 
                end={1250} 
                suffix="+" 
                className="text-3xl font-bold text-primary-600"
              />
              <p className="mt-2 text-gray-600">Active Users</p>
            </AnimatedItem>
            <AnimatedItem className="flex flex-col items-center">
              <AnimatedCounter 
                end={300} 
                suffix="+" 
                className="text-3xl font-bold text-primary-600"
              />
              <p className="mt-2 text-gray-600">AI Developers</p>
            </AnimatedItem>
            <AnimatedItem className="flex flex-col items-center">
              <AnimatedCounter 
                end={5.2} 
                decimals={1} 
                suffix="M" 
                className="text-3xl font-bold text-primary-600"
              />
              <p className="mt-2 text-gray-600">API Calls</p>
            </AnimatedItem>
          </AnimatedSection>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn" className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              A seamless platform connecting AI developers and users
            </p>
          </AnimatedSection>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* For Developers */}
              <AnimatedSection animation="slideIn" delay={0.1}>
                <AnimatedCard className="p-6 h-full">
                  <div className="bg-primary-100 rounded-md p-2 inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    For Developers
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Publish your AI models with custom pricing, track usage, and
                    earn revenue from your innovations. Our platform makes it easy
                    to manage your model portfolio and reach global customers.
                  </p>
                </AnimatedCard>
              </AnimatedSection>

              {/* For Users */}
              <AnimatedSection animation="slideIn" delay={0.2}>
                <AnimatedCard className="p-6 h-full">
                  <div className="bg-primary-100 rounded-md p-2 inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    For Users
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Browse and select high-quality AI models, track your usage,
                    and access powerful analytics for your AI integration. Find models
                    that fit your specific needs and budget.
                  </p>
                </AnimatedCard>
              </AnimatedSection>

              {/* Marketplace */}
              <AnimatedSection animation="slideIn" delay={0.3}>
                <AnimatedCard className="p-6 h-full">
                  <div className="bg-primary-100 rounded-md p-2 inline-block">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-primary-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    Secure Marketplace
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    Our token transaction system ensures safe and transparent
                    payments between developers and users. We handle the complexity
                    so you can focus on using great AI models.
                  </p>
                </AnimatedCard>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Categories Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fadeIn" className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Popular AI Categories
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
              Explore top AI models across different specialized fields
            </p>
          </AnimatedSection>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatedSection animation="scaleUp" delay={0.1}>
              <Link to="/marketplace?category=nlp" className="block group">
                <AnimatedCard 
                  className="overflow-hidden" 
                  glow={false}
                >
                  <div className="relative h-40 bg-gradient-to-r from-blue-400 to-blue-600">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <span className="text-4xl">🔠</span>
                        <h3 className="mt-2 text-xl font-medium">Natural Language Processing</h3>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            </AnimatedSection>
            
            <AnimatedSection animation="scaleUp" delay={0.2}>
              <Link to="/marketplace?category=computer-vision" className="block group">
                <AnimatedCard 
                  className="overflow-hidden" 
                  glow={false}
                >
                  <div className="relative h-40 bg-gradient-to-r from-purple-400 to-purple-600">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <span className="text-4xl">👁️</span>
                        <h3 className="mt-2 text-xl font-medium">Computer Vision</h3>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            </AnimatedSection>
            
            <AnimatedSection animation="scaleUp" delay={0.3}>
              <Link to="/marketplace?category=speech" className="block group">
                <AnimatedCard 
                  className="overflow-hidden" 
                  glow={false}
                >
                  <div className="relative h-40 bg-gradient-to-r from-green-400 to-green-600">
                    <div className="absolute inset-0 flex items-center justify-center text-white">
                      <div className="text-center">
                        <span className="text-4xl">🎤</span>
                        <h3 className="mt-2 text-xl font-medium">Speech Recognition</h3>
                      </div>
                    </div>
                  </div>
                </AnimatedCard>
              </Link>
            </AnimatedSection>
          </div>
        </div>
      </div>

      {/* CTA Section with Animation */}
      <AnimatedSection animation="fadeIn" className="bg-primary-700 mt-auto">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-200">
              Join our platform today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 transition-all duration-300 hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
};

export default Home;
