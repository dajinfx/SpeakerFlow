import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Clock } from "lucide-react";

export default function SectionCard({ 
  section, 
  index, 
  isActive, 
  onComplete, 
  onUndo,
  isFocusMode = false
}) {

  const getCardStyle = () => {
    const baseStyle = {
      backdropFilter: 'blur(16px)',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      transition: 'all 0.35s ease-in-out',
      borderRadius: '20px',
      border: '1px solid rgba(229, 231, 235, 0.7)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
    };

    if (isActive && !isFocusMode) {
      return {
        ...baseStyle,
        borderRadius: '24px',
        boxShadow: '0 0 25px rgba(59, 130, 246, 0.5), 0 6px 20px rgba(0, 0, 0, 0.1)',
        border: '2px solid rgba(96, 165, 250, 0.6)',
        transform: 'scale(1.03)',
      };
    }

    if (section.completed) {
      return {
        ...baseStyle,
        borderRadius: '20px',
        border: '2px solid rgba(34, 197, 94, 0.4)',
        backgroundColor: 'rgba(240, 253, 244, 0.9)',
      };
    }

    return {
      ...baseStyle,
      borderRadius: '18px',
      border: '1px solid rgba(229, 231, 235, 0.8)',
      boxShadow: '0 2px 15px rgba(0, 0, 0, 0.04), 0 1px 6px rgba(0, 0, 0, 0.04)',
    };
  };

  return (
    <div
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      <div 
        className={`p-6 ${isFocusMode ? 'h-full flex flex-col' : ''}`}
        style={getCardStyle()}
      >
        <div className="flex items-start justify-between pb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="text-sm font-medium text-gray-500">
                Section {index + 1}
              </span>
              {section.duration && (
                <Badge variant="outline" className="text-xs" style={{borderRadius: '12px'}}>
                  <Clock className="w-3 h-3 mr-1" />
                  {section.duration}m
                </Badge>
              )}
            </div>
            <h3 className={`font-semibold ${isFocusMode ? 'text-4xl' : 'text-xl'} ${
              section.completed ? "text-green-700 line-through" : "text-gray-900"
            }`}>
              {section.title}
            </h3>
          </div>
          
          {!isFocusMode && (
            <Button
              variant={section.completed ? "outline" : "default"}
              size="sm"
              onClick={section.completed ? onUndo : onComplete}
              className={`transition-all duration-200 ${
                section.completed 
                  ? "border-green-300 text-green-700 hover:bg-green-50" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              style={{borderRadius: '12px'}}
            >
              {section.completed ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="w-4 h-4 mr-2" />
                  Mark Complete
                </>
              )}
            </Button>
          )}
        </div>
        
        {section.content && (
          <div className={`${isFocusMode ? 'flex-grow overflow-y-auto' : ''}`}>
            <div className={`prose max-w-none ${isFocusMode ? 'prose-xl' : 'prose-sm'}`}>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}