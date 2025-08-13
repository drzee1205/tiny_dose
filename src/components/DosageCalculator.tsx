import { useState, useMemo } from 'react';
import { Calculator, AlertTriangle, Info, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Drug, Patient, DoseCalculation } from '@/types/drug';
import { calculateDose, convertWeight } from '@/lib/drugDatabase';

interface DosageCalculatorProps {
  drug: Drug;
  preferredWeightUnit: 'kg' | 'lbs';
  onBack: () => void;
}

export default function DosageCalculator({ drug, preferredWeightUnit, onBack }: DosageCalculatorProps) {
  const [patient, setPatient] = useState<Patient>({
    weight: 0,
    weightUnit: preferredWeightUnit,
    age: undefined,
    ageUnit: 'years'
  });

  const [showCalculation, setShowCalculation] = useState(false);

  const calculation = useMemo<DoseCalculation | null>(() => {
    if (patient.weight <= 0) return null;
    return calculateDose(drug, patient);
  }, [drug, patient]);

  const isValidInput = patient.weight > 0 && patient.weight < 200;

  const handleWeightChange = (value: string) => {
    const weight = parseFloat(value) || 0;
    setPatient(prev => ({ ...prev, weight }));
  };

  const handleWeightUnitChange = (unit: 'kg' | 'lbs') => {
    setPatient(prev => ({
      ...prev,
      weightUnit: unit,
      weight: prev.weight > 0 ? convertWeight(prev.weight, prev.weightUnit, unit) : prev.weight
    }));
  };

  const handleCalculate = () => {
    if (isValidInput && calculation) {
      setShowCalculation(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{drug.name}</h1>
          <p className="text-muted-foreground">{drug.class} • {drug.system.replace(/_/g, ' ')}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Patient Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Patient Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="weight">Patient Weight</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={patient.weight || ''}
                  onChange={(e) => handleWeightChange(e.target.value)}
                  min="0"
                  max="200"
                  step="0.1"
                />
                <Select value={patient.weightUnit} onValueChange={handleWeightUnitChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="lbs">lbs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Patient Age (Optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={patient.age || ''}
                  onChange={(e) => setPatient(prev => ({ 
                    ...prev, 
                    age: parseFloat(e.target.value) || undefined 
                  }))}
                  min="0"
                  max="18"
                />
                <Select 
                  value={patient.ageUnit} 
                  onValueChange={(value: 'days' | 'months' | 'years') => 
                    setPatient(prev => ({ ...prev, ageUnit: value }))
                  }
                >
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="days">days</SelectItem>
                    <SelectItem value="months">months</SelectItem>
                    <SelectItem value="years">years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={handleCalculate} 
              disabled={!isValidInput}
              className="w-full"
            >
              Calculate Dose
            </Button>
          </CardContent>
        </Card>

        {/* Drug Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Drug Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="font-medium">Indication</Label>
                <p className="text-muted-foreground">{drug.indication}</p>
              </div>
              <div>
                <Label className="font-medium">Route</Label>
                <p className="text-muted-foreground">{drug.route}</p>
              </div>
              <div>
                <Label className="font-medium">Form</Label>
                <p className="text-muted-foreground">{drug.dosageForm}</p>
              </div>
              <div>
                <Label className="font-medium">Frequency</Label>
                <p className="text-muted-foreground">{drug.frequency}</p>
              </div>
            </div>

            <Separator />

            <div>
              <Label className="font-medium">Pediatric Dose</Label>
              <p className="text-sm text-muted-foreground mt-1">{drug.pediatricDose}</p>
            </div>

            <div>
              <Label className="font-medium">Maximum Dose</Label>
              <p className="text-sm text-muted-foreground mt-1">
                {drug.maxDose || 'Not specified'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculation Results */}
      {showCalculation && calculation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Calculated Dose
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">
                  {calculation.calculatedDose.toFixed(2)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {calculation.doseUnit} per dose
                </div>
              </div>
              
              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <div className="text-lg font-semibold">
                  {calculation.frequency}
                </div>
                <div className="text-sm text-muted-foreground">
                  Frequency
                </div>
              </div>
              
              <div className="text-center p-4 bg-muted/5 rounded-lg">
                <div className="text-lg font-semibold">
                  {calculation.patientWeight} {calculation.patientWeightUnit}
                </div>
                <div className="text-sm text-muted-foreground">
                  Patient Weight
                </div>
              </div>
            </div>

            {/* Warnings and Alerts */}
            {calculation.warnings.length > 0 && (
              <div className="space-y-2">
                {calculation.maxDoseExceeded && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Maximum dose exceeded!</strong> The calculated dose exceeds the recommended maximum: {calculation.maxDose}
                    </AlertDescription>
                  </Alert>
                )}
                
                {calculation.warnings.map((warning, index) => (
                  <Alert key={index} variant={warning.includes('Contraindications') ? 'destructive' : 'default'}>
                    <Info className="h-4 w-4" />
                    <AlertDescription>{warning}</AlertDescription>
                  </Alert>
                ))}
              </div>
            )}

            {/* Safety Information */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Safety Information</h4>
              <div className="grid gap-2 text-sm">
                {drug.contraindications && drug.contraindications !== 'None' && (
                  <div>
                    <Label className="font-medium text-red-600">Contraindications:</Label>
                    <p className="text-muted-foreground">{drug.contraindications}</p>
                  </div>
                )}
                <div>
                  <Label className="font-medium text-yellow-600">Side Effects:</Label>
                  <p className="text-muted-foreground">{drug.majorSideEffects}</p>
                </div>
                {drug.specialNotes && (
                  <div>
                    <Label className="font-medium text-blue-600">Special Notes:</Label>
                    <p className="text-muted-foreground">{drug.specialNotes}</p>
                  </div>
                )}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Disclaimer:</strong> This calculator is for reference only. Always verify dosages with current prescribing information and use clinical judgment. Consult with a physician or pharmacist for dosing decisions.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}