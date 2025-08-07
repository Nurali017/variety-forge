import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FormData {
  // Урожайность
  plot1Yield: string;
  plot2Yield: string;
  plot3Yield: string;
  plot4Yield: string;
  averageYield: string;
  standardDeviation: string;
  variationCoefficient: string;
  nsr: string;
  
  // Общие показатели
  thousandGrainWeight: string;
  vegetationPeriod: string;
  plantHeight: string;
  
  // Устойчивость
  lodgingResistance: string;
  droughtResistance: string;
  diseaseResistance: string;
  pestResistance: string;
  
  // Качество (динамические поля)
  proteinContent?: string;
  glutenContent?: string;
  glassiness?: string;
  breadVolume?: string;
  starchContent?: string;
  storageQuality?: string;
  tastingScore?: string;
  fatContent?: string;
  
  // Агротехника
  predecessor: string;
  agronomicBackground: string;
  technology: string;
  harvestDate: Date | undefined;
}

interface FormF008Props {
  culture: string;
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  errors: Record<string, string>;
}

export const FormF008 = ({ culture, formData, onFormDataChange, errors }: FormF008Props) => {
  const [calculatedValues, setCalculatedValues] = useState({
    averageYield: "",
    standardDeviation: "",
    variationCoefficient: "",
    nsr: ""
  });

  // Calculate average and statistics when plot yields change
  useEffect(() => {
    const yields = [
      parseFloat(formData.plot1Yield) || 0,
      parseFloat(formData.plot2Yield) || 0,
      parseFloat(formData.plot3Yield) || 0,
      parseFloat(formData.plot4Yield) || 0,
    ].filter(y => y > 0);

    if (yields.length > 0) {
      const average = yields.reduce((sum, y) => sum + y, 0) / yields.length;
      const variance = yields.reduce((sum, y) => sum + Math.pow(y - average, 2), 0) / yields.length;
      const stdDev = Math.sqrt(variance);
      const cv = (stdDev / average) * 100;
      const nsr = stdDev * 2.77; // Simplified NSR calculation

      const newCalculated = {
        averageYield: average.toFixed(2),
        standardDeviation: stdDev.toFixed(2),
        variationCoefficient: cv.toFixed(2),
        nsr: nsr.toFixed(2)
      };

      setCalculatedValues(newCalculated);
      onFormDataChange({
        ...formData,
        ...newCalculated
      });
    }
  }, [formData.plot1Yield, formData.plot2Yield, formData.plot3Yield, formData.plot4Yield]);

  const updateFormData = (field: keyof FormData, value: any) => {
    onFormDataChange({
      ...formData,
      [field]: value
    });
  };

  const renderQualityFields = () => {
    switch (culture) {
      case "wheat":
      case "barley":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="proteinContent">Содержание белка, % *</Label>
                <Input
                  id="proteinContent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={formData.proteinContent || ""}
                  onChange={(e) => updateFormData("proteinContent", e.target.value)}
                  className={errors.proteinContent ? "border-destructive" : ""}
                />
                {errors.proteinContent && (
                  <p className="text-sm text-destructive">{errors.proteinContent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="glutenContent">Клейковина, % *</Label>
                <Input
                  id="glutenContent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="50"
                  value={formData.glutenContent || ""}
                  onChange={(e) => updateFormData("glutenContent", e.target.value)}
                  className={errors.glutenContent ? "border-destructive" : ""}
                />
                {errors.glutenContent && (
                  <p className="text-sm text-destructive">{errors.glutenContent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="glassiness">Стекловидность, %</Label>
                <Input
                  id="glassiness"
                  type="number"
                  step="1"
                  min="0"
                  max="100"
                  value={formData.glassiness || ""}
                  onChange={(e) => updateFormData("glassiness", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="breadVolume">Объём хлеба, см³</Label>
                <Input
                  id="breadVolume"
                  type="number"
                  step="10"
                  min="0"
                  value={formData.breadVolume || ""}
                  onChange={(e) => updateFormData("breadVolume", e.target.value)}
                />
              </div>
            </div>
          </>
        );

      case "potato":
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="starchContent">Содержание крахмала, % *</Label>
                <Input
                  id="starchContent"
                  type="number"
                  step="0.1"
                  min="0"
                  max="30"
                  value={formData.starchContent || ""}
                  onChange={(e) => updateFormData("starchContent", e.target.value)}
                  className={errors.starchContent ? "border-destructive" : ""}
                />
                {errors.starchContent && (
                  <p className="text-sm text-destructive">{errors.starchContent}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageQuality">Лёжкость, балл *</Label>
                <Select
                  value={formData.storageQuality || ""}
                  onValueChange={(value) => updateFormData("storageQuality", value)}
                >
                  <SelectTrigger className={errors.storageQuality ? "border-destructive" : ""}>
                    <SelectValue placeholder="Выберите балл" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.storageQuality && (
                  <p className="text-sm text-destructive">{errors.storageQuality}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tastingScore">Дегустационная оценка, балл</Label>
                <Select
                  value={formData.tastingScore || ""}
                  onValueChange={(value) => updateFormData("tastingScore", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите балл" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                      <SelectItem key={score} value={score.toString()}>
                        {score}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );

      case "sunflower":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="fatContent">Содержание жира, % *</Label>
              <Input
                id="fatContent"
                type="number"
                step="0.1"
                min="0"
                max="60"
                value={formData.fatContent || ""}
                onChange={(e) => updateFormData("fatContent", e.target.value)}
                className={errors.fatContent ? "border-destructive" : ""}
              />
              {errors.fatContent && (
                <p className="text-sm text-destructive">{errors.fatContent}</p>
              )}
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Accordion type="multiple" className="w-full" defaultValue={["yield", "general", "resistance", "quality", "agronomy"]}>
          <AccordionItem value="yield">
            <AccordionTrigger className="text-lg font-semibold">
              Показатели урожайности
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plot1Yield">Делянка 1, ц/га *</Label>
                  <Input
                    id="plot1Yield"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.plot1Yield}
                    onChange={(e) => updateFormData("plot1Yield", e.target.value)}
                    className={errors.plot1Yield ? "border-destructive" : ""}
                  />
                  {errors.plot1Yield && (
                    <p className="text-sm text-destructive">{errors.plot1Yield}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot2Yield">Делянка 2, ц/га *</Label>
                  <Input
                    id="plot2Yield"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.plot2Yield}
                    onChange={(e) => updateFormData("plot2Yield", e.target.value)}
                    className={errors.plot2Yield ? "border-destructive" : ""}
                  />
                  {errors.plot2Yield && (
                    <p className="text-sm text-destructive">{errors.plot2Yield}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot3Yield">Делянка 3, ц/га *</Label>
                  <Input
                    id="plot3Yield"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.plot3Yield}
                    onChange={(e) => updateFormData("plot3Yield", e.target.value)}
                    className={errors.plot3Yield ? "border-destructive" : ""}
                  />
                  {errors.plot3Yield && (
                    <p className="text-sm text-destructive">{errors.plot3Yield}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plot4Yield">Делянка 4, ц/га *</Label>
                  <Input
                    id="plot4Yield"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.plot4Yield}
                    onChange={(e) => updateFormData("plot4Yield", e.target.value)}
                    className={errors.plot4Yield ? "border-destructive" : ""}
                  />
                  {errors.plot4Yield && (
                    <p className="text-sm text-destructive">{errors.plot4Yield}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="averageYield">Среднее, ц/га</Label>
                  <Input
                    id="averageYield"
                    value={calculatedValues.averageYield}
                    readOnly
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="standardDeviation">СО</Label>
                  <Input
                    id="standardDeviation"
                    value={calculatedValues.standardDeviation}
                    readOnly
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variationCoefficient">CV, %</Label>
                  <Input
                    id="variationCoefficient"
                    value={calculatedValues.variationCoefficient}
                    readOnly
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nsr">НСР</Label>
                  <Input
                    id="nsr"
                    value={calculatedValues.nsr}
                    readOnly
                    className="bg-background"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="general">
            <AccordionTrigger className="text-lg font-semibold">
              Общие показатели
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="thousandGrainWeight">Масса 1000 зёрен/семян/клубней, г *</Label>
                  <Input
                    id="thousandGrainWeight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.thousandGrainWeight}
                    onChange={(e) => updateFormData("thousandGrainWeight", e.target.value)}
                    className={errors.thousandGrainWeight ? "border-destructive" : ""}
                  />
                  {errors.thousandGrainWeight && (
                    <p className="text-sm text-destructive">{errors.thousandGrainWeight}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vegetationPeriod">Вегетационный период, дни *</Label>
                  <Input
                    id="vegetationPeriod"
                    type="number"
                    min="0"
                    max="400"
                    value={formData.vegetationPeriod}
                    onChange={(e) => updateFormData("vegetationPeriod", e.target.value)}
                    className={errors.vegetationPeriod ? "border-destructive" : ""}
                  />
                  {errors.vegetationPeriod && (
                    <p className="text-sm text-destructive">{errors.vegetationPeriod}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="plantHeight">Высота растений, см</Label>
                  <Input
                    id="plantHeight"
                    type="number"
                    step="1"
                    min="0"
                    max="500"
                    value={formData.plantHeight}
                    onChange={(e) => updateFormData("plantHeight", e.target.value)}
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="resistance">
            <AccordionTrigger className="text-lg font-semibold">
              Показатели устойчивости
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lodgingResistance">Устойчивость к полеганию, балл *</Label>
                  <Select
                    value={formData.lodgingResistance}
                    onValueChange={(value) => updateFormData("lodgingResistance", value)}
                  >
                    <SelectTrigger className={errors.lodgingResistance ? "border-destructive" : ""}>
                      <SelectValue placeholder="Выберите балл (1-9)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                        <SelectItem key={score} value={score.toString()}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.lodgingResistance && (
                    <p className="text-sm text-destructive">{errors.lodgingResistance}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="droughtResistance">Устойчивость к засухе, балл</Label>
                  <Select
                    value={formData.droughtResistance}
                    onValueChange={(value) => updateFormData("droughtResistance", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите балл (1-9)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                        <SelectItem key={score} value={score.toString()}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diseaseResistance">Устойчивость к болезням, балл</Label>
                  <Select
                    value={formData.diseaseResistance}
                    onValueChange={(value) => updateFormData("diseaseResistance", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите балл (1-9)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                        <SelectItem key={score} value={score.toString()}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pestResistance">Устойчивость к вредителям, балл</Label>
                  <Select
                    value={formData.pestResistance}
                    onValueChange={(value) => updateFormData("pestResistance", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите балл (1-9)" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((score) => (
                        <SelectItem key={score} value={score.toString()}>
                          {score}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {culture && (
            <AccordionItem value="quality">
              <AccordionTrigger className="text-lg font-semibold">
                Показатели качества
              </AccordionTrigger>
              <AccordionContent className="space-y-4">
                {renderQualityFields()}
              </AccordionContent>
            </AccordionItem>
          )}

          <AccordionItem value="agronomy">
            <AccordionTrigger className="text-lg font-semibold">
              Агротехнический фон
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="predecessor">Предшественник *</Label>
                  <Select
                    value={formData.predecessor}
                    onValueChange={(value) => updateFormData("predecessor", value)}
                  >
                    <SelectTrigger className={errors.predecessor ? "border-destructive" : ""}>
                      <SelectValue placeholder="Выберите предшественник" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fallow">Пар</SelectItem>
                      <SelectItem value="wheat">Пшеница</SelectItem>
                      <SelectItem value="barley">Ячмень</SelectItem>
                      <SelectItem value="legumes">Бобовые</SelectItem>
                      <SelectItem value="sunflower">Подсолнечник</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.predecessor && (
                    <p className="text-sm text-destructive">{errors.predecessor}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agronomicBackground">Агрономический фон</Label>
                  <Select
                    value={formData.agronomicBackground}
                    onValueChange={(value) => updateFormData("agronomicBackground", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите фон" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="natural">Естественный</SelectItem>
                      <SelectItem value="fertilized">Удобренный</SelectItem>
                      <SelectItem value="irrigated">Орошаемый</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="technology">Технология возделывания</Label>
                  <Select
                    value={formData.technology}
                    onValueChange={(value) => updateFormData("technology", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите технологию" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conventional">Обычная</SelectItem>
                      <SelectItem value="minimal">Минимальная</SelectItem>
                      <SelectItem value="no-till">No-till</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Дата уборки</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.harvestDate ? (
                          format(formData.harvestDate, "dd.MM.yyyy", { locale: ru })
                        ) : (
                          <span>Выберите дату</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.harvestDate}
                        onSelect={(date) => updateFormData("harvestDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};