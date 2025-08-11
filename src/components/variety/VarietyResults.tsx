import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ResultsTable } from "./ResultsTable";
import { Link } from "react-router-dom";

interface TestResult {
  indicator: string;
  varietyValue: string;
  standardValue: string;
  deviation: string;
  isPositive?: boolean;
}

interface YearData {
  year: number;
  summary: string;
  results: TestResult[];
}

interface RegionData {
  region: string;
  years: YearData[];
}

interface VarietyResultsProps {
  resultsData: RegionData[];
}

export const VarietyResults = ({ resultsData }: VarietyResultsProps) => {
  const currentYear = new Date().getFullYear();
  const hasData = resultsData && resultsData.length > 0;
  const defaultTab = hasData && resultsData[0]?.region ? resultsData[0].region : undefined;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl font-semibold">Результаты испытаний</CardTitle>
        <Button asChild>
          <Link to="/trials">
            Открыть список сортоопытов
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="text-sm text-muted-foreground">Пока нет данных. Добавьте результаты за {currentYear}.</div>
        ) : (
          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              {resultsData.map((regionData, index) => (
                <TabsTrigger key={`${regionData.region}-${index}`} value={regionData.region}>
                  {regionData.region}
                </TabsTrigger>
              ))}
            </TabsList>
            {resultsData.map((regionData, index) => (
              <TabsContent key={`${regionData.region}-content-${index}`} value={regionData.region}>
                <Accordion type="single" collapsible className="w-full">
                  {(regionData.years || []).map((yearData) => (
                    <AccordionItem key={yearData.year} value={`${regionData.region}-${yearData.year}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-semibold">{yearData.year} год</div>
                          <div className="text-sm text-muted-foreground">{yearData.summary}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ResultsTable 
                          results={yearData.results}
                          year={yearData.year}
                          region={regionData.region}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
};