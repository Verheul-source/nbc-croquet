// src/pages/rules.jsx - Official Laws of Stichts Croquet
import React, { useState, useEffect } from "react";
import { BookOpen, Globe, FileText, Crown } from "lucide-react";

export default function Rules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRules();
  }, [selectedLanguage]);

  const loadRules = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/rules?language=${selectedLanguage}`);
      
      if (!response.ok) {
        throw new Error('Failed to load rules');
      }
      
      const data = await response.json();
      setRules(data);
    } catch (error) {
      console.error("Error loading rules:", error);
      setError(error.message);
      // Fallback to sample rules if API fails
      loadSampleRules();
    } finally {
      setLoading(false);
    }
  };

  const loadSampleRules = () => {
    const sampleRules = [
      {
        id: "preamble-1",
        language: selectedLanguage,
        part_title: "Preamble",
        part_order: 0,
        section_title: "The Ten Principles of Stichts Croquet",
        section_order: 1,
        content: selectedLanguage === "en" ? 
          `**Principle 1: Heritage and Tradition**
Stichts Croquet draws its noble character from the Victorian tradition of croquet as played in the gardens of English country houses, preserving the elegance and refinement of this distinguished heritage.

**Principle 2: Conduct**
Players embody the gentlemanly spirit through courteous behaviour, proper deportment, and respectful discourse, maintaining civility regardless of the circumstances of play.

**Principle 3: Attire**
Players honour tradition through proper dress: white clothing or, when unavailable, light earth colours such as sand, maintaining dignity whilst avoiding the appearance of American sporting fashion.

**Principle 4: Fair Play and Honour**
Players conduct themselves with unwavering integrity, acknowledging their own faults and upholding the highest standards of sporting honour in all aspects of play.

**Principle 5: Respect for Opponents and Self-Regulation**
Players demonstrate respect for their opponents through courteous treatment and fair consideration, whilst exercising rigorous self-regulation in adherence to the laws and spirit of the game.` :
          `**Beginsel 1: Erfgoed en Traditie**
Stichts Croquet ontleent haar edele karakter aan de Victorian traditie van croquet zoals gespeeld in de tuinen van Engelse landhuizen, waarbij de elegantie en verfijning van dit voorname erfgoed behouden blijven.

**Beginsel 2: Gedrag**
Spelers belichamen de geest van hoffelijkheid door wellevend gedrag, gepaste houding en respectvol discours, waarbij beschaving te allen tijde gehandhaafd wordt, ongeacht de omstandigheden van het spel.

**Beginsel 3: Kledij**
Spelers eren de traditie door gepaste kleding: witte kledij of, indien niet voorhanden, lichte aardtinten zoals zand, waarbij waardigheid behouden blijft en de schijn van Amerikaanse sportmode vermeden wordt.

**Beginsel 4: Eerlijk Spel en Eer**
Spelers gedragen zich met onwankelbare integriteit, erkennen hun eigen fouten en handhaven de hoogste normen van sportieve eer in alle aspecten van het spel.

**Beginsel 5: Respect voor Tegenstanders en Zelfregulering**
Spelers tonen respect voor hun tegenstanders door hoffelijke behandeling en billijke consideratie, waarbij zij strikte zelfregulering uitoefenen in naleving van de wetten en de geest van het spel.`
      },
      {
        id: "part1-1",
        language: selectedLanguage,
        part_title: selectedLanguage === "en" ? "Part I: Introduction" : "Deel I: Inleiding",
        part_order: 1,
        section_title: selectedLanguage === "en" ? "1. Objective of the Game" : "1. Doel van het Spel",
        section_order: 1,
        content: selectedLanguage === "en" ?
          `**1.1** The objective of Stichts Croquet is to be the first player to strike the central peg with your ball after successfully completing all required hoops in the correct sequence.

**1.2** All players compete as individuals. No partnerships, teams, or alliances are recognised under these Laws.

**1.3** The game is won immediately when a player lawfully strikes the peg, regardless of other players' positions on the course.

**1.4** The course sequence required before striking the peg is determined by the game format as specified in Law 2.` :
          `**1.1** Het doel van Stichts Croquet is om als eerste speler de centrale peg te raken met uw bal na het succesvol voltooien van alle vereiste hoops in de correcte volgorde.

**1.2** Alle spelers concurreren als individuen. Geen partnerschappen, teams of allianties worden erkend onder deze Wetten.

**1.3** Het spel wordt onmiddellijk gewonnen wanneer een speler rechtmatig de peg raakt, ongeacht de posities van andere spelers op het parcours.

