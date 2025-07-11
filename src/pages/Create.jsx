
import React, { useState } from "react";
import { Outline } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import AiGenerator from "../components/outline/AiGenerator";

export default function Create() {
  const navigate = useNavigate();
  const [outline, setOutline] = useState({
    title: "",
    description: "",
    sections: [
      { title: "", content: "", duration: 5, completed: false }
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setOutline(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (index, field, value) => {
    const newSections = [...outline.sections];
    newSections[index][field] = value;
    setOutline(prev => ({ ...prev, sections: newSections }));
  };

  const addSection = () => {
    setOutline(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: "", content: "", duration: 5, completed: false }
      ]
    }));
  };

  const removeSection = (index) => {
    if (outline.sections.length > 1) {
      const newSections = outline.sections.filter((_, i) => i !== index);
      setOutline(prev => ({ ...prev, sections: newSections }));
    }
  };

  const handleAiGenerate = (generatedSections) => {
    if (generatedSections && generatedSections.length > 0) {
      setOutline(prev => ({
        ...prev,
        sections: generatedSections
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const totalDuration = outline.sections.reduce((sum, section) => sum + (section.duration || 0), 0);
      
      await Outline.create({
        ...outline,
        total_duration: totalDuration,
        status: "draft"
      });

      navigate(createPageUrl("Dashboard"));
    } catch (error) {
      console.error("Error creating outline:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center space-x-4 mb-8"
      >
        <Link to={createPageUrl("Dashboard")}>
          <Button variant="outline" size="icon" className="hover:bg-white">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create New Outline</h1>
          <p className="text-gray-600">Build your presentation structure</p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-effect border border-white/30 smooth-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Outline Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  value={outline.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="Enter outline title"
                  required
                  className="border-gray-200 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <Textarea
                  value={outline.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Brief description of your outline"
                  className="h-20 border-gray-200 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border border-white/30 smooth-shadow">
            <CardHeader>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                <CardTitle className="text-lg">Sections</CardTitle>
                <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
                  <AiGenerator onGenerate={handleAiGenerate} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSection}
                    className="hover:bg-white whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Section
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {outline.sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg bg-white/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">
                      Section {index + 1}
                    </h4>
                    {outline.sections.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSection(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Section Title *
                      </label>
                      <Input
                        value={section.title}
                        onChange={(e) => handleSectionChange(index, "title", e.target.value)}
                        placeholder="Enter section title"
                        required
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Content & Notes
                      </label>
                      <Textarea
                        value={section.content}
                        onChange={(e) => handleSectionChange(index, "content", e.target.value)}
                        placeholder="Key points, notes, or script for this section"
                        className="h-24 border-gray-200 focus:border-blue-500"
                      />
                    </div>
                    
                    <div className="w-32">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (min)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        value={section.duration}
                        onChange={(e) => handleSectionChange(index, "duration", parseInt(e.target.value))}
                        className="border-gray-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-end space-x-4"
        >
          <Link to={createPageUrl("Dashboard")}>
            <Button type="button" variant="outline" className="hover:bg-white">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Create Outline
              </>
            )}
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
