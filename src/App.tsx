import { useState, useEffect } from 'react';
import { Calculator, Menu, Settings, Moon, Sun, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import DrugSearch from '@/components/DrugSearch';
import DosageCalculator from '@/components/DosageCalculator';
import SplashScreen from '@/components/SplashScreen';
import { useDrugDatabase } from '@/hooks/useDrugDatabase';
import { useSettings } from '@/hooks/useSettings';
import { Drug } from '@/types/drug';

type AppState = 'search' | 'calculator' | 'settings';

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('search');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const { drugs, loading, error } = useDrugDatabase();
  const { settings, updateSettings, toggleFavorite, addToRecent, toggleDarkMode, isLoaded } = useSettings();

  // Apply dark mode class to document
  useEffect(() => {
    if (isLoaded) {
      document.documentElement.classList.toggle('dark', settings.darkMode);
    }
  }, [settings.darkMode, isLoaded]);

  const handleDrugSelect = (drug: Drug) => {
    setSelectedDrug(drug);
    addToRecent(drug.id);
    setCurrentState('calculator');
  };

  const handleBackToSearch = () => {
    setCurrentState('search');
    setSelectedDrug(null);
  };

  const handleShowSettings = () => {
    setCurrentState('settings');
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load drug database: {error}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold">TinyDose</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Precision care in every drop</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentState('search')}
              className={currentState === 'search' ? 'bg-muted' : ''}
            >
              <Calculator className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Search</span>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShowSettings}
              className={currentState === 'settings' ? 'bg-muted' : ''}
            >
              <Settings className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Settings</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
            >
              {settings.darkMode ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {currentState === 'search' && (
          <DrugSearch
            drugs={drugs}
            favorites={settings.favorites}
            recentDrugs={settings.recentDrugs}
            onDrugSelect={handleDrugSelect}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {currentState === 'calculator' && selectedDrug && (
          <DosageCalculator
            drug={selectedDrug}
            preferredWeightUnit={settings.preferredWeightUnit}
            onBack={handleBackToSearch}
          />
        )}

        {currentState === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Settings</h2>
              <p className="text-muted-foreground">Customize your app preferences</p>
            </div>

            <div className="grid gap-6">
              {/* Weight Unit Preference */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Weight Unit Preference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="weight-unit">Preferred weight unit for calculations</Label>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="kg" className={settings.preferredWeightUnit === 'kg' ? 'font-semibold' : ''}>
                        kg
                      </Label>
                      <Switch
                        id="weight-unit"
                        checked={settings.preferredWeightUnit === 'lbs'}
                        onCheckedChange={(checked) => 
                          updateSettings({ preferredWeightUnit: checked ? 'lbs' : 'kg' })
                        }
                      />
                      <Label htmlFor="lbs" className={settings.preferredWeightUnit === 'lbs' ? 'font-semibold' : ''}>
                        lbs
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Dark Mode */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Appearance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="dark-mode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                    </div>
                    <Switch
                      id="dark-mode"
                      checked={settings.darkMode}
                      onCheckedChange={toggleDarkMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* App Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">App Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-primary/5 rounded-lg">
                      <div className="text-2xl font-bold text-primary">{drugs.length}</div>
                      <div className="text-sm text-muted-foreground">Total Drugs</div>
                    </div>
                    <div className="text-center p-3 bg-secondary/5 rounded-lg">
                      <div className="text-2xl font-bold text-secondary-foreground">{settings.favorites.length}</div>
                      <div className="text-sm text-muted-foreground">Favorites</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>TinyDose</strong> is a professional tool for healthcare providers
                      to calculate safe and accurate drug dosages for pediatric patients.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Precision care in every drop - This app works offline and can be installed on your device for quick access.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">PWA</Badge>
                      <Badge variant="outline">Offline Ready</Badge>
                      <Badge variant="outline">Mobile Friendly</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Alert>
                <Calculator className="h-4 w-4" />
                <AlertDescription>
                  <strong>Medical Disclaimer:</strong> This calculator is for reference purposes only. 
                  Always verify dosages with current prescribing information and use clinical judgment. 
                  Consult with a physician or pharmacist for all dosing decisions.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
