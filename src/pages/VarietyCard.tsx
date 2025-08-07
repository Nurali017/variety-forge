import { VarietyHeader } from "@/components/variety/VarietyHeader";
import { VarietyInfo } from "@/components/variety/VarietyInfo";
import { VarietyDocuments } from "@/components/variety/VarietyDocuments";
import { VarietyResults } from "@/components/variety/VarietyResults";

// Sample data - in real app would come from API
const varietyData = {
  name: "Пшеница озимая 'Скипетр'",
  culture: "Зерновые и крупяные",
  status: 'testing' as const,
  info: {
    applicant: "ТОО 'Казахский научно-исследовательский институт земледелия'",
    inn: "123456789012",
    maturityGroup: "D5 - Среднеспелая группа",
    submissionDate: "15.03.2023",
    targetRegions: ["Акмолинская область", "Костанайская область", "Северо-Казахстанская область"]
  },
  documents: [
    { id: "1", name: "Анкета селекционного достижения.pdf", type: 'pdf' as const, size: "2.3 МБ" },
    { id: "2", name: "Техническое описание сорта.docx", type: 'docx' as const, size: "1.1 МБ" },
    { id: "3", name: "Протокол биохимических показателей.pdf", type: 'pdf' as const, size: "856 КБ" },
    { id: "4", name: "Фотографии растений.pdf", type: 'pdf' as const, size: "4.2 МБ" }
  ],
  results: [
    {
      region: "Акмолинская область",
      years: [
        {
          year: 2024,
          summary: "Превышение над стандартом: +5.2%",
          results: [
            { indicator: "Урожайность, ц/га", varietyValue: "28.5", standardValue: "27.1", deviation: "+1.4", isPositive: true },
            { indicator: "Масса 1000 зёрен, г", varietyValue: "42.3", standardValue: "40.8", deviation: "+1.5", isPositive: true },
            { indicator: "Устойчивость к полеганию, балл", varietyValue: "8.2", standardValue: "7.5", deviation: "+0.7", isPositive: true },
            { indicator: "Вегетационный период, дни", varietyValue: "285", standardValue: "290", deviation: "-5", isPositive: true },
            { indicator: "Белок, %", varietyValue: "14.2", standardValue: "13.8", deviation: "+0.4", isPositive: true },
            { indicator: "Клейковина, %", varietyValue: "28.5", standardValue: "27.2", deviation: "+1.3", isPositive: true }
          ]
        },
        {
          year: 2023,
          summary: "Превышение над стандартом: +3.8%",
          results: [
            { indicator: "Урожайность, ц/га", varietyValue: "26.8", standardValue: "25.9", deviation: "+0.9", isPositive: true },
            { indicator: "Масса 1000 зёрен, г", varietyValue: "41.2", standardValue: "40.1", deviation: "+1.1", isPositive: true },
            { indicator: "Устойчивость к полеганию, балл", varietyValue: "7.9", standardValue: "7.3", deviation: "+0.6", isPositive: true },
            { indicator: "Вегетационный период, дни", varietyValue: "288", standardValue: "292", deviation: "-4", isPositive: true },
            { indicator: "Белок, %", varietyValue: "13.9", standardValue: "13.6", deviation: "+0.3", isPositive: true },
            { indicator: "Клейковина, %", varietyValue: "27.8", standardValue: "26.9", deviation: "+0.9", isPositive: true }
          ]
        }
      ]
    },
    {
      region: "Костанайская область",
      years: [
        {
          year: 2024,
          summary: "Превышение над стандартом: +7.1%",
          results: [
            { indicator: "Урожайность, ц/га", varietyValue: "31.2", standardValue: "29.1", deviation: "+2.1", isPositive: true },
            { indicator: "Масса 1000 зёрен, г", varietyValue: "43.8", standardValue: "41.5", deviation: "+2.3", isPositive: true },
            { indicator: "Устойчивость к полеганию, балл", varietyValue: "8.5", standardValue: "7.8", deviation: "+0.7", isPositive: true },
            { indicator: "Вегетационный период, дни", varietyValue: "282", standardValue: "287", deviation: "-5", isPositive: true },
            { indicator: "Белок, %", varietyValue: "14.8", standardValue: "14.1", deviation: "+0.7", isPositive: true },
            { indicator: "Клейковина, %", varietyValue: "29.3", standardValue: "27.8", deviation: "+1.5", isPositive: true }
          ]
        },
        {
          year: 2023,
          summary: "Превышение над стандартом: +4.2%",
          results: [
            { indicator: "Урожайность, ц/га", varietyValue: "29.5", standardValue: "28.3", deviation: "+1.2", isPositive: true },
            { indicator: "Масса 1000 зёрен, г", varietyValue: "42.1", standardValue: "40.8", deviation: "+1.3", isPositive: true },
            { indicator: "Устойчивость к полеганию, балл", varietyValue: "8.1", standardValue: "7.6", deviation: "+0.5", isPositive: true },
            { indicator: "Вегетационный период, дни", varietyValue: "284", standardValue: "289", deviation: "-5", isPositive: true },
            { indicator: "Белок, %", varietyValue: "14.3", standardValue: "13.9", deviation: "+0.4", isPositive: true },
            { indicator: "Клейковина, %", varietyValue: "28.7", standardValue: "27.4", deviation: "+1.3", isPositive: true }
          ]
        }
      ]
    }
  ]
};

const VarietyCard = () => {
  return (
    <div className="min-h-screen bg-background">
      <VarietyHeader 
        name={varietyData.name}
        culture={varietyData.culture}
        status={varietyData.status}
      />
      
      <div className="container mx-auto py-6 space-y-6">
        <VarietyInfo data={varietyData.info} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <VarietyDocuments documents={varietyData.documents} />
          </div>
          <div className="lg:col-span-2">
            <VarietyResults resultsData={varietyData.results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarietyCard;