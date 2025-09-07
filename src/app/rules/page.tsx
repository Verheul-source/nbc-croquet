// src/app/rules/page.tsx - Rules Page with Fallback Data
import React, { useState, useEffect } from 'react'
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

  // Fallback rules data
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

3.5 Four balls shall be used, distinctly coloured for easy identification during play.`
    }
  ]

  // Filter rules by selected language
  const languageRules = rules.filter(rule => rule.language === selectedLanguage)

  // Group rules by part
  const groupedRules = languageRules.reduce((acc, rule) => {
    const partTitle = rule.part_title
    if (!acc[partTitle]) {
      acc[partTitle] = {
        title: partTitle,
        order: rule.part_order,
        sections: []
      }
    }
    acc[partTitle].sections.push(rule)
    return acc
  }, {} as Record<string, any>)

  // Sort parts and sections
  const sortedParts = Object.values(groupedRules).sort((a: any, b: any) => a.order - b.order)
  sortedParts.forEach((part: any) => {
    part.sections.sort((a: any, b: any) => a.section_order - b.section_order)
  })

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle)
    } else {
      newExpanded.add(sectionTitle)
    }
    setExpandedSections(newExpanded)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="font-body text-emerald-700">Loading the Laws of Stichts Croquet...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-4 mb-6">
          <BookOpen className="w-12 h-12 text-amber-500" />
          <div>
            <h1 className="font-display text-4xl font-bold text-emerald-900">
              The Laws of Stichts Croquet
            </h1>
            <p className="font-body text-lg text-emerald-700">
              Complete rules and regulations governing the noble sport
            </p>
          </div>
        </div>
        
        {error && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-amber-800">
              <AlertCircle className="w-5 h-5" />
              <p className="font-body text-sm">
                API Error: {error}
              </p>
            </div>
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
                  {expandedSections.has(part.title) ? 
                    <ChevronDown className="w-5 h-5 text-emerald-600" /> : 
                    <ChevronRight className="w-5 h-5 text-emerald-600" />
                  }
                </div>
              </CardTitle>
            </CardHeader>
            
            {expandedSections.has(part.title) && (
              <CardContent className="space-y-6">
                {part.sections.map((section: any) => (
                  <div key={section.id} className="border-l-4 border-amber-300 pl-6">
                    <h3 className="font-display text-xl font-semibold text-emerald-900 mb-3">
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

      {/* Footer */}
      <Card className="bg-gradient-to-r from-emerald-50 to-amber-50 border-emerald-200">
        <CardContent className="p-8 text-center">
          <h3 className="font-display text-2xl font-bold text-emerald-900 mb-4">
            Nederlandse Bond der Clubs
          </h3>
          <p className="font-body text-emerald-700 leading-relaxed max-w-3xl mx-auto">
            These Laws have been carefully developed to preserve the essential character of croquet 
            whilst providing clear guidance for fair and enjoyable play. They represent the collective 
            wisdom of generations of players committed to maintaining the highest standards of this noble sport.
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
  )
}