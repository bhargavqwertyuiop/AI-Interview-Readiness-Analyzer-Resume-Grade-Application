import jsPDF from 'jspdf'
import { calculateReadinessScore } from './readinessCalculator'
import { getWeakAreas } from './weakAreaDetector'
import { calculateQuestionProgress } from '../data/questionBank'

/**
 * Generate Interview Readiness Report PDF
 * @param {Object} data - Report data object
 * @param {string} data.role - Target role
 * @param {Array} data.topics - Array of topic objects
 * @param {Array} data.mockInterviews - Array of mock interview objects
 */
export function generateInterviewReadinessReport({ role, topics, mockInterviews }) {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - (margin * 2)
  let yPosition = margin

  // Helper function to add new page if needed
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage()
      yPosition = margin
      return true
    }
    return false
  }

  // Helper function to add text with word wrap
  const addText = (text, x, y, options = {}) => {
    const {
      fontSize = 10,
      fontStyle = 'normal',
      color = [0, 0, 0],
      maxWidth = contentWidth,
      align = 'left',
    } = options

    doc.setFontSize(fontSize)
    doc.setFont('helvetica', fontStyle)
    doc.setTextColor(...color)

    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y, { align })
    return lines.length * (fontSize * 0.4) + 5
  }

  // Helper function to draw a line
  const drawLine = (y) => {
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, y, pageWidth - margin, y)
  }

  // ========== HEADER ==========
  doc.setFillColor(59, 130, 246)
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('Interview Readiness Report', margin, 25)
  
  yPosition = 50

  // ========== REPORT METADATA ==========
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Target Role: ${role}`, margin, yPosition)
  yPosition += 7
  doc.text(`Report Date: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, margin, yPosition)
  yPosition += 15

  drawLine(yPosition)
  yPosition += 10

  // ========== OVERALL READINESS SCORE ==========
  const readinessScore = calculateReadinessScore(topics)
  const scoreColor = readinessScore >= 71 ? [34, 197, 94] : readinessScore >= 41 ? [251, 191, 36] : [239, 68, 68]
  const scoreLevel = readinessScore >= 71 ? 'Ready' : readinessScore >= 41 ? 'Getting There' : 'Needs Work'

  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Overall Readiness Score', margin, yPosition)
  yPosition += 10

  // Score circle (simplified as a box with text)
  const scoreBoxSize = 60
  const scoreBoxX = pageWidth - margin - scoreBoxSize
  doc.setFillColor(...scoreColor)
  doc.setDrawColor(...scoreColor)
  doc.roundedRect(scoreBoxX, yPosition - 15, scoreBoxSize, scoreBoxSize, 5, 5, 'FD')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text(`${Math.round(readinessScore)}%`, scoreBoxX + scoreBoxSize / 2, yPosition + 5, { align: 'center' })
  
  doc.setFontSize(10)
  doc.text(scoreLevel, scoreBoxX + scoreBoxSize / 2, yPosition + 15, { align: 'center' })

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Based on topic confidence, question bank progress,', margin, yPosition)
  yPosition += 7
  doc.text('and preparation consistency', margin, yPosition)
  yPosition += 20

  checkPageBreak(30)
  drawLine(yPosition)
  yPosition += 10

  // ========== SKILL-WISE CONFIDENCE TABLE ==========
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Skill-Wise Confidence', margin, yPosition)
  yPosition += 10

  // Group topics by category
  const categoryData = {}
  topics.forEach(topic => {
    if (!categoryData[topic.category]) {
      categoryData[topic.category] = {
        topics: [],
        totalConfidence: 0,
        confidentCount: 0,
      }
    }
    categoryData[topic.category].topics.push(topic)
    categoryData[topic.category].totalConfidence += topic.confidence || 1
    if (topic.status === 'Confident') {
      categoryData[topic.category].confidentCount++
    }
  })

  // Table header
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(margin, yPosition - 5, contentWidth, 8, 'F')
  
  doc.text('Category', margin + 2, yPosition)
  doc.text('Topics', margin + 70, yPosition)
  doc.text('Confident', margin + 110, yPosition)
  doc.text('Avg Confidence', margin + 150, yPosition)
  yPosition += 10

  // Table rows
  doc.setFont('helvetica', 'normal')
  Object.entries(categoryData).forEach(([category, data]) => {
    checkPageBreak(10)
    
    const avgConfidence = (data.totalConfidence / data.topics.length).toFixed(1)
    const confidentPercentage = ((data.confidentCount / data.topics.length) * 100).toFixed(0)

    doc.text(category, margin + 2, yPosition)
    doc.text(`${data.topics.length}`, margin + 70, yPosition)
    doc.text(`${data.confidentCount} (${confidentPercentage}%)`, margin + 110, yPosition)
    doc.text(`${avgConfidence}/5`, margin + 150, yPosition)
    yPosition += 7
  })

  yPosition += 5
  checkPageBreak(30)
  drawLine(yPosition)
  yPosition += 10

  // ========== WEAK AREAS ==========
  const weakAreas = getWeakAreas(topics)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Focus Areas', margin, yPosition)
  yPosition += 10

  if (weakAreas.length === 0) {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(34, 197, 94)
    doc.text('Great progress! No weak areas detected.', margin, yPosition)
    yPosition += 10
  } else {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    
    weakAreas.forEach((area, index) => {
      checkPageBreak(15)
      doc.setFont('helvetica', 'bold')
      doc.text(`${index + 1}. ${area.topic}`, margin, yPosition)
      yPosition += 7
      doc.setFont('helvetica', 'normal')
      const suggestionHeight = addText(area.suggestion, margin, yPosition, { maxWidth: contentWidth - 10 })
      yPosition += suggestionHeight + 5
    })
  }

  yPosition += 5
  checkPageBreak(30)
  drawLine(yPosition)
  yPosition += 10

  // ========== QUESTION BANK COVERAGE ==========
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Question Bank Coverage', margin, yPosition)
  yPosition += 10

  let totalQuestions = 0
  let confidentQuestions = 0
  let topicsWithQuestions = 0

  topics.forEach(topic => {
    if (topic.questions && topic.questions.length > 0) {
      topicsWithQuestions++
      const progress = calculateQuestionProgress(topic.questions)
      totalQuestions += progress.total
      confidentQuestions += progress.confident
    }
  })

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Topics with Questions: ${topicsWithQuestions} / ${topics.length}`, margin, yPosition)
  yPosition += 7
  doc.text(`Total Questions: ${totalQuestions}`, margin, yPosition)
  yPosition += 7
  doc.text(`Confident Questions: ${confidentQuestions} / ${totalQuestions}`, margin, yPosition)
  yPosition += 7
  
  if (totalQuestions > 0) {
    const questionCoverage = ((confidentQuestions / totalQuestions) * 100).toFixed(1)
    doc.text(`Question Coverage: ${questionCoverage}%`, margin, yPosition)
    yPosition += 10
  } else {
    doc.setTextColor(150, 150, 150)
    doc.text('No questions added yet. Start adding questions to track your preparation.', margin, yPosition)
    yPosition += 10
  }

  yPosition += 5
  checkPageBreak(30)
  drawLine(yPosition)
  yPosition += 10

  // ========== MOCK INTERVIEW SUMMARY ==========
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  doc.text('Mock Interview Summary', margin, yPosition)
  yPosition += 10

  const completedMocks = mockInterviews.filter(m => m.completed).length
  const upcomingMocks = mockInterviews.filter(m => !m.completed && new Date(m.scheduledDate) > new Date()).length

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Completed Mock Interviews: ${completedMocks}`, margin, yPosition)
  yPosition += 7
  doc.text(`Upcoming Mock Interviews: ${upcomingMocks}`, margin, yPosition)
  yPosition += 7
  doc.text(`Total Scheduled: ${mockInterviews.length}`, margin, yPosition)
  yPosition += 10

  // ========== FOOTER ==========
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      `Page ${i} of ${totalPages} | Generated by Interview Readiness Analyzer`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
  }

  // Generate filename
  const filename = `Interview_Readiness_Report_${role.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`

  // Save PDF
  doc.save(filename)
}

