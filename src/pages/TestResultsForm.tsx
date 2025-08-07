import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormF008Header } from "@/components/forms/FormF008Header";
import { FormF008 } from "@/components/forms/FormF008";
import { FormActions } from "@/components/forms/FormActions";
import { useToast } from "@/hooks/use-toast";

interface FormContext {
  year: string;
  region: string;
  testSite: string;
  culture: string;
  variety: string;
}

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

const TestResultsForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const [context, setContext] = useState<FormContext>({
    year: "2024",
    region: "",
    testSite: "",
    culture: "",
    variety: "",
  });

  const [formData, setFormData] = useState<FormData>({
    plot1Yield: "",
    plot2Yield: "",
    plot3Yield: "",
    plot4Yield: "",
    averageYield: "",
    standardDeviation: "",
    variationCoefficient: "",
    nsr: "",
    thousandGrainWeight: "",
    vegetationPeriod: "",
    plantHeight: "",
    lodgingResistance: "",
    droughtResistance: "",
    diseaseResistance: "",
    pestResistance: "",
    predecessor: "",
    agronomicBackground: "",
    technology: "",
    harvestDate: undefined,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate context
    if (!context.year) newErrors.year = "Год обязателен для заполнения";
    if (!context.region) newErrors.region = "Регион обязателен для заполнения";
    if (!context.testSite) newErrors.testSite = "Сортоучасток обязателен для заполнения";
    if (!context.culture) newErrors.culture = "Культура обязательна для заполнения";
    if (!context.variety) newErrors.variety = "Сорт обязателен для заполнения";

    // Validate yield data
    if (!formData.plot1Yield) newErrors.plot1Yield = "Урожай делянки 1 обязателен";
    if (!formData.plot2Yield) newErrors.plot2Yield = "Урожай делянки 2 обязателен";
    if (!formData.plot3Yield) newErrors.plot3Yield = "Урожай делянки 3 обязателен";
    if (!formData.plot4Yield) newErrors.plot4Yield = "Урожай делянки 4 обязателен";

    // Validate general indicators
    if (!formData.thousandGrainWeight) newErrors.thousandGrainWeight = "Масса 1000 зёрен обязательна";
    if (!formData.vegetationPeriod) newErrors.vegetationPeriod = "Вегетационный период обязателен";
    if (!formData.lodgingResistance) newErrors.lodgingResistance = "Устойчивость к полеганию обязательна";
    if (!formData.predecessor) newErrors.predecessor = "Предшественник обязателен";

    // Validate culture-specific fields
    if (context.culture === "wheat" || context.culture === "barley") {
      if (!formData.proteinContent) newErrors.proteinContent = "Содержание белка обязательно";
      if (!formData.glutenContent) newErrors.glutenContent = "Клейковина обязательна";
    } else if (context.culture === "potato") {
      if (!formData.starchContent) newErrors.starchContent = "Содержание крахмала обязательно";
      if (!formData.storageQuality) newErrors.storageQuality = "Лёжкость обязательна";
    } else if (context.culture === "sunflower") {
      if (!formData.fatContent) newErrors.fatContent = "Содержание жира обязательно";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContextChange = (field: keyof FormContext, value: string) => {
    setContext(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormDataChange = (data: FormData) => {
    setFormData(data);
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast({
        title: "Ошибка валидации",
        description: "Пожалуйста, заполните все обязательные поля",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Результаты сохранены",
        description: "Данные испытания успешно сохранены",
      });
      
      navigate(-1);
    } catch (error) {
      toast({
        title: "Ошибка сохранения",
        description: "Не удалось сохранить данные. Попробуйте еще раз.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const isFormValid = Object.keys(errors).length === 0 && validateForm();

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="container mx-auto py-6 space-y-6">
        <FormF008Header 
          context={context}
          onContextChange={handleContextChange}
        />
        
        <FormF008
          culture={context.culture}
          formData={formData}
          onFormDataChange={handleFormDataChange}
          errors={errors}
        />
      </div>

      <FormActions
        onSave={handleSave}
        onCancel={handleCancel}
        isValid={isFormValid}
        isSaving={isSaving}
      />
    </div>
  );
};

export default TestResultsForm;