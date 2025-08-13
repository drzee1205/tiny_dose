export interface Drug {
  id: string;
  system: string;
  name: string;
  class: string;
  indication: string;
  pediatricDose: string;
  maxDose: string;
  dosageForm: string;
  route: string;
  frequency: string;
  contraindications: string;
  majorSideEffects: string;
  specialNotes: string;
}

export interface DoseCalculation {
  drugId: string;
  drugName: string;
  patientWeight: number;
  patientWeightUnit: 'kg' | 'lbs';
  calculatedDose: number;
  doseUnit: string;
  frequency: string;
  maxDoseExceeded: boolean;
  maxDose: string;
  warnings: string[];
}

export interface Patient {
  weight: number;
  weightUnit: 'kg' | 'lbs';
  age?: number;
  ageUnit?: 'days' | 'months' | 'years';
}

export interface SearchFilters {
  system?: string;
  drugClass?: string;
  indication?: string;
  route?: string;
}

export interface DrugFilters {
  system?: string;
  drugClass?: string;
  route?: string;
  dosageForm?: string;
  frequency?: string;
  sortBy?: 'name' | 'system' | 'class' | 'route';
}

export interface AppSettings {
  preferredWeightUnit: 'kg' | 'lbs';
  darkMode: boolean;
  favorites: string[];
  recentDrugs: string[];
}

export const MEDICAL_SYSTEMS = [
  'Cardiovascular',
  'Dermatology', 
  'Endocrine',
  'Fluid_Electrolyte',
  'Gastroenterology',
  'Hematology',
  'Immunology_Allergy',
  'Infectious_Diseases',
  'Metabolic_Disorders',
  'Musculoskeletal_Orthopedics',
  'Neonatology',
  'Nephrology',
  'Neurological',
  'Oncology',
  'Ophthalmology',
  'Otolaryngology',
  'Pain_Management_Anesthesia',
  'Psychiatry_Behavioral',
  'Respiratory',
  'Rheumatology',
  'Toxicology_Emergency',
  'Vaccinology'
] as const;

export type MedicalSystem = typeof MEDICAL_SYSTEMS[number];