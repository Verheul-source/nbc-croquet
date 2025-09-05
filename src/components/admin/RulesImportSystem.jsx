// NEW COMPONENT: RulesImportSystem.jsx
// This imports your existing PDF rules into the database

import React, { useState } from "react";
import { Rule } from "@/entities/Rule";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";

export default function RulesImportSystem() {
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);

  // Your existing PDF content structured for import
  const existingRulesData = {
    en: [
      {
        part_title: "PREAMBLE: THE TEN PRINCIPLES OF STICHTS CROQUET",
        part_order: 0,
        section_title: "The Ten Principles",
        section_order: 1,
        content: `**Principle 1: Heritage and Tradition**
Stichts Croquet draws its noble character from the Victorian tradition of croquet as played in the gardens of English country houses, preserving the elegance and refinement of this distinguished heritage.

**Principle 2: Conduct**
Players embody the gentlemanly spirit through courteous behaviour, proper deportment, and respectful discourse, maintaining civility regardless of the circumstances of play.

**Principle 3: Attire**
Players honour tradition through proper dress: white clothing or, when unavailable, light earth colours such as sand, maintaining dignity whilst avoiding the appearance of American sporting fashion.

**Principle 4: Fair Play and Honour**
Players conduct themselves with unwavering integrity, acknowledging their own faults and upholding the highest standards of sporting honour in all aspects of play.

**Principle 5: Respect for Opponents and Self-Regulation**
Players demonstrate respect for their opponents through courteous treatment and fair consideration, whilst exercising rigorous self-regulation in adherence to the laws and spirit of the game.

**Principle 6: Pursuit of Excellence Through Skill and Strategy**
Players cultivate tactical acumen and precise execution, developing both mind and technique.

**Principle 7: Dignity in Victory and Defeat**
Players maintain grace and composure in all outcomes, celebrating victory with modesty and accepting defeat with honour, recognising that character is revealed equally in triumph and adversity.

**Principle 8: Social Nature**
Players foster fellowship and collective wisdom among all participants.

**Principle 9: The Primacy of Enjoyment**
Players celebrate refined pleasure and good fellowship, enhanced by proper refreshments, recognising that the ultimate purpose of the game is civilised enjoyment among friends.

**Principle 10: The Harmony of Competition and Friendship**
Players balance spirited rivalry with lasting camaraderie, where fierce competition on the field strengthens rather than diminishes the bonds of friendship.`,
        language: "en"
      },
      {
        part_title: "PART I: INTRODUCTION",
        part_order: 1,
        section_title: "1. OBJECTIVE OF THE GAME",
        section_order: 1,
        content: `**1.1** The objective of Stichts Croquet is to be the first player to strike the central peg with your ball after successfully completing all required hoops in the correct sequence.

**1.2** All players compete as individuals. No partnerships, teams, or alliances are recognised under these Laws.

**1.3** The game is won immediately when a player lawfully strikes the peg, regardless of other players' positions on the course.

**1.4** The course sequence required before striking the peg is determined by the game format as specified in Law 2.`,
        language: "en"
      },
      {
        part_title: "PART I: INTRODUCTION",
        part_order: 1,
        section_title: "2. GAME FORMATS",
        section_order: 2,
        content: `**2.1** Stichts Croquet may be played in two formats, which must be agreed upon before commencement of play.

**2.2** **Full Game:** Players must successfully complete hoops 1, 2, 3, 4, 5, and 6 in sequence before being eligible to strike the peg.

**2.3** **Double Game:** Players must successfully complete hoops 1, 2, 3, 4, 5, 6, then 1-back, 2-back, 3-back, 4-back, penultimate, and rover in sequence before being eligible to strike the peg.

**2.4** The game format shall be determined by mutual agreement among players or by tournament regulations. If no specific agreement is made, the Full Game format shall apply by default.

**2.5** Reference to the court layout and hoop positions is shown in Diagram 1.`,
        language: "en"
      }
      // Add more sections as needed...
    ],
    nl: [
      {
        part_title: "PREAMBULE: DE TIEN BEGINSELEN VAN STICHTS CROQUET",
        part_order: 0,
        section_title: "De Tien Beginselen",
        section_order: 1,
        content: `**Beginsel 1: Erfgoed en Traditie**
Stichts Croquet ontleent haar edele karakter aan de Victorian traditie van croquet zoals gespeeld in de tuinen van Engelse landhuizen, waarbij de elegantie en verfijning van dit voorname erfgoed behouden blijven.

**Beginsel 2: Gedrag**
Spelers belichamen de geest van hoffelijkheid door wellevend gedrag, gepaste houding en respectvol discours, waarbij beschaving te allen tijde gehandhaafd wordt, ongeacht de omstandigheden van het spel.

**Beginsel 3: Kledij**
Spelers eren de traditie door gepaste kleding: witte kledij of, indien niet voorhanden, lichte aardtinten zoals zand, waarbij waardigheid behouden blijft en de schijn van Amerikaanse sportmode vermeden wordt.

**Beginsel 4: Eerlijk Spel en Eer**
Spelers gedragen zich met onwankelbare integriteit, erkennen hun eigen fouten en handhaven de hoogste normen van sportieve eer in alle aspecten van het spel.

**Beginsel 5: Respect voor Tegenstanders en Zelfregulering**
Spelers tonen respect voor hun tegenstanders door hoffelijke behandeling en billijke consideratie, waarbij zij strikte zelfregulering uitoefenen in naleving van de wetten en de geest van het spel.`,
        language: "nl"
      }
      // Add Dutch sections...
    ]
  };

  const importRules = async () => {
    setImporting(true);
    setProgress(0);
    
    try {
      const allRules = [...existingRulesData.en, ...existingRulesData.nl];
      const total = allRules.length;
      let imported = 0;
      let failed = 0;

      for (const rule of allRules) {
        try {
          await Rule.create(rule);
          imported++;
        } catch (error) {
          console.error("Failed to import rule:", rule.section_title, error);
          failed++;
        }
        
        setProgress(Math.round(((imported + failed) / total) * 100));
        
        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setResults({ imported, failed, total });
    } catch (error) {
      console.error("Import failed:", error);
      setResults({ imported: 0, failed: 0, total: 0, error: error.message });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card className="border-2 border-emerald-200">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-amber-50">
        <CardTitle className="font-display text-xl text-emerald-900 flex items-center gap-2">
          <Upload className="w-6 h-6" />
          Import Existing Rules from PDF
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        <div className="text-center">
          <FileText className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
          <h3 className="font-display text-lg font-semibold text-emerald-900 mb-2">
            Import Official Stichts Croquet Rules
          </h3>
          <p className="font-body text-emerald-600 mb-6 max-w-lg mx-auto">
            This will import the complete rules from your PDF documents into the database, 
            creating structured entries for both English and Dutch versions.
          </p>
        </div>

        {importing && (
          <div className="space-y-4">
            <div className="text-center">
              <p className="font-body text-emerald-700 mb-2">Importing rules...</p>
              <Progress value={progress} className="w-full" />
              <p className="font-body text-sm text-emerald-600 mt-1">{progress}% complete</p>
            </div>
          </div>
        )}

        {results && (
          <Alert className={results.error ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
            {results.error ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-green-600" />
            )}
            <AlertDescription>
              {results.error ? (
                <span className="text-red-800">Import failed: {results.error}</span>
              ) : (
                <span className="text-green-800">
                  Successfully imported {results.imported} of {results.total} rules.
                  {results.failed > 0 && ` ${results.failed} failed to import.`}
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center">
          <Button 
            onClick={importRules}
            disabled={importing}
            className="bg-emerald-700 hover:bg-emerald-800 px-8 py-3"
          >
            {importing ? 'Importing...' : 'Import Rules'}
          </Button>
        </div>

        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <span className="text-amber-800">
              <strong>Note:</strong> This will add all rules to the database. 
              Run this only once to avoid duplicates.
            </span>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}