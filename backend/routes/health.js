const express = require('express');
const router = express.Router();
const HealthReport = require('../models/HealthReport');

// Health knowledge base (rule-based system)
const healthKnowledgeBase = {
  'fever': {
    conditions: [
      { name: 'Common Cold', probability: 'Medium', symptoms: ['fever', 'cough', 'sore throat', 'runny nose'] },
      { name: 'Flu', probability: 'High', symptoms: ['fever', 'body ache', 'fatigue', 'cough'] },
      { name: 'Viral Infection', probability: 'Medium', symptoms: ['fever', 'weakness'] }
    ],
    precautions: ['Rest adequately', 'Stay hydrated', 'Monitor temperature'],
    recommendations: ['Drink warm fluids', 'Take paracetamol if needed', 'Consult doctor if fever persists']
  },
  'cough': {
    conditions: [
      { name: 'Common Cold', probability: 'High', symptoms: ['cough', 'fever', 'sore throat'] },
      { name: 'Bronchitis', probability: 'Medium', symptoms: ['cough', 'chest pain', 'fatigue'] },
      { name: 'Allergies', probability: 'Low', symptoms: ['cough', 'sneezing', 'itchy eyes'] }
    ],
    precautions: ['Avoid cold drinks', 'Stay warm', 'Avoid pollutants'],
    recommendations: ['Honey and warm water', 'Steam inhalation', 'Cough syrup if persistent']
  },
  'headache': {
    conditions: [
      { name: 'Tension Headache', probability: 'High', symptoms: ['headache', 'stress', 'fatigue'] },
      { name: 'Migraine', probability: 'Medium', symptoms: ['headache', 'nausea', 'sensitivity to light'] },
      { name: 'Dehydration', probability: 'Low', symptoms: ['headache', 'dizziness'] }
    ],
    precautions: ['Rest in quiet room', 'Reduce screen time', 'Manage stress'],
    recommendations: ['Drink plenty of water', 'Cold compress on forehead', 'Pain reliever if needed']
  },
  'stomach pain': {
    conditions: [
      { name: 'Indigestion', probability: 'High', symptoms: ['stomach pain', 'bloating', 'nausea'] },
      { name: 'Food Poisoning', probability: 'Medium', symptoms: ['stomach pain', 'vomiting', 'diarrhea'] },
      { name: 'Gastritis', probability: 'Low', symptoms: ['stomach pain', 'burning sensation'] }
    ],
    precautions: ['Avoid spicy food', 'Eat light meals', 'Stay hydrated'],
    recommendations: ['BRAT diet (Banana, Rice, Apple, Toast)', 'Antacids', 'See doctor if severe']
  },
  'fatigue': {
    conditions: [
      { name: 'Sleep Deprivation', probability: 'High', symptoms: ['fatigue', 'tiredness', 'lack of focus'] },
      { name: 'Anemia', probability: 'Medium', symptoms: ['fatigue', 'weakness', 'pale skin'] },
      { name: 'Vitamin Deficiency', probability: 'Low', symptoms: ['fatigue', 'muscle weakness'] }
    ],
    precautions: ['Improve sleep schedule', 'Eat nutritious food', 'Regular exercise'],
    recommendations: ['7-8 hours sleep', 'Iron-rich foods', 'Multivitamins']
  },
  'body ache': {
    conditions: [
      { name: 'Flu', probability: 'High', symptoms: ['body ache', 'fever', 'fatigue'] },
      { name: 'Overexertion', probability: 'Medium', symptoms: ['body ache', 'muscle soreness'] },
      { name: 'Fibromyalgia', probability: 'Low', symptoms: ['body ache', 'chronic pain'] }
    ],
    precautions: ['Rest muscles', 'Gentle stretching', 'Warm compress'],
    recommendations: ['Pain reliever', 'Massage', 'Hot water bath']
  },
  'sore throat': {
    conditions: [
      { name: 'Pharyngitis', probability: 'High', symptoms: ['sore throat', 'difficulty swallowing', 'fever'] },
      { name: 'Tonsillitis', probability: 'Medium', symptoms: ['sore throat', 'swollen tonsils'] },
      { name: 'Strep Throat', probability: 'Low', symptoms: ['sore throat', 'red spots on throat'] }
    ],
    precautions: ['Gargle with salt water', 'Avoid cold beverages', 'Rest your voice'],
    recommendations: ['Warm liquids', 'Throat lozenges', 'See doctor if persists']
  }
};

// Analyze symptoms
router.post('/analyze', async (req, res) => {
  try {
    const { symptoms, userId } = req.body;
    
    if (!symptoms || symptoms.length === 0) {
      return res.status(400).json({ error: 'Please provide at least one symptom' });
    }

    // Convert symptoms to lowercase for matching
    const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
    
    // Find matching conditions
    let possibleConditions = [];
    let allPrecautions = new Set();
    let allRecommendations = new Set();
    let severity = 'low';

    normalizedSymptoms.forEach(symptom => {
      if (healthKnowledgeBase[symptom]) {
        const data = healthKnowledgeBase[symptom];
        possibleConditions.push(...data.conditions);
        data.precautions.forEach(p => allPrecautions.add(p));
        data.recommendations.forEach(r => allRecommendations.add(r));
      }
    });

    // Remove duplicates and score conditions
    const conditionMap = {};
    possibleConditions.forEach(condition => {
      if (!conditionMap[condition.name]) {
        conditionMap[condition.name] = {
          condition: condition.name,
          probability: condition.probability,
          matchCount: 1,
          description: `Based on your symptoms, this condition is possible.`
        };
      } else {
        conditionMap[condition.name].matchCount++;
      }
    });

    // Sort by match count
    const sortedConditions = Object.values(conditionMap).sort((a, b) => b.matchCount - a.matchCount);

    // Determine severity based on number of symptoms
    if (normalizedSymptoms.length >= 4) {
      severity = 'high';
    } else if (normalizedSymptoms.length >= 2) {
      severity = 'medium';
    }

    // Create health report
    const report = new HealthReport({
      userId: userId || 'default-user',
      symptoms: normalizedSymptoms,
      possibleConditions: sortedConditions,
      precautions: Array.from(allPrecautions),
      recommendations: Array.from(allRecommendations),
      severity
    });

    await report.save();

    res.json({
      message: 'Health analysis completed',
      report
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all health reports
router.get('/reports', async (req, res) => {
  try {
    const { userId } = req.query;
    const query = userId ? { userId } : {};
    const reports = await HealthReport.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get health report by ID
router.get('/reports/:reportId', async (req, res) => {
  try {
    const report = await HealthReport.findOne({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete health report
router.delete('/reports/:reportId', async (req, res) => {
  try {
    const report = await HealthReport.findOneAndDelete({ reportId: req.params.reportId });
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available symptoms list
router.get('/symptoms', (req, res) => {
  const symptomsList = Object.keys(healthKnowledgeBase).map(symptom => ({
    name: symptom,
    displayName: symptom.charAt(0).toUpperCase() + symptom.slice(1)
  }));
  res.json(symptomsList);
});

module.exports = router;
