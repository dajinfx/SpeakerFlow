
import React, { useState, useEffect } from "react";
import { Outline } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Home, CheckCircle, Circle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import ProgressIndicator from "../components/outline/ProgressIndicator";
import SectionCard from "../components/outline/SectionCard";

export default function Speaker() {
  const [outline, setOutline] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFocusMode, setIsFocusMode] = useState(false);

  useEffect(() => {
    loadOutline();
  }, []);

  const loadOutline = async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get("id");
      
      if (id) {
        const data = await Outline.get(id);
        setOutline(data);
        
        // Update status to active if it's not completed
        if (data.status !== "completed") {
          await Outline.update(id, { status: "active" });
        }
      }
    } catch (error) {
      console.error("Error loading outline:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSectionComplete = async (sectionIndex) => {
    if (!outline) return;
    
    const updatedSections = [...outline.sections];
    updatedSections[sectionIndex].completed = true;
    
    // Check if all sections are completed
    const allCompleted = updatedSections.every(section => section.completed);
    const newStatus = allCompleted ? "completed" : "active";
    
    await Outline.update(outline.id, { 
      sections: updatedSections,
      status: newStatus
    });
    
    setOutline(prev => ({ 
      ...prev, 
      sections: updatedSections,
      status: newStatus
    }));
  };

  const handleSectionUndo = async (sectionIndex) => {
    if (!outline) return;
    
    const updatedSections = [...outline.sections];
    updatedSections[sectionIndex].completed = false;
    
    await Outline.update(outline.id, { 
      sections: updatedSections,
      status: "active"
    });
    
    setOutline(prev => ({ 
      ...prev, 
      sections: updatedSections,
      status: "active"
    }));
  };

  const nextSection = () => {
    if (currentSectionIndex < (outline?.sections?.length || 0) - 1) {
      setCurrentSectionIndex(currentSectionIndex + 1);
    }
  };

  const prevSection = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(currentSectionIndex - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!outline) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Outline not found</h2>
          <Link to={createPageUrl("Dashboard")}>
            <Button>Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  const currentSection = outline.sections[currentSectionIndex];
  const completedSections = outline.sections.filter(s => s.completed).length;
  const totalSections = outline.sections.length;

  return (
    <>
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 ${isFocusMode ? 'hidden' : ''}`}>
        <div className="max-w-5xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center space-x-4">
              <Link to={createPageUrl("Dashboard")}>
                <Button variant="outline" size="icon" className="hover:bg-white">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{outline.title}</h1>
                <p className="text-gray-600">
                  {completedSections}/{totalSections} sections completed
                </p>
              </div>
            </div>
            
            <Link to={createPageUrl("Dashboard")}>
              <Button variant="outline" className="hover:bg-white">
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
          </motion.div>

          <div className="overflow-x-auto pb-4 mb-8">
            <ProgressIndicator 
              sections={outline.sections}
              currentIndex={currentSectionIndex}
            />
          </div>

          <div 
            className="mb-8 overflow-hidden cursor-pointer"
            onDoubleClick={() => setIsFocusMode(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSectionIndex}
                style={{ touchAction: 'pan-y' }}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.3}
                onDragEnd={(e, { offset }) => {
                  const dragThreshold = 60;
                  if (offset.x < -dragThreshold) {
                    nextSection();
                  } else if (offset.x > dragThreshold) {
                    prevSection();
                  }
                }}
              >
                <SectionCard
                  section={currentSection}
                  index={currentSectionIndex}
                  isActive={true}
                  onComplete={() => handleSectionComplete(currentSectionIndex)}
                  onUndo={() => handleSectionUndo(currentSectionIndex)}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevSection}
              disabled={currentSectionIndex === 0}
              className="px-6 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <div className="text-sm text-gray-500 font-medium">
              {currentSectionIndex + 1} of {totalSections}
            </div>
            
            <Button
              variant="outline"
              onClick={nextSection}
              disabled={currentSectionIndex === totalSections - 1}
              className="px-6 hover:bg-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {outline.status === "completed" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 glass-effect rounded-xl p-6 text-center"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Congratulations! 🎉
              </h3>
              <p className="text-gray-600">
                You have completed all sections of this outline.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFocusMode && (
          <motion.div
            className="fixed inset-0 bg-slate-100 z-50 flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onDoubleClick={() => setIsFocusMode(false)}
          >
            <div className="p-4 md:p-6 flex-shrink-0">
              <ProgressIndicator
                sections={outline.sections}
                currentIndex={currentSectionIndex}
              />
            </div>

            <div className="flex-grow flex items-center justify-center pb-6 px-4 md:px-6 w-full h-full overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSectionIndex}
                  className="w-full h-full"
                  style={{ touchAction: 'pan-y' }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.3}
                  onDragEnd={(e, { offset }) => {
                    const dragThreshold = 60;
                    if (offset.x < -dragThreshold) {
                      nextSection();
                    } else if (offset.x > dragThreshold) {
                      prevSection();
                    }
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                >
                  <SectionCard
                    section={currentSection}
                    index={currentSectionIndex}
                    isFocusMode={true}
                    isActive={true}
                    onComplete={() => {}}
                    onUndo={() => {}}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
