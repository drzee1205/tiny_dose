import { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drug, MEDICAL_SYSTEMS } from '@/types/drug';
import { searchDrugs, filterDrugsBySystem } from '@/lib/drugDatabase';

interface DrugSearchProps {
  drugs: Drug[];
  favorites: string[];
  recentDrugs: string[];
  onDrugSelect: (drug: Drug) => void;
  onToggleFavorite: (drugId: string) => void;
}

export default function DrugSearch({ 
  drugs, 
  favorites, 
  recentDrugs, 
  onDrugSelect, 
  onToggleFavorite 
}: DrugSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSystem, setSelectedSystem] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDrugs = useMemo(() => {
    let result = drugs;
    
    // Apply system filter
    result = filterDrugsBySystem(selectedSystem, result);
    
    // Apply search query
    result = searchDrugs(searchQuery, result);
    
    return result; // Show all results - no limit
  }, [drugs, searchQuery, selectedSystem]);

  const favoriteDrugs = useMemo(() => 
    drugs.filter(drug => favorites.includes(drug.id)), 
    [drugs, favorites]
  );

  const recentlyViewedDrugs = useMemo(() => 
    recentDrugs.map(id => drugs.find(drug => drug.id === id)).filter(Boolean) as Drug[], 
    [drugs, recentDrugs]
  );

  const handleDrugClick = (drug: Drug) => {
    onDrugSelect(drug);
  };

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drugs, indications, or systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-1" />
            Filters
          </Button>
          
          {showFilters && (
            <Select value={selectedSystem} onValueChange={setSelectedSystem}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Systems" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Systems</SelectItem>
                {MEDICAL_SYSTEMS.map(system => (
                  <SelectItem key={system} value={system}>
                    {system.replace(/_/g, ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="search">
            <Search className="h-4 w-4 mr-1" />
            Search ({filteredDrugs.length})
          </TabsTrigger>
          <TabsTrigger value="favorites">
            <Star className="h-4 w-4 mr-1" />
            Favorites ({favoriteDrugs.length})
          </TabsTrigger>
          <TabsTrigger value="recent">
            <Clock className="h-4 w-4 mr-1" />
            Recent ({recentlyViewedDrugs.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-4">
          <DrugList 
            drugs={filteredDrugs} 
            favorites={favorites}
            onDrugSelect={handleDrugClick}
            onToggleFavorite={onToggleFavorite}
            emptyMessage={searchQuery || selectedSystem !== 'all' ? 'No drugs found matching your search' : 'Start typing to search for drugs'}
          />
        </TabsContent>

        <TabsContent value="favorites" className="mt-4">
          <DrugList 
            drugs={favoriteDrugs} 
            favorites={favorites}
            onDrugSelect={handleDrugClick}
            onToggleFavorite={onToggleFavorite}
            emptyMessage="No favorite drugs yet. Star drugs to add them to your favorites."
          />
        </TabsContent>

        <TabsContent value="recent" className="mt-4">
          <DrugList 
            drugs={recentlyViewedDrugs} 
            favorites={favorites}
            onDrugSelect={handleDrugClick}
            onToggleFavorite={onToggleFavorite}
            emptyMessage="No recently viewed drugs."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DrugListProps {
  drugs: Drug[];
  favorites: string[];
  onDrugSelect: (drug: Drug) => void;
  onToggleFavorite: (drugId: string) => void;
  emptyMessage: string;
}

function DrugList({ drugs, favorites, onDrugSelect, onToggleFavorite, emptyMessage }: DrugListProps) {
  if (drugs.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8 text-muted-foreground">
          {emptyMessage}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {drugs.map(drug => (
        <Card key={drug.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4" onClick={() => onDrugSelect(drug)}>
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{drug.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {drug.system.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{drug.class}</p>
                <p className="text-sm">{drug.indication}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Route: {drug.route}</span>
                  <span>Form: {drug.dosageForm}</span>
                  <span>Frequency: {drug.frequency}</span>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(drug.id);
                }}
              >
                <Star 
                  className={`h-4 w-4 ${
                    favorites.includes(drug.id) 
                      ? 'fill-yellow-400 text-yellow-400' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}