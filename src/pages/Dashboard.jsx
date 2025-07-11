
import React, { useState, useEffect, useRef } from "react";
import { Outline } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Search, Filter, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import OutlineCard from "../components/outline/OutlineCard";

export default function Dashboard() {
  const [outlines, setOutlines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const outlineListRef = useRef(null);

  useEffect(() => {
    loadOutlines();
  }, []);

  const loadOutlines = async () => {
    try {
      const data = await Outline.list("-created_date");
      setOutlines(data);
    } catch (error) {
      console.error("Error loading outlines:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatClick = (statusFilter) => {
    setFilterStatus(statusFilter);
    // 滚动到大纲列表区域
    if (outlineListRef.current) {
      outlineListRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const filteredOutlines = outlines.filter(outline => {
    const matchesSearch = outline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         outline.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || outline.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: outlines.length,
    completed: outlines.filter(o => o.status === "completed").length,
    active: outlines.filter(o => o.status === "active").length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Your Outlines
            </h1>
            <p className="text-gray-600">
              Manage and present your speaking outlines with ease
            </p>
          </div>
          <Link to={createPageUrl("Create")}>
            <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6">
              <Plus className="w-5 h-5 mr-2" />
              Create New Outline
            </Button>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect rounded-xl p-6 smooth-shadow border border-white/30 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => handleStatClick("all")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Outlines</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-effect rounded-xl p-6 smooth-shadow border border-white/30 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => handleStatClick("completed")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-effect rounded-xl p-6 smooth-shadow border border-white/30 cursor-pointer hover:shadow-lg transition-all duration-200"
          onClick={() => handleStatClick("active")}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="glass-effect rounded-xl p-6 smooth-shadow mb-8 border border-white/30" ref={outlineListRef}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search outlines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-200 focus:border-blue-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredOutlines.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterStatus !== "all" ? "No outlines found" : "No outlines yet"}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Create your first outline to get started"
            }
          </p>
          {!searchTerm && filterStatus === "all" && (
            <Link to={createPageUrl("Create")}>
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Outline
              </Button>
            </Link>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOutlines.map((outline, index) => (
            <motion.div
              key={outline.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OutlineCard outline={outline} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
