import React from "react";
import { CheckCircle, Circle } from "lucide-react";
import { motion } from "framer-motion";

export default function ProgressIndicator({ sections, currentIndex }) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex items-center space-x-2 min-w-max px-2">
        {sections.map((section, index) => (
          <motion.div
            key={index}
            className="flex items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                section.completed
                  ? "bg-green-500 text-white"
                  : index === currentIndex
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-400"
              }`}>
                {section.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </div>
              <span className={`text-xs mt-1 font-medium ${
                index === currentIndex ? "text-blue-600" : "text-gray-500"
              }`}>
                {index + 1}
              </span>
            </div>
            {index < sections.length - 1 && (
              <div className={`w-8 h-0.5 mx-2 transition-all duration-300 ${
                section.completed ? "bg-green-500" : "bg-gray-200"
              }`} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}