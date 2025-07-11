

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Presentation, Plus, Home, Settings } from "lucide-react";

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  
  const isActive = (pageName) => {
    return location.pathname === createPageUrl(pageName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <style>{`
        :root {
          --primary-50: #f0f9ff;
          --primary-100: #e0f2fe;
          --primary-500: #0ea5e9;
          --primary-600: #0284c7;
          --primary-700: #0369a1;
          --success-50: #f0fdf4;
          --success-500: #22c55e;
          --gray-50: #f9fafb;
          --gray-100: #f3f4f6;
          --gray-200: #e5e7eb;
          --gray-300: #d1d5db;
          --gray-400: #9ca3af;
          --gray-500: #6b7280;
          --gray-600: #4b5563;
          --gray-700: #374151;
          --gray-800: #1f2937;
          --gray-900: #111827;
        }
        
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        }
        
        .glass-effect {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.8);
        }
        
        .smooth-shadow {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }
        
        .luxury-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
      
      <nav className="glass-effect border-b border-white/20 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 luxury-gradient rounded-xl flex items-center justify-center">
              <Presentation className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">SpeakerFlow</h1>
              <p className="text-xs text-gray-500">Outline Management</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Link
              to={createPageUrl("Dashboard")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("Dashboard")
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Home className="w-4 h-4 inline mr-2" />
              Dashboard
            </Link>
            <Link
              to={createPageUrl("Create")}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive("Create")
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Create
            </Link>
          </div>
        </div>
      </nav>
      
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

