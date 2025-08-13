import { useState, useMemo } from 'react';
import { Search, Filter, Star, Clock, SlidersHorizontal, X, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Drug, MEDICAL_SYSTEMS, DrugFilters as DrugFiltersType } from '@/types/drug';
import { searchDrugs, filterDrugs, getUniqueValues, getQuickFilters, sortDrugs, DrugFilters } from '@/lib/drugDatabase';

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
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [filters, setFilters] = useState<DrugFiltersType>({
    system: 'all',
    drugClass: 'all',
    route: 'all',
    dosageForm: 'all',
    frequency: 'all',
    sortBy: 'name'
  });
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<string>>(new Set());

  // Get unique values for filter options
  const uniqueClasses = useMemo(() => getUniqueValues(drugs, 'class'), [drugs]);
  const uniqueRoutes = useMemo(() => getUniqueValues(drugs, 'route'), [drugs]);
  const uniqueDosageForms = useMemo(() => getUniqueValues(drugs, 'dosageForm'), [drugs]);
  const uniqueFrequencies = useMemo(() => getUniqueValues(drugs, 'frequency'), [drugs]);
  const quickFilters = useMemo(() => getQuickFilters(drugs), [drugs]);

  const filteredDrugs = useMemo(() => {
    let result = drugs;
    
    // Apply search query first
    result = searchDrugs(searchQuery, result);
    
    // Apply all filters
    result = filterDrugs(result, filters);
    
    return result;
  }, [drugs, searchQuery, filters]);

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

  const handleQuickFilter = (quickFilter: { label: string; filters: DrugFiltersType }) => {
    const isActive = activeQuickFilters.has(quickFilter.label);
    
    if (isActive) {
      // Remove quick filter
      setActiveQuickFilters(prev => {
        const newSet = new Set(prev);
        newSet.delete(quickFilter.label);
        return newSet;
      });
      // Reset filters to default
      setFilters(prev => ({
        ...prev,
        ...Object.keys(quickFilter.filters).reduce((acc, key) => ({ ...acc, [key]: 'all' }), {})
      }));
    } else {
      // Add quick filter
      setActiveQuickFilters(prev => new Set([...prev, quickFilter.label]));
      setFilters(prev => ({ ...prev, ...quickFilter.filters }));
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setFilters({
      system: 'all',
      drugClass: 'all',
      route: 'all',
      dosageForm: 'all',
      frequency: 'all',
      sortBy: 'name'
    });
    setActiveQuickFilters(new Set());
  };

  const hasActiveFilters = searchQuery || filters.system !== 'all' || filters.drugClass !== 'all' || 
    filters.route !== 'all' || filters.dosageForm !== 'all' || filters.frequency !== 'all' || 
    activeQuickFilters.size > 0;

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search drugs, indications, classes, routes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        
        {/* Quick Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {quickFilters.map((quickFilter) => (
            <Button
              key={quickFilter.label}
              variant={activeQuickFilters.has(quickFilter.label) ? "default" : "outline"}
              size="sm"
              className="h-8 text-xs"
              onClick={() => handleQuickFilter(quickFilter)}
            >
              {quickFilter.label}
            </Button>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4 mr-1" />
              Advanced Filters
            </Button>
            
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Select 
              value={filters.sortBy} 
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value as DrugFiltersType['sortBy'] }))}
            >
              <SelectTrigger className="w-32">
                <ArrowUpDown className="h-4 w-4 mr-1" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="class">Class</SelectItem>
                <SelectItem value="route">Route</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Advanced Filters */}
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Advanced Filters</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Medical System</label>
                  <Select 
                    value={filters.system} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, system: value }))}
                  >
                    <SelectTrigger>
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
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Drug Class</label>
                  <Select 
                    value={filters.drugClass} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, drugClass: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Classes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {uniqueClasses.map(drugClass => (
                        <SelectItem key={drugClass} value={drugClass}>
                          {drugClass}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Route</label>
                  <Select 
                    value={filters.route} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, route: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Routes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Routes</SelectItem>
                      {uniqueRoutes.map(route => (
                        <SelectItem key={route} value={route}>
                          {route}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dosage Form</label>
                  <Select 
                    value={filters.dosageForm} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, dosageForm: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Forms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Forms</SelectItem>
                      {uniqueDosageForms.map(form => (
                        <SelectItem key={form} value={form}>
                          {form}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Frequency</label>
                  <Select 
                    value={filters.frequency} 
                    onValueChange={(value) => setFilters(prev => ({ ...prev, frequency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Frequencies" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Frequencies</SelectItem>
                      {uniqueFrequencies.map(frequency => (
                        <SelectItem key={frequency} value={frequency}>
                          {frequency}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>
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
            emptyMessage={hasActiveFilters ? 'No drugs found matching your criteria' : 'Start typing to search for drugs'}
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