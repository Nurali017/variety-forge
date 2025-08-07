import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ResultsTable } from "./ResultsTable";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Результаты испытаний</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={resultsData[0]?.region} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {resultsData.map((regionData) => (
              <TabsTrigger key={regionData.region} value={regionData.region}>
                {regionData.region}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {resultsData.map((regionData) => (
            <TabsContent key={regionData.region} value={regionData.region}>
              <Accordion type="single" collapsible className="w-full">
                {regionData.years.map((yearData) => (
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
      </CardContent>
    </Card>
  );
};