import { Stethoscope } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-primary/10 to-primary/5 flex items-center justify-center z-50">
      <div className="text-center space-y-6 animate-pulse">
        <div className="flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mx-auto">
          <Stethoscope className="h-8 w-8 text-primary-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-primary">TinyDose</h1>
          <p className="text-muted-foreground">Precision care in every drop</p>
          <div className="w-32 h-1 bg-primary/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-primary rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}