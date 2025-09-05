// src/pages/rules.jsx - Database-driven version
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { BookOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeLanguage, setActiveLanguage] = useState("en");
  const [expandedSections, setExpandedSections] = useState(new Set(["preamble"]));

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    try {
      // Fetch from your API route
      const response = await fetch('/api/rules');
      const rulesData = await response.json();
      setRules(rulesData);
    } catch (error) {
      console.error("Error loading rules:", error);
      // Fallback to mock data for development
      setRules([
        {
          id: 1,
          language: "en",
          part_title: "Preamble",
          part_order: 0,
          section_title: "The Ten Principles of Stichts Croquet",
          section_order: 1,
          content: "Principle 1: Heritage and Tradition\n\nStichts Croquet draws its noble character from the Victorian tradition..."
        }
        // More mock data...
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  // Group rules by language and part
  const languageRules = rules.filter(rule => rule.language === activeLanguage);
  const groupedRules = languageRules.reduce((acc, rule) => {
    const key = `${rule.part_title}`;
    if (!acc[key]) {
      acc[key] = {
        title: rule.part_title,
        order: rule.part_order,
        sections: []
      };
    }
    acc[key].sections.push(rule);
    return acc;
  }, {});

  // Sort by part order
  const sortedParts = Object.values(groupedRules).sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        <p className="font-body text-emerald-600 mt-4">Loading Official Rules...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-bold text-emerald-900">
          Official Laws of Stichts Croquet
        </h1>
        <div className="ornate-divider w-64 mx-auto"></div>
        <p className="font-body text-xl text-emerald-700 max-w-3xl mx-auto">
          The definitive manual for the governance of the noble game
        </p>
      </div>

      {/* Language Toggle */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={() => setActiveLanguage("en")}
          variant={activeLanguage === "en" ? "default" : "outline"}
          className={activeLanguage === "en" ? "bg-emerald-700 hover:bg-emerald-800 text-white" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}
        >
          English
        </Button>
        <Button
          onClick={() => setActiveLanguage("nl")}
          variant={activeLanguage === "nl" ? "default" : "outline"}
          className={activeLanguage === "nl" ? "bg-emerald-700 hover:bg-emerald-800 text-white" : "border-emerald-300 text-emerald-700 hover:bg-emerald-50"}
        >
          Nederlands
        </Button>
      </div>

      {/* Rules Sections */}
      <div className="space-y-6">
        {sortedParts.map((part) => (
          <Card key={part.title} className="border-2 border-emerald-100">
            <CardHeader 
              className="cursor-pointer hover:bg-emerald-50 transition-colors duration-200"
              onClick={() => toggleSection(part.title)}
            >
              <CardTitle className="font-display text-2xl text-emerald-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  {part.title}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-emerald-300 text-emerald-700">
                    {part.sections.length} sections
                  </Badge>
                  {expandedSections.has(part.title) ? (
                    <ChevronDown className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-emerald-600" />
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            
            {expandedSections.has(part.title) && (
              <CardContent className="pt-0 space-y-6">
                {part.sections
                  .sort((a, b) => a.section_order - b.section_order)
                  .map((section) => (
                  <div key={section.id} className="border-l-4 border-amber-300 pl-6">
                    <h3 className="font-display text-lg font-semibold text-emerald-800 mb-2">
                      {section.section_title}
                    </h3>
                    <div className="font-body text-emerald-700 leading-relaxed whitespace-pre-line">
                      {section.content}
                    </div>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* No Rules Message */}
      {languageRules.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-2">
              Rules Not Available
            </h3>
            <p className="font-body text-emerald-600">
              The rules for this language have not been added yet. 
              They can be added through the admin dashboard.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Footer */}
      <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-emerald-200">
        <CardContent className="p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-emerald-900 mb-4">
            Nederlandse Bond der Croquet
          </h3>
          <p className="font-body text-emerald-700 leading-relaxed max-w-4xl mx-auto mb-4">
            These Laws govern the conduct of Stichts Croquet in all its forms, preserving the essence 
            of the ancient game whilst adapting to individual competition and democratic governance.
          </p>
          <div className="ornate-divider w-48 mx-auto mt-6"></div>
          <p className="font-body text-emerald-600 italic mt-4">
            "Compiled in the spirit of fair play and sporting tradition"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}