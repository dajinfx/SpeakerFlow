
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, Circle, Play } from "lucide-react";
import { motion } from "framer-motion";

export default function OutlineCard({ outline }) {
  const completedSections = outline.sections?.filter(s => s.completed).length || 0;
  const totalSections = outline.sections?.length || 0;
  const progressPercent = totalSections > 0 ? (completedSections / totalSections) * 100 : 0;
  
  const statusColors = {
    draft: "bg-gray-100 text-gray-700",
    active: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="glass-effect smooth-shadow border border-white/30 hover:shadow-lg transition-all duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {outline.title}
              </h3>
              {outline.description && (
                <p className="text-sm text-gray-600 mb-3">
                  {outline.description}
                </p>
              )}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{outline.total_duration || 0} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedSections}/{totalSections} sections</span>
                </div>
              </div>
            </div>
            <Badge className={statusColors[outline.status]}>
              {outline.status}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.5, delay: 0.1 }}
              />
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link 
              to={createPageUrl(`Speaker?id=${outline.id}`)}
              className="flex-1"
            >
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Present
              </Button>
            </Link>
            <Link 
              to={createPageUrl(`Edit?id=${outline.id}`)}
              className="flex-1"
            >
              <Button 
                variant="outline" 
                className="w-full border-gray-200 hover:bg-gray-50"
                size="sm"
              >
                Edit
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
