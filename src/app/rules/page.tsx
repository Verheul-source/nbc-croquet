// src/app/rules/page.tsx - Rules Page (App Router)
'use client'

import React, { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  useEffect(() => {
    loadRules()
  }, [selectedLanguage])

  const loadRules = async () => {
    try {
      const response = await fetch(`/api/rules?language=${selectedLanguage}`)
      if (response.ok) {
        const data = await response.json()
        setRules(data)
      }
    } catch (error) {
      console.error('Error loading rules:', error)
    } finally {
      setLoading(false)
    }
  }

  const groupedRules = rules.reduce((acc: any, rule: any) => {
    if (!acc[rule.part_title]) {
      acc[rule.part_title] = []
    }
    acc[rule.part_title].push(rule)
    return acc
  }, {})

  const renderRuleContent = (content: string) => {
    return content.split('\n').map((paragraph, index) => (
      <p key={index} className="mb-4 leading-relaxed text-emerald-800">
        {paragraph}
      </p>
    ))
  }

  if (loading) {
    return (
      <Layout currentPageName="Official Laws">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="font-body text-emerald-600 mt-4">Loading Official Rules...</p>
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
            The definitive manual for the governance of the noble game.
            Select your preferred language to view the rules.
          </p>
        </div>

        {/* Language Selection */}
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

        {/* Rules Content */}
        <div className="space-y-10">
          {Object.entries(groupedRules)
            .sort(([,a], [,b]) => (a as any)[0].part_order - (b as any)[0].part_order)
            .map(([partTitle, sections]) => (
            <div key={partTitle} className="card-edwardian p-8 shadow-lg">
              <h2 className="font-display text-3xl font-bold text-emerald-900 mb-6 text-center heading-edwardian border-b-2 border-amber-300 pb-4">
                {partTitle}
              </h2>
              
              <div className="space-y-8">
                {(sections as any[]).map(section => (
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
    </Layout>
  )
}