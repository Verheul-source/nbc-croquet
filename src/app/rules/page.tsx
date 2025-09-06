// src/app/rules/page.tsx - Rules Page with Fallback Data
'use client'

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ChevronDown, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [expandedSections, setExpandedSections] = useState(new Set(['Preamble', 'Part I: Introduction']))

  useEffect(() => {
    loadRules()
  }, [selectedLanguage])

  const loadRules = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Loading rules from API...')
      const response = await fetch(`/api/rules?language=${selectedLanguage}`)
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`)
      }
      
      const rulesData = await response.json()
      console.log('📊 Loaded rules:', rulesData.length, 'rules')
      
      if (rulesData && rulesData.length > 0) {
        setRules(rulesData)
      } else {
        console.log('⚠️ No rules found, loading fallback data')
        setRules(getFallbackRules())
      }
    } catch (error: any) {
      console.error('❌ Error loading rules:', error)
      setError(error.message)
      // Load fallback data even on error
      setRules(getFallbackRules())
    } finally {
      setLoading(false)
    }
  }

  // Fallback rules data - same as your working Pages Router version
  const getFallbackRules = () => [
    {
      id: "preamble-1",
      language: "en",
      part_title: "Preamble",
      part_order: 0,
      section_title: "The Ten Principles of Stichts Croquet",
      section_order: 1,
      content: `Principle 1: Heritage and Tradition
Stichts Croquet draws its noble character from the Victorian tradition of croquet as played in the gardens of English country houses, preserving the elegance and refinement of this distinguished heritage.

Principle 2: Conduct  
Players embody the gentlemanly spirit through courteous behaviour, proper deportment, and respectful discourse, maintaining civility regardless of the circumstances of play.

Principle 3: Attire
Players honour tradition through proper dress: white clothing or, when unavailable, light earth colours such as sand, maintaining dignity whilst avoiding the appearance of American sporting fashion.

Principle 4: Fair Play and Honour
Players conduct themselves with unwavering integrity, acknowledging their own faults and upholding the highest standards of sporting honour in all aspects of play.

Principle 5: Respect for Opponents and Self-Regulation
Players demonstrate respect for their opponents through courteous treatment and fair consideration, whilst exercising rigorous self-regulation in adherence to the laws and spirit of the game.`
    },
    {
      id: "part1-1",
      language: "en", 
      part_title: "Part I: Introduction",
      part_order: 1,
      section_title: "1. Objective of the Game",
      section_order: 1,
      content: `1.1 The objective of Stichts Croquet is to be the first player to strike the central peg with your ball after successfully completing all required hoops in the correct sequence.

1.2 All players compete as individuals. No partnerships, teams, or alliances are recognised under these Laws.

1.3 The game is won immediately when a player lawfully strikes the peg, regardless of other players' positions on the course.

1.4 The course sequence required before striking the peg is determined by the game format as specified in Law 2.`
    },
    {
      id: "part1-2",
      language: "en",
      part_title: "Part I: Introduction", 
      part_order: 1,
      section_title: "2. Game Formats",
      section_order: 2,
      content: `2.1 Stichts Croquet may be played in two formats, which must be agreed upon before commencement of play.

2.2 Full Game: Players must successfully complete hoops 1, 2, 3, 4, 5, and 6 in sequence before being eligible to strike the peg.

2.3 Double Game: Players must successfully complete hoops 1, 2, 3, 4, 5, 6, then 1-back, 2-back, 3-back, 4-back, penultimate, and rover in sequence before being eligible to strike the peg.

2.4 The game format shall be determined by mutual agreement among players or by tournament regulations. If no specific agreement is made, the Full Game format shall apply by default.`
    },
    {
      id: "part1-3",
      language: "en",
      part_title: "Part I: Introduction",
      part_order: 1,
      section_title: "3. Equipment and Court",
      section_order: 3,
      content: `3.1 The standard court shall measure 28 yards by 35 yards, marked with appropriate boundaries.

3.2 Six hoops shall be arranged in the pattern shown in the official court diagram.

3.3 A central peg shall be positioned at the center of the court.

3.4 Players shall use mallets of appropriate weight and length, typically between 2.5 and 3 feet in length.

3.5 Balls shall be of regulation size and weight, distinctly coloured for each player.`
    },
    // Dutch versions
    {
      id: "preamble-1-nl",
      language: "nl",
      part_title: "Preambule", 
      part_order: 0,
      section_title: "De Tien Beginselen van Stichts Croquet",
      section_order: 1,
      content: `Beginsel 1: Erfgoed en Traditie
Stichts Croquet ontleent haar edele karakter aan de Victorian traditie van croquet zoals gespeeld in de tuinen van Engelse landhuizen, waarbij de elegantie en verfijning van dit voorname erfgoed behouden blijven.

Beginsel 2: Gedrag
Spelers belichamen de geest van hoffelijkheid door wellevend gedrag, gepaste houding en respectvol discours, waarbij beschaving te allen tijde gehandhaafd wordt, ongeacht de omstandigheden van het spel.

Beginsel 3: Kledij  
Spelers eren de traditie door gepaste kleding: witte kledij of, indien niet voorhanden, lichte aardtinten zoals zand, waarbij waardigheid behouden blijft en de schijn van Amerikaanse sportmode vermeden wordt.

Beginsel 4: Eerlijk Spel en Eer
Spelers gedragen zich met onwankelbare integriteit, erkennen hun eigen fouten en handhaven de hoogste normen van sportieve eer in alle aspecten van het spel.

