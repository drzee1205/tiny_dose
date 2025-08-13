import { Drug, DoseCalculation, Patient, DrugFilters } from '@/types/drug';

let drugDatabase: Drug[] = [];
let isLoaded = false;

export async function loadDrugDatabase(): Promise<Drug[]> {
  if (isLoaded && drugDatabase.length > 0) {
    return drugDatabase;
  }

  try {
    const response = await fetch('/pediatric_drugs.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    drugDatabase = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map((line, index) => {
        const values = parseCSVLine(line);
        return {
          id: `drug-${index + 1}`,
          system: values[0] || '',
          name: values[1] || '',
          class: values[2] || '',
          indication: values[3] || '',
          pediatricDose: values[4] || '',
          maxDose: values[5] || '',
          dosageForm: values[6] || '',
          route: values[7] || '',
          frequency: values[8] || '',
          contraindications: values[9] || '',
          majorSideEffects: values[10] || '',
          specialNotes: values[11] || ''
        };
      })
      .filter(drug => drug.name && drug.system);
    
    isLoaded = true;
    return drugDatabase;
  } catch (error) {
    console.error('Failed to load drug database:', error);
    return [];
  }
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '\"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

export function searchDrugs(query: string, drugs: Drug[]): Drug[] {
  if (!query.trim()) return drugs;
  
  const searchTerm = query.toLowerCase();
  return drugs.filter(drug => 
    drug.name.toLowerCase().includes(searchTerm) ||
    drug.indication.toLowerCase().includes(searchTerm) ||
    drug.system.toLowerCase().includes(searchTerm) ||
    drug.class.toLowerCase().includes(searchTerm) ||
    drug.route.toLowerCase().includes(searchTerm) ||
    drug.dosageForm.toLowerCase().includes(searchTerm) ||
    drug.frequency.toLowerCase().includes(searchTerm)
  );
}



export function filterDrugs(drugs: Drug[], filters: DrugFilters): Drug[] {
  let filtered = drugs;
  
  // Apply system filter
  if (filters.system && filters.system !== 'all') {
    filtered = filtered.filter(drug => drug.system === filters.system);
  }
  
  // Apply drug class filter
  if (filters.drugClass && filters.drugClass !== 'all') {
    filtered = filtered.filter(drug => drug.class === filters.drugClass);
  }
  
  // Apply route filter
  if (filters.route && filters.route !== 'all') {
    filtered = filtered.filter(drug => drug.route === filters.route);
  }
  
  // Apply dosage form filter
  if (filters.dosageForm && filters.dosageForm !== 'all') {
    filtered = filtered.filter(drug => drug.dosageForm === filters.dosageForm);
  }
  
  // Apply frequency filter
  if (filters.frequency && filters.frequency !== 'all') {
    filtered = filtered.filter(drug => drug.frequency === filters.frequency);
  }
  
  // Apply sorting
  if (filters.sortBy) {
    filtered = sortDrugs(filtered, filters.sortBy);
  }
  
  return filtered;
}

export function filterDrugsBySystem(system: string, drugs: Drug[]): Drug[] {
  if (!system || system === 'all') return drugs;
  return drugs.filter(drug => drug.system === system);
}

export function sortDrugs(drugs: Drug[], sortBy: 'name' | 'system' | 'class' | 'route'): Drug[] {
  return [...drugs].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase();
    const bValue = b[sortBy].toLowerCase();
    return aValue.localeCompare(bValue);
  });
}

export function getUniqueValues(drugs: Drug[], field: keyof Drug): string[] {
  const values = drugs.map(drug => drug[field]).filter(Boolean);
  return [...new Set(values)].sort();
}

export function getQuickFilters(drugs: Drug[]): { label: string; count: number; filters: DrugFilters }[] {
  const totalDrugs = drugs.length;
  
  return [
    {
      label: `Emergency (${drugs.filter(d => d.system === 'Toxicology_Emergency').length})`,
      count: drugs.filter(d => d.system === 'Toxicology_Emergency').length,
      filters: { system: 'Toxicology_Emergency' }
    },
    {
      label: `IV Medications (${drugs.filter(d => d.route.includes('IV')).length})`,
      count: drugs.filter(d => d.route.includes('IV')).length,
      filters: { route: 'IV' }
    },
    {
      label: `Oral (${drugs.filter(d => d.route === 'PO').length})`,
      count: drugs.filter(d => d.route === 'PO').length,
      filters: { route: 'PO' }
    },
    {
      label: `Antibiotics (${drugs.filter(d => d.system === 'Infectious_Diseases').length})`,
      count: drugs.filter(d => d.system === 'Infectious_Diseases').length,
      filters: { system: 'Infectious_Diseases' }
    },
    {
      label: `Once Daily (${drugs.filter(d => d.frequency.includes('Once daily') || d.frequency.includes('daily')).length})`,
      count: drugs.filter(d => d.frequency.includes('Once daily') || d.frequency.includes('daily')).length,
      filters: { frequency: 'Once daily' }
    },
    {
      label: `Cardiovascular (${drugs.filter(d => d.system === 'Cardiovascular').length})`,
      count: drugs.filter(d => d.system === 'Cardiovascular').length,
      filters: { system: 'Cardiovascular' }
    }
  ].filter(f => f.count > 0);
}

