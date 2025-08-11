// Starter seed data for varieties. Pure data objects to initialize localStorage when empty.

// Note: This shape should be compatible with the VarietyRecord type.
export const initialVarieties = [
  {
    id: '1754887340435',
    name: 'Астана (Начальные данные)',
    cultureCode: 'wheat',
    cultureLabel: 'Пшеница',
    cultureGroup: 'Зерновые и крупяные',
    maturityGroup: 'D1 — среднеранний',
    applicant: 'ТОО "Научно-производственный центр зернового хозяйства им. А.И. Бараева"',
    inn: '123456789012',
    contactPerson: {
      name: 'Иванов Иван Иванович',
      phone: '+7 (777) 123-45-67',
      email: 'ivanov@baraev.kz'
    },
    submissionDate: '15.01.2023',
    targetOblasts: ['akmola', 'kostanay'],
    gssCheck: true,
    documents: [
      { id: 'doc1', name: 'Описание сорта.pdf', type: 'pdf', size: '1.2 MB' },
      { id: 'doc2', name: 'Результаты испытаний.docx', type: 'docx', size: '3.4 MB' },
    ],
    oblastStatuses: [
      {
        oblastId: 'akmola',
        oblastName: 'Акмолинская область',
        status: 'testing',
        submissionDate: '15.01.2023',
        lastUpdated: '2023-01-15T00:00:00.000Z'
      },
      {
        oblastId: 'kostanay',
        oblastName: 'Костанайская область',
        status: 'approved',
        submissionDate: '15.01.2023',
        lastUpdated: '2023-06-15T00:00:00.000Z'
      }
    ],
    results: [],
  },
  {
    id: '2',
    name: 'Карагандинская 70',
    cultureCode: 'wheat',
    cultureLabel: 'Пшеница',
    cultureGroup: 'Зерновые и крупяные',
    maturityGroup: 'D2 — среднеспелый',
    applicant: 'ТОО "Агрофирма "Родина"',
    inn: '234567890123',
    contactPerson: {
      name: 'Петров Петр Петрович',
      phone: '+7 (701) 987-65-43',
      email: 'petrov@rodina.agro'
    },
    submissionDate: '22.03.2022',
    targetOblasts: ['karaganda'],
    gssCheck: false,
    documents: [
      { id: 'doc3', name: 'Заявка.pdf', type: 'pdf', size: '0.8 MB' }
    ],
    oblastStatuses: [
      {
        oblastId: 'karaganda',
        oblastName: 'Карагандинская область',
        status: 'approved',
        submissionDate: '22.03.2022',
        lastUpdated: '2022-09-15T00:00:00.000Z'
      }
    ],
    results: [],
  }
];

// Starter seed data for trials
export const seedTrials = [
  {
    id: 'trial_1',
    year: 2023,
    cultureId: 'wheat',
    locationId: 'akmola',
    predecessor: 'Пшеница озимая',
    background: 'Пар чистый',
    technology: 'Интенсивная',
    status: 'completed',
    participants: [
      {
        id: 'p1',
        trialId: 'trial_1',
        varietyId: '1754887340435',
        varietyName: 'Астана (Начальные данные)',
        isStandard: false,
      },
      {
        id: 'p2',
        trialId: 'trial_1',
        varietyId: '2',
        varietyName: 'Карагандинская 70',
        isStandard: true,
      },
    ],
  },
];

// Starter seed data for trial results
export const seedTrialResults = [
  {
    participantId: 'p1',
    key: 'yield',
    value: '45.2',
  },
  {
    participantId: 'p1',
    key: 'protein',
    value: '12.5',
  },
  {
    participantId: 'p2',
    key: 'yield',
    value: '42.8',
  },
  {
    participantId: 'p2',
    key: 'protein',
    value: '13.1',
  },
];