Beginsel 5: Respect voor Tegenstanders en Zelfregulering
Spelers tonen respect voor hun tegenstanders door hoffelijke behandeling en eerlijke overweging, terwijl zij rigoureuze zelfregulering uitoefenen in het naleven van de wetten en de geest van het spel.`
    },
    {
      id: "part1-1-nl",
      language: "nl",
      part_title: "Deel I: Inleiding",
      part_order: 1,
      section_title: "1. Doel van het Spel",
      section_order: 1,
      content: `1.1 Het doel van Stichts Croquet is om als eerste speler de centrale paal te raken met uw bal nadat u alle vereiste hoepels in de juiste volgorde succesvol hebt voltooid.

1.2 Alle spelers strijden als individuen. Geen partnerschappen, teams of allianties worden erkend onder deze Wetten.

1.3 Het spel wordt onmiddellijk gewonnen wanneer een speler wettig de paal raakt, ongeacht de posities van andere spelers op het veld.

1.4 De veldsequentie die vereist is voordat de paal wordt geraakt, wordt bepaald door het spelformaat zoals gespecificeerd in Wet 2.`
    }
  ]

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId)
    } else {
      newExpanded.add(sectionId)
    }
    setExpandedSections(newExpanded)
  }

  // Group rules by language and part
  const languageRules = rules.filter(rule => rule.language === selectedLanguage)
  const groupedRules = languageRules.reduce((acc: any, rule: any) => {
    const key = rule.part_title
    if (!acc[key]) {
      acc[key] = {
        title: rule.part_title,
        order: rule.part_order,
        sections: []
      }
    }
    acc[key].sections.push(rule)
    return acc
  }, {})

  // Sort by part order
  const sortedParts = Object.values(groupedRules).sort((a: any, b: any) => a.order - b.order)

  if (loading) {
    return (
      <Layout currentPageName="Official Laws">
        <div className="text-center py-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
          <p className="font-body text-emerald-600 text-lg">Loading Official Laws of Stichts Croquet...</p>
          <p className="font-body text-emerald-500 text-sm mt-2">Retrieving the definitive manual for the noble game</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout currentPageName="Official Laws">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="font-display text-4xl font-bold text-emerald-900">
            Official Laws of Stichts Croquet
          </h1>
          <div className="ornate-divider w-64 mx-auto"></div>
          <p className="font-body text-xl text-emerald-700 max-w-3xl mx-auto">
            The definitive manual for the governance of the noble game
          </p>
          {error && (
            <div className="max-w-2xl mx-auto p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-body font-semibold">Notice:</span>
              </div>
              <p className="font-body text-amber-700 mt-1">
                Using fallback rule content. API Error: {error}
              </p>
            </div>
          )}
        </div>

        {/* Language Selection */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => setSelectedLanguage("en")}
            className={`px-6 py-3 rounded-lg font-body font-semibold transition-all duration-300 ${
              selectedLanguage === "en"
                ? "bg-amber-400 text-emerald-900 shadow-lg ring-2 ring-amber-400"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            🇬🇧 English
          </button>
          <button
            onClick={() => setSelectedLanguage("nl")}
            className={`px-6 py-3 rounded-lg font-body font-semibold transition-all duration-300 ${
              selectedLanguage === "nl"
                ? "bg-amber-400 text-emerald-900 shadow-lg ring-2 ring-amber-400"
                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
            }`}
          >
            🇳🇱 Nederlands
          </button>
        </div>

        {/* Rules Sections */}
        <div className="space-y-6">
          {sortedParts.map((part: any) => (
            <Card key={part.title} className="border-2 border-emerald-100 shadow-lg hover:shadow-xl transition-shadow">
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
                    <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-300">
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
                    .sort((a: any, b: any) => a.section_order - b.section_order)
                    .map((section: any) => (
                    <div key={section.id} className="border-l-4 border-amber-400 pl-6 py-2">
                      <h3 className="font-display text-xl font-semibold text-emerald-800 mb-3 heading-edwardian">
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
        {languageRules.length === 0 && !loading && (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="font-display text-2xl text-emerald-900 mb-2">
                Rules Not Available
              </h3>
              <p className="font-body text-emerald-600 mb-4">
                The rules for {selectedLanguage === 'en' ? 'English' : 'Nederlands'} have not been loaded yet.
              </p>
              <Button onClick={loadRules} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                <Loader2 className="w-4 h-4 mr-2" />
                Try Reload
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="bg-gradient-to-br from-emerald-50 to-amber-50 border-2 border-emerald-200">
          <CardContent className="p-8 text-center">
            <BookOpen className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="font-display text-2xl font-bold text-emerald-900 mb-4 heading-edwardian">
              Nederlandse Bond der Clubs
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

        {/* Debug Information (only in development) */}
        {process.env.NODE_ENV === 'development' && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-body font-semibold text-blue-800 mb-2">Debug Information</h4>
              <div className="font-body text-blue-700 text-sm space-y-1">
                <p>Total rules loaded: {rules.length}</p>
                <p>Active language: {selectedLanguage}</p>
                <p>Rules for current language: {languageRules.length}</p>
                <p>Grouped parts: {sortedParts.length}</p>
                <p>Expanded sections: {expandedSections.size}</p>
                <p>API Error: {error || 'None'}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  )
}