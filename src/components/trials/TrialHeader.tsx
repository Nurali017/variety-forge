import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cultureLabels } from '@/lib/trialsConfig';

interface TrialHeaderProps {
  cultureId: string;
  year: number;
  locationId: string;
}

export const TrialHeader = ({ cultureId, year, locationId }: TrialHeaderProps) => {
  const culture = cultureLabels[cultureId] ?? cultureId;
  return (
    <Card>
      <CardContent className="py-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">Культура: {culture}</Badge>
        <Badge variant="secondary">Год: {year}</Badge>
        <Badge variant="secondary">Сортоучасток: {locationId}</Badge>
      </CardContent>
    </Card>
  );
};
