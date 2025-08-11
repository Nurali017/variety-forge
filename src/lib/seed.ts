// Starter seed data for varieties and trials. Pure data objects to initialize localStorage when empty.

// Note: Keep shapes compatible with VarietyRecord (varietiesStore) and Trial/TrialResult (trialsStore).

export const seedVarieties = [
  {
    id: 'var-std',
    name: 'Астана Стандарт',
    cultureCode: 'wheat',
    cultureLabel: 'Пшеница',
    cultureGroup: 'Зерновые и крупяные',
    maturityGroup: 'D1 — среднеранний',
    applicant: "ТОО 'НПЦ зернового хозяйства им. А.И. Бараева'",
    inn: '123456789012',
    submissionDate: '15.04.2024',
    targetRegions: ['Костанайская область', 'Северо-Казахстанская область'],
    documents: [
      { id: 'doc-s-1', name: 'Анкета селекционного достижения.pdf', type: 'pdf', size: '1.2 MB' },
    ],
    status: 'testing',
    results: [
      {
        region: 'Костанайская область',
        years: [
          {
            year: 2024,
            summary: 'Превышение над стандартом: +0.0%',
            results: [
              {
                indicator: 'Урожайность, ц/га',
                varietyValue: '31.25',
                standardValue: '31.25',
                deviation: '+0.00',
                isPositive: true,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'var-001',
    name: 'Лютесценс 32',
    cultureCode: 'wheat',
    cultureLabel: 'Пшеница',
    cultureGroup: 'Зерновые и крупяные',
    maturityGroup: 'D1 — среднеранний',
    applicant: "ТОО 'НПЦ зернового хозяйства им. А.И. Бараева'",
    inn: '123456789012',
    submissionDate: '15.05.2024',
    targetRegions: ['Костанайская область', 'Северо-Казахстанская область'],
    documents: [
      { id: 'doc-1', name: 'Анкета селекционного достижения.pdf', type: 'pdf', size: '1.0 MB' },
      { id: 'doc-2', name: 'Описание сорта.docx', type: 'docx', size: '240 KB' },
    ],
    status: 'testing',
    results: [
      {
        region: 'Костанайская область',
        years: [
          {
            year: 2024,
            summary: 'Превышение над стандартом: +5.2%',
            results: [
              { indicator: 'Урожайность, ц/га', varietyValue: '32.9', standardValue: '31.2', deviation: '+1.7', isPositive: true },
              { indicator: 'Масса 1000 зёрен, г', varietyValue: '41.5', standardValue: '40.1', deviation: '+1.4', isPositive: true },
            ],
          },
        ],
      },
    ],
  },
] as const;

export const seedTrials = [
  {
    id: 'trial-001',
    year: 2024,
    cultureId: 'wheat',
    locationId: 'Костанайская область',
    participants: [
      {
        id: 'p-std-001',
        trialId: 'trial-001',
        varietyId: 'var-std',
        varietyName: 'Астана Стандарт',
        isStandard: true,
      },
      {
        id: 'p-var-001',
        trialId: 'trial-001',
        varietyId: 'var-001',
        varietyName: 'Лютесценс 32',
        isStandard: false,
      },
    ],
  },
] as const;

export const seedTrialResults = [
  // Standard participant yields
  { participantId: 'p-std-001', key: 'yield_plot1', value: '31.0' },
  { participantId: 'p-std-001', key: 'yield_plot2', value: '31.5' },
  { participantId: 'p-std-001', key: 'yield_plot3', value: '31.2' },
  { participantId: 'p-std-001', key: 'yield_plot4', value: '31.3' },
  // Variety yields
  { participantId: 'p-var-001', key: 'yield_plot1', value: '32.4' },
  { participantId: 'p-var-001', key: 'yield_plot2', value: '32.8' },
  { participantId: 'p-var-001', key: 'yield_plot3', value: '33.0' },
  { participantId: 'p-var-001', key: 'yield_plot4', value: '32.5' },
] as const;
