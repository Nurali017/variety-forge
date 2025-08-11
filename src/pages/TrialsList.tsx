import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainToolbar } from '@/components/varieties/MainToolbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTrials } from '@/lib/trialsStore';
import { cultureLabels } from '@/lib/trialsConfig';

const TrialsList = () => {
  const trials = useMemo(() => getTrials(), []);

  // SEO title
  document.title = 'Сортоопыты — список';

  return (
    <div className="min-h-screen bg-background">
      <MainToolbar />
      <div className="container mx-auto py-6 space-y-6">
        <header className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Список сортоопытов</h1>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/trials/new">+ Создать сортоопыт</Link>
            </Button>
          </div>
        </header>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Год</TableHead>
                    <TableHead>Культура</TableHead>
                    <TableHead>Сортоучасток</TableHead>
                    <TableHead>Участников</TableHead>
                    <TableHead>Статус</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trials.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-muted-foreground">Нет сортоопытов. Создайте первый.</TableCell>
                    </TableRow>
                  ) : (
                    trials.map(t => (
                      <TableRow key={t.id}>
                        <TableCell>{t.year}</TableCell>
                        <TableCell>{cultureLabels[t.cultureId] ?? t.cultureId}</TableCell>
                        <TableCell>{t.locationId}</TableCell>
                        <TableCell>{t.participants.length}</TableCell>
                        <TableCell>{t.status === 'completed' ? 'Завершен' : 'Черновик'}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link to={`/trials/${t.id}/entry`}>Открыть</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TrialsList;
