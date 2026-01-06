import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, Plus, Loader2, X } from "lucide-react";
import { motion } from "framer-motion";

export default function KnowledgeBase() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "other",
    content: "",
    tags: [],
    product_brand: "",
    instructions: "",
  });
  const [tagInput, setTagInput] = useState("");

  const queryClient = useQueryClient();

  const { data: knowledge = [], isLoading } = useQuery({
    queryKey: ["knowledge"],
    queryFn: () => base44.entities.KnowledgeBase.list("-created_date"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.KnowledgeBase.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["knowledge"] });
      setIsDialogOpen(false);
      resetForm();
    },
  });

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "other",
      content: "",
      tags: [],
      product_brand: "",
      instructions: "",
    });
    setTagInput("");
  };

  const categoryColors = {
    product: "bg-blue-500/20 text-blue-300",
    technique: "bg-purple-500/20 text-purple-300",
    policy: "bg-red-500/20 text-red-300",
    training: "bg-yellow-500/20 text-yellow-300",
    client_care: "bg-green-500/20 text-green-300",
    troubleshooting: "bg-orange-500/20 text-orange-300",
    other: "bg-gray-500/20 text-gray-300",
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-bold mb-2 tracking-tight">Knowledge Base</h1>
            <p className="text-gray-400 text-lg">
              Store techniques, product info, and salon resources
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Add Knowledge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141414] border-[#1f1f1f] text-white max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Add to Knowledge Base</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Title *
                  </label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="e.g., How to Fix Brassy Blonde Hair"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Category *
                  </label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="bg-[#1f1f1f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1f1f1f] border-[#2a2a2a] text-white">
                      <SelectItem value="product">Product Info</SelectItem>
                      <SelectItem value="technique">Technique</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="client_care">Client Care</SelectItem>
                      <SelectItem value="troubleshooting">Troubleshooting</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Content *
                  </label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={6}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="Detailed information, tips, or procedures..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Product Brand (if applicable)
                  </label>
                  <Input
                    value={formData.product_brand}
                    onChange={(e) => setFormData({ ...formData, product_brand: e.target.value })}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="e.g., Olaplex, Redken, Wella"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">
                    Instructions (optional)
                  </label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    rows={4}
                    className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                    placeholder="Step-by-step instructions if needed..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Tags</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="bg-[#1f1f1f] border-[#2a2a2a] text-white"
                      placeholder="e.g., balayage, color-correction, curly-hair"
                    />
                    <Button
                      type="button"
                      onClick={addTag}
                      className="bg-[#84CC16] hover:bg-[#84CC16]/90 text-black"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-[#84CC16]/20 text-[#84CC16] border-0 pr-1"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-[#2a2a2a] text-gray-400 hover:text-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 bg-[#84CC16] hover:bg-[#84CC16]/90 text-black font-semibold"
                  >
                    {createMutation.isPending ? "Creating..." : "Add to Knowledge Base"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Knowledge Base Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-[#84CC16] mx-auto mb-4" />
            <p className="text-gray-400">Loading knowledge base...</p>
          </div>
        ) : knowledge.length === 0 ? (
          <Card className="bg-[#141414] border-[#1f1f1f]">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No knowledge entries yet</h3>
              <p className="text-gray-500 mb-4">Start building your salon knowledge base</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {knowledge.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="bg-[#141414] border-[#1f1f1f] hover:border-[#84CC16]/50 transition-all duration-300 h-full flex flex-col">
                  <CardHeader>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="p-2 bg-[#84CC16]/10 rounded-lg">
                        <BookOpen className="w-5 h-5 text-[#84CC16]" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg mb-2">{item.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${categoryColors[item.category]} border-0 text-xs`}>
                            {item.category.replace("_", " ")}
                          </Badge>
                          {item.product_brand && (
                            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                              {item.product_brand}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-gray-400 text-sm line-clamp-4 mb-4">
                      {item.content}
                    </p>
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {item.tags.slice(0, 4).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-[#2a2a2a] text-gray-500 text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                        {item.tags.length > 4 && (
                          <Badge
                            variant="outline"
                            className="border-[#2a2a2a] text-gray-500 text-xs"
                          >
                            +{item.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}