export function calculateDose(drug: Drug, patient: Patient): DoseCalculation {
  const warnings: string[] = [];
  
  // Convert weight to kg if needed
  const weightInKg = patient.weightUnit === 'lbs' 
    ? patient.weight * 0.453592 
    : patient.weight;
  
  // Parse dose from pediatric dose string
  const doseInfo = parseDoseString(drug.pediatricDose, weightInKg);
  
  // Check contraindications
  if (drug.contraindications && drug.contraindications !== 'None') {
    warnings.push(`Contraindications: ${drug.contraindications}`);
  }
  
  // Check max dose
  const maxDoseExceeded = checkMaxDose(doseInfo.calculatedDose, drug.maxDose, doseInfo.unit);
  if (maxDoseExceeded) {
    warnings.push(`Calculated dose exceeds maximum: ${drug.maxDose}`);
  }
  
  // Add special notes as warnings
  if (drug.specialNotes) {
    warnings.push(`Special Notes: ${drug.specialNotes}`);
  }
  
  return {
    drugId: drug.id,
    drugName: drug.name,
    patientWeight: patient.weight,
    patientWeightUnit: patient.weightUnit,
    calculatedDose: doseInfo.calculatedDose,
    doseUnit: doseInfo.unit,
    frequency: drug.frequency,
    maxDoseExceeded,
    maxDose: drug.maxDose,
    warnings
  };
}

interface DoseInfo {
  calculatedDose: number;
  unit: string;
}

function parseDoseString(doseString: string, weightInKg: number): DoseInfo {
  // Common patterns in the dose strings
  const patterns = [
    // mg/kg/day patterns
    /(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*mg\/kg\/day/i,
    /(\d+(?:\.\d+)?)\s*mg\/kg\/day/i,
    // mg/kg patterns  
    /(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*mg\/kg/i,
    /(\d+(?:\.\d+)?)\s*mg\/kg/i,
    // mcg/kg patterns
    /(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*mcg\/kg/i,
    /(\d+(?:\.\d+)?)\s*mcg\/kg/i,
    // Units/kg patterns
    /(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?\s*U\/kg/i,
    /(\d+(?:\.\d+)?)\s*U\/kg/i,
  ];
  
  for (const pattern of patterns) {
    const match = doseString.match(pattern);
    if (match) {
      const dose1 = parseFloat(match[1]);
      const dose2 = match[2] ? parseFloat(match[2]) : dose1;
      
      // Use the average of the range or the single dose
      const avgDose = (dose1 + dose2) / 2;
      const calculatedDose = avgDose * weightInKg;
      
      // Determine unit
      let unit = 'mg';
      if (doseString.includes('mcg')) unit = 'mcg';
      if (doseString.includes('U/kg') || doseString.includes('unit')) unit = 'units';
      
      return { calculatedDose, unit };
    }
  }
  
  // If no pattern matches, return default
  return { calculatedDose: 0, unit: 'mg' };
}

function checkMaxDose(calculatedDose: number, maxDoseString: string, unit: string): boolean {
  if (!maxDoseString || maxDoseString === '—' || maxDoseString === '') {
    return false;
  }
  
  // Extract numeric value from max dose string
  const maxDoseMatch = maxDoseString.match(/(\d+(?:\.\d+)?)/);
  if (!maxDoseMatch) return false;
  
  const maxDose = parseFloat(maxDoseMatch[1]);
  
  // Convert units if needed for comparison
  let adjustedCalculatedDose = calculatedDose;
  if (unit === 'mcg' && maxDoseString.includes('mg')) {
    adjustedCalculatedDose = calculatedDose / 1000;
  } else if (unit === 'mg' && maxDoseString.includes('mcg')) {
    adjustedCalculatedDose = calculatedDose * 1000;
  }
  
  return adjustedCalculatedDose > maxDose;
}

export function convertWeight(weight: number, fromUnit: 'kg' | 'lbs', toUnit: 'kg' | 'lbs'): number {
  if (fromUnit === toUnit) return weight;
  
  if (fromUnit === 'lbs' && toUnit === 'kg') {
    return weight * 0.453592;
  } else if (fromUnit === 'kg' && toUnit === 'lbs') {
    return weight * 2.20462;
  }
  
  return weight;
}

export function getDrugById(id: string, drugs: Drug[]): Drug | undefined {
  return drugs.find(drug => drug.id === id);
}