**1.4** De parcoursvolgorde die vereist is voordat de peg geraakt wordt, wordt bepaald door het spelformaat zoals gespecificeerd in Wet 2.`
      }
    ];
    setRules(sampleRules);
  };

  const groupRulesByPart = (rules) => {
    const grouped = {};
    
    rules.forEach(rule => {
      if (!grouped[rule.part_title]) {
        grouped[rule.part_title] = [];
      }
      grouped[rule.part_title].push(rule);
    });

    // Sort parts by part_order and sections by section_order
    Object.keys(grouped).forEach(partTitle => {
      grouped[partTitle].sort((a, b) => a.section_order - b.section_order);
    });

    return grouped;
  };

  const renderRuleContent = (content) => {
    // Simple markdown-like rendering for bold text
    const formattedContent = content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('**') && line.endsWith('**')) {
          const title = line.slice(2, -2);
          return (
            <h4 key={index} className="font-display text-lg font-bold text-emerald-800 mt-4 mb-2">
              {title}
            </h4>
          );
        } else if (line.trim()) {
          return (
            <p key={index} className="font-body text-emerald-700 mb-3 leading-relaxed">
              {line}
            </p>
          );
        }
        return <br key={index} />;
      });

    return formattedContent;
  };

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-amber-400 border-t-transparent"></div>
        <p className="font-body text-emerald-700 mt-6 text-lg">Loading Official Laws...</p>
      </div>
    );
  }

  if (error && rules.length === 0) {
    return (
      <div className="text-center py-16">
        <FileText className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-emerald-900 mb-4">Rules Temporarily Unavailable</h2>
        <p className="font-body text-emerald-700 mb-6">
          We apologise, but the official rules are currently being updated. 
          Please contact the club secretary for rule clarifications.
        </p>
      </div>
    );
  }

  const groupedRules = groupRulesByPart(rules);

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="inline-block">
          <div className="flex justify-center mb-4">
            <Crown className="w-12 h-12 text-amber-500" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-emerald-900 mb-4 heading-edwardian">
            Official Laws of Stichts Croquet
          </h1>
          <div className="ornate-divider"></div>
        </div>
        <p className="font-body text-xl text-emerald-700 max-w-3xl mx-auto leading-relaxed">
          The definitive manual for the governance of the noble game, preserving the traditions 
          and sporting spirit that have defined croquet for generations.
        </p>
      </div>

      {/* Language Selection */}
      <div className="card-edwardian p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-emerald-600" />
          <h2 className="font-display text-lg font-bold text-emerald-900">Select Language</h2>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedLanguage("en")}
            className={`px-6 py-3 rounded-lg font-body font-semibold transition-all duration-300 ${
              selectedLanguage === "en"
                ? "bg-amber-400 text-emerald-900 shadow-lg"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setSelectedLanguage("nl")}
            className={`px-6 py-3 rounded-lg font-body font-semibold transition-all duration-300 ${
              selectedLanguage === "nl"
                ? "bg-amber-400 text-emerald-900 shadow-lg"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            🇳🇱 Nederlands
          </button>
        </div>
      </div>

      {/* Rules Content */}
      <div className="space-y-10">
        {Object.entries(groupedRules)
          .sort(([,a], [,b]) => a[0].part_order - b[0].part_order)
          .map(([partTitle, sections]) => (
          <div key={partTitle} className="card-edwardian p-8 shadow-lg">
            <h2 className="font-display text-3xl font-bold text-emerald-900 mb-6 text-center heading-edwardian border-b-2 border-amber-300 pb-4">
              {partTitle}
            </h2>
            
            <div className="space-y-8">
              {sections.map(section => (
                <div key={section.id} className="border-l-4 border-amber-400 pl-6">
                  <h3 className="font-display text-2xl font-bold text-emerald-800 mb-4 heading-edwardian">
                    {section.section_title}
                  </h3>
                  <div className="prose prose-lg max-w-none">
                    {renderRuleContent(section.content)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Court Diagram Reference */}
      <div className="card-edwardian p-8 text-center shadow-lg">
        <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
        <h2 className="font-display text-2xl font-bold text-emerald-900 mb-4 heading-edwardian">
          Official Court Diagram
        </h2>
        <p className="font-body text-emerald-700 mb-6">
          For the complete laws including court specifications and detailed diagrams, 
          please refer to the official publication available from the club secretary.
        </p>
        <div className="text-sm text-emerald-600 font-body italic">
          "Compiled in the spirit of fair play and sporting tradition"
        </div>
      </div>
    </div>
  );
}