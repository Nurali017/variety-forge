import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cultureLabels } from '@/lib/trialsConfig';

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
  return (
    <Card>
      <CardContent className="py-4 flex flex-wrap items-center gap-3">
        <Badge variant="secondary">Культура: {culture}</Badge>
        <Badge variant="secondary">Год: {year}</Badge>
        <Badge variant="secondary">Сортоучасток: {locationId}</Badge>
        {predecessor ? <Badge variant="secondary">Предшественник: {predecessor}</Badge> : null}
        {background ? <Badge variant="secondary">Фон: {background}</Badge> : null}
        {technology ? <Badge variant="secondary">Технология: {technology}</Badge> : null}
      </CardContent>
    </Card>
  );
};
