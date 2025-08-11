import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cultureLabels } from '@/lib/trialsConfig';
import { getZoneBySite } from '@/lib/locations';

interface TrialHeaderProps {
  cultureId: string;
  year: number;
  locationId: string;
  predecessor?: string;
  background?: string;
  technology?: string;
}

export const TrialHeader = ({ cultureId, year, locationId, predecessor, background, technology }: TrialHeaderProps) => {
  const culture = cultureLabels[cultureId] ?? cultureId;
  const zone = getZoneBySite(locationId);
  return (
    <Card>
      <CardContent className="py-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">Культура: {culture}</Badge>
        <Badge variant="secondary">Год: {year}</Badge>
        <Badge variant="secondary">Сортоучасток: {locationId}</Badge>
        <Badge variant="secondary">Зона: {zone || '—'}</Badge>
        <Badge variant="secondary">Предшественник: {predecessor || '—'}</Badge>
        <Badge variant="secondary">Фон: {background || '—'}</Badge>
        <Badge variant="secondary">Технология: {technology || '—'}</Badge>
      </CardContent>
    </Card>
  );
};
