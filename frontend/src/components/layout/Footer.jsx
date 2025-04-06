import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const hoverVariants = {
    hover: { 
      scale: 1.05, 
      color: "#3B82F6",
      transition: { type: "spring", stiffness: 300 }
    }
  };

  // Links grouped by section
  const footerLinks = [
    {
      title: "Platform",
      links: [
        { name: "AI Marketplace", to: "/marketplace" },
        { name: "Developer Portal", to: "/dev-portal" },
        { name: "Pricing", to: "/pricing" },
        { name: "API Documentation", to: "/api-docs" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", to: "/about" },
        { name: "Careers", to: "/careers" },
        { name: "Press", to: "/press" },
        { name: "Contact", to: "/contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Blog", to: "/blog" },
        { name: "Tutorials", to: "/tutorials" },
        { name: "Case Studies", to: "/case-studies" },
        { name: "Help Center", to: "/help" },
      ]
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", to: "/privacy" },
        { name: "Terms of Service", to: "/terms" },
        { name: "Cookie Policy", to: "/cookies" },
        { name: "Acceptable Use", to: "/acceptable-use" },
      ]
    }
  ];

  // Social media links
  const socialLinks = [
    { name: "Twitter", icon: "twitter", url: "https://twitter.com" },
    { name: "GitHub", icon: "github", url: "https://github.com" },
    { name: "LinkedIn", icon: "linkedin", url: "https://linkedin.com" },
    { name: "Discord", icon: "discord", url: "https://discord.com" },
  ];

  return (
    <motion.footer 
      className="bg-gray-50 border-t border-gray-200 pt-12 pb-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={footerVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Logo and about section */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <Link to="/" className="text-xl font-bold text-primary-600 flex items-center mb-4">
              <span className="mr-2 text-2xl">🧠</span> MonetizeAI
            </Link>
            <p className="text-gray-600 mb-4 max-w-md">
              The premier platform for AI developers to monetize their models and for businesses to discover and integrate cutting-edge AI solutions.
            </p>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-primary-600 transition-colors"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                >
                  <SocialIcon name={social.icon} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link sections */}
          {footerLinks.map((section) => (
            <motion.div key={section.title} variants={itemVariants}>
              <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <motion.div variants={hoverVariants} whileHover="hover">
                      <Link to={link.to} className="text-gray-600 hover:text-primary-600 transition-colors">
                        {link.name}
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom section with newsletter */}
        <motion.div 
          className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-start md:items-center"
          variants={itemVariants}
        >
          <div className="mb-4 md:mb-0">
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase mb-4">
              Subscribe to our newsletter
            </h3>
            <div className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-l-md px-4 py-2"
              />
              <motion.button
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md font-medium"
                whileHover={{ backgroundColor: "#2563EB" }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
          <motion.p 
            className="text-gray-500 text-sm"
            variants={itemVariants}
          >
            © {currentYear} MonetizeAI. All rights reserved.
          </motion.p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

// Social media icons
const SocialIcon = ({ name }) => {
  switch (name) {
    case 'twitter':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      );
    case 'github':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
      );
    case 'linkedin':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      );
    case 'discord':
      return (
        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
        </svg>
      );
    default:
      return null;
  }
};

export default Footer; 