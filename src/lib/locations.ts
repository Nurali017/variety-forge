// Иерархическая структура регионов Казахстана
export interface Region {
  id: string;
  name: string;
  type: 'oblast' | 'city' | 'district';
  parentId?: string;
  children?: Region[];
}

export const regions: Region[] = [
  // 1. Акмолинская область
  {
    id: 'akmola',
    name: 'Акмолинская область',
    type: 'oblast',
    children: [
      // Лесостепная зона
      { id: 'akmola-kokshetau-gsu', name: 'Кокшетауский ГСУ', type: 'district', parentId: 'akmola' },
      { id: 'akmola-sandyktau-gsu', name: 'Сандыктауский ГСУ', type: 'district', parentId: 'akmola' },
      // Степная слабо увлажнённая
      { id: 'akmola-shortandy-gsu', name: 'Шортандинский ГСУ', type: 'district', parentId: 'akmola' },
      { id: 'akmola-tselinograd-gsu', name: 'Целиноградский ГСУ', type: 'district', parentId: 'akmola' },
      // Степная слабозасушливая
      { id: 'akmola-egindykol-gsu', name: 'Егиндыкольский ГСУ', type: 'district', parentId: 'akmola' },
      { id: 'akmola-zhaksy-gsu', name: 'Жаксынский ГСУ', type: 'district', parentId: 'akmola' },
    ]
  },
  // 2. Северо-Казахстанская область
  {
    id: 'north_kazakhstan',
    name: 'Северо-Казахстанская область',
    type: 'oblast',
    children: [
      // Лесостепная зона
      { id: 'north_kazakhstan-arykbalyk-gsu', name: 'Арыкбалыкский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      { id: 'north_kazakhstan-ayrtau-gsu', name: 'Айыртауский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      { id: 'north_kazakhstan-esil-gsu', name: 'Есильский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      // Степная слабо увлажнённая
      { id: 'north_kazakhstan-ruzaev-gsu', name: 'Рузаевский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      { id: 'north_kazakhstan-shalakyn-gsu', name: 'Шалақынский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      { id: 'north_kazakhstan-sergeev-gsu', name: 'Сергеевский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
      { id: 'north_kazakhstan-kyzylzhar-gsu', name: 'Кызылжарский ГСУ', type: 'district', parentId: 'north_kazakhstan' },
    ]
  },
  // 3. Костанайская область
  {
    id: 'kostanay',
    name: 'Костанайская область',
    type: 'oblast',
    children: [
      // Степная слабо увлажнённая
      { id: 'kostanay-mendykara-gsu', name: 'Мендыкаринский ГСУ', type: 'district', parentId: 'kostanay' },
      { id: 'kostanay-fedorov-gsu', name: 'Федоровский ГСУ', type: 'district', parentId: 'kostanay' },
      { id: 'kostanay-kazakhstan-gss', name: 'Казахстанская ГСС', type: 'district', parentId: 'kostanay' },
      { id: 'kostanay-kostanay-complex-gsu', name: 'Костанайский комплексный ГСУ', type: 'district', parentId: 'kostanay' },
      { id: 'kostanay-kostanay-fruit-gsu', name: 'Костанайский плодоовощной ГСУ', type: 'district', parentId: 'kostanay' },
      // Степная слабозасушливая
      { id: 'kostanay-zhitikara-gsu', name: 'Житикаринский ГСУ', type: 'district', parentId: 'kostanay' },
    ]
  },
  // 4. Павлодарская область
  {
    id: 'pavlodar',
    name: 'Павлодарская область',
    type: 'oblast',
    children: [
      // Степная слабо увлажнённая
      { id: 'pavlodar-zhelezinka-gss', name: 'Железинская ГСС', type: 'district', parentId: 'pavlodar' },
      // Степная слабозасушливая
      { id: 'pavlodar-ertys-complex-gsu', name: 'Иртышский комплексный ГСУ', type: 'district', parentId: 'pavlodar' },
      { id: 'pavlodar-pavlodar-grain-gsu', name: 'Павлодарский зерновой ГСУ', type: 'district', parentId: 'pavlodar' },
      { id: 'pavlodar-pavlodar-vegetable-gsu', name: 'Павлодарский овощной ГСУ', type: 'district', parentId: 'pavlodar' },
    ]
  },
  // 5. Карагандинская область
  {
    id: 'karaganda',
    name: 'Карагандинская область',
    type: 'oblast',
    children: [
      // Степная слабозасушливая
      { id: 'karaganda-karaganda-vegetable-gsu', name: 'Карагандинский овощной ГСУ', type: 'district', parentId: 'karaganda' },
      { id: 'karaganda-osakarov-gsu', name: 'Осакаровский ГСУ', type: 'district', parentId: 'karaganda' },
      // Степная умеренно засушливая
      { id: 'karaganda-karkaraly-gsu', name: 'Каркаралинский ГСУ', type: 'district', parentId: 'karaganda' },
    ]
  },
  // 6. Ұлытау
  {
    id: 'ulytau',
    name: 'Ұлытау',
    type: 'oblast',
    children: [
      // Пустынно-степная умеренно засушливая
      { id: 'ulytau-zhana-arka-gsu', name: 'Жана-Аркинский ГСУ', type: 'district', parentId: 'ulytau' },
    ]
  },
  // 7. Западно-Казахстанская область
  {
    id: 'west_kazakhstan',
    name: 'Западно-Казахстанская область',
    type: 'oblast',
    children: [
      // Степная слабо засушливая
      { id: 'west_kazakhstan-burlin-gsu', name: 'Бурлинский ГСУ', type: 'district', parentId: 'west_kazakhstan' },
      { id: 'west_kazakhstan-zelenov-gsu', name: 'Зелёновский ГСУ', type: 'district', parentId: 'west_kazakhstan' },
      { id: 'west_kazakhstan-ural-gsu', name: 'Уральский ГСУ', type: 'district', parentId: 'west_kazakhstan' },
      { id: 'west_kazakhstan-syrym-gsu', name: 'Сырымский ГСУ', type: 'district', parentId: 'west_kazakhstan' },
    ]
  },
  // 8. Актюбинская область
  {
    id: 'aktobe',
    name: 'Актюбинская область',
    type: 'oblast',
    children: [
      // Степная слабо засушливая
      { id: 'aktobe-alga-gsu', name: 'Алгинский ГСУ', type: 'district', parentId: 'aktobe' },
      { id: 'aktobe-ayteke-bi-gsu', name: 'Айтекебийский ГСУ', type: 'district', parentId: 'aktobe' },
      // Степная слабоувлажненная
      { id: 'aktobe-martuk-gsu', name: 'Мартукский ГСУ', type: 'district', parentId: 'aktobe' },
    ]
  },
  // 9. Восточно-Казахстанская область
  {
    id: 'east_kazakhstan',
    name: 'Восточно-Казахстанская область',
    type: 'oblast',
    children: [
      // Степная слабо засушливая
      { id: 'east_kazakhstan-shemonaikha-gsu', name: 'Шемонаихинский ГСУ', type: 'district', parentId: 'east_kazakhstan' },
      // Степная умеренно-засушливая
      { id: 'east_kazakhstan-kurchum-gss', name: 'Курчумский ГСС', type: 'district', parentId: 'east_kazakhstan' },
      // Степная слабо увлажнённая
      { id: 'east_kazakhstan-altai-gsu', name: 'ГСУ Алтай', type: 'district', parentId: 'east_kazakhstan' },
    ]
  },
  // 10. Абай
  {
    id: 'abai',
    name: 'Абай',
    type: 'oblast',
    children: [
      // Степная слабо увлажнённая
      { id: 'abai-kokpekti-gsu', name: 'Кокпектинский ГСУ', type: 'district', parentId: 'abai' },
      // Степная умеренно засушливая
      { id: 'abai-novopokrovka-gsu', name: 'Новопокровский ГСУ', type: 'district', parentId: 'abai' },
      { id: 'abai-urdzhar-gsu', name: 'Урджарский ГСУ', type: 'district', parentId: 'abai' },
      // Пустынно-степная умеренно засушливая
      { id: 'abai-east-kazakhstan-fruit-gsu', name: 'Восточно-Казахстанский плодово-ягодный ГСУ', type: 'district', parentId: 'abai' },
    ]
  },
  // 11. Жетісу
  {
    id: 'zhetisu',
    name: 'Жетісу',
    type: 'oblast',
    children: [
      // предгорная (Джунгарский Алатау, северо-запад Тянь-Шань)
      { id: 'zhetisu-taldykorgan-fruit-gsu', name: 'Талдыкорганский п/ягодный ГСУ', type: 'district', parentId: 'zhetisu' },
      { id: 'zhetisu-karabula-gsu', name: 'Карабулакский ГСУ', type: 'district', parentId: 'zhetisu' },
      { id: 'zhetisu-kogaly-gsu', name: 'Когалинский ГСУ', type: 'district', parentId: 'zhetisu' },
      { id: 'zhetisu-sarkand-gsu', name: 'Саркандский ГСУ', type: 'district', parentId: 'zhetisu' },
      { id: 'zhetisu-panfilov-gsu', name: 'Панфиловский ГСУ', type: 'district', parentId: 'zhetisu' },
      // предгорная (Северо-Западный Тянь-Шань)
      { id: 'zhetisu-kerbula-gsu', name: 'Кербулакский ГСУ', type: 'district', parentId: 'zhetisu' },
    ]
  },
  // 12. Алматинская область
  {
    id: 'almaty',
    name: 'Алматинская область',
    type: 'oblast',
    children: [
      // Пустынная очень засушливая
      { id: 'almaty-balkhash-rice-gsu', name: 'Балхашский рисовый ГСУ', type: 'district', parentId: 'almaty' },
      // предгорная (Заилийский Алатау)
      { id: 'almaty-almaty-fruit-gsu', name: 'Алматинский п/ягодный ГСУ', type: 'district', parentId: 'almaty' },
      { id: 'almaty-kaskelen-fruit-gsu', name: 'Каскеленский п/ягодный ГСУ', type: 'district', parentId: 'almaty' },
      { id: 'almaty-enbekshikazakh-gsu', name: 'Енбекшиказахский ГСУ', type: 'district', parentId: 'almaty' },
      { id: 'almaty-ile-grain-gsu', name: 'Илийский зерновой ГСУ', type: 'district', parentId: 'almaty' },
      { id: 'almaty-ile-complex-gsu', name: 'Илийский комплексный ГСУ', type: 'district', parentId: 'almaty' },
      { id: 'almaty-raimon-gsu', name: 'Райымбекский ГСУ', type: 'district', parentId: 'almaty' },
    ]
  },
  // 13. Кызылординская область
  {
    id: 'kyzylorda',
    name: 'Кызылординская область',
    type: 'oblast',
    children: [
      // Пустынная сухая
      { id: 'kyzylorda-shieli-gsu', name: 'Шиелийский ГСУ', type: 'district', parentId: 'kyzylorda' },
      { id: 'kyzylorda-zhanakorgan-gsu', name: 'Жанакорганский ГСУ', type: 'district', parentId: 'kyzylorda' },
      { id: 'kyzylorda-kazaly-gsu', name: 'Казалинский ГСУ', type: 'district', parentId: 'kyzylorda' },
      { id: 'kyzylorda-zhalagash-gsu', name: 'Жалагашский ГСУ', type: 'district', parentId: 'kyzylorda' },
    ]
  },
  // 14. Жамбылская область
  {
    id: 'zhambyl',
    name: 'Жамбылская область',
    type: 'oblast',
    children: [
      // предгорная (Северо-Западный Тянь-Шань)
      { id: 'zhambyl-ryskulov-gsu', name: 'Т.Рыскуловский ГСУ', type: 'district', parentId: 'zhambyl' },
      { id: 'zhambyl-zhuvaly-gsu', name: 'Жуалинский ГСУ', type: 'district', parentId: 'zhambyl' },
      { id: 'zhambyl-zhambyl-complex-gsu', name: 'Жамбылский комплексный ГСУ', type: 'district', parentId: 'zhambyl' },
      { id: 'zhambyl-baizak-gsu', name: 'Байзакский ГСУ', type: 'district', parentId: 'zhambyl' },
    ]
  },
  // 15. Туркестанская область
  {
    id: 'turkestan',
    name: 'Туркестанская область',
    type: 'oblast',
    children: [
      // предгорная (Северного и Западного Тянь-Шаня)
      { id: 'turkestan-saryagash-gsu', name: 'Сарыагашский ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-lenger-gsu', name: 'Ленгерский ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-sairam-complex-gsu', name: 'Сайрамский комплексный ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-georgiev-gsu', name: 'Георгиевский ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-saryagash-fruit-gsu', name: 'Сарыагашский п/ягодный ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-saryagash-cotton-gsu', name: 'Сарыагашский хлопковый ГСУ', type: 'district', parentId: 'turkestan' },
      { id: 'turkestan-turkestan-gsu', name: 'Туркестанский ГСУ', type: 'district', parentId: 'turkestan' },
    ]
  }
];

// Функции для работы с регионами
export const getOblasts = (): Region[] => {
  return regions.filter(region => region.type === 'oblast');
};

export const getRegionsByOblast = (oblastId: string): Region[] => {
  const oblast = regions.find(r => r.id === oblastId);
  return oblast?.children || [];
};

export const getAllRegions = (): Region[] => {
  const allRegions: Region[] = [];
  regions.forEach(oblast => {
    allRegions.push(oblast);
    if (oblast.children) {
      allRegions.push(...oblast.children);
    }
  });
  return allRegions;
};

export const getRegionById = (id: string): Region | undefined => {
  return getAllRegions().find(r => r.id === id);
};

export const getOblastByRegion = (regionId: string): Region | undefined => {
  const region = getRegionById(regionId);
  if (region?.parentId) {
    return regions.find(r => r.id === region.parentId);
  }
  return undefined;
};

export const getRegionName = (id: string): string => {
  const region = getRegionById(id);
  return region?.name || id;
};
