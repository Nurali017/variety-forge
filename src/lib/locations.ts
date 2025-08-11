// Справочник сортоучастков с привязкой к областям и природно-климатическим зонам
// Источник: предоставленные пользователем списки

export interface RegionZoneStructure {
  region: string;
  zones: { name: string; sites: string[] }[];
}

export const regionsStructure: RegionZoneStructure[] = [
  {
    region: "Акмолинская область",
    zones: [
      { name: "Лесостепная зона", sites: ["Кокшетауский ГСУ", "Сандыктауский ГСУ"] },
      { name: "Степная слабо увлажнённая", sites: ["Шортандинский ГСУ", "Целиноградский ГСУ"] },
      { name: "Степная слабозасушливая", sites: ["Егиндыкольский ГСУ", "Жаксынский ГСУ"] },
    ],
  },
  {
    region: "Северо-Казахстанская область",
    zones: [
      { name: "Лесостепная зона", sites: ["Арыкбалыкский ГСУ", "Айыртауский ГСУ", "Есильский ГСУ"] },
      { name: "Степная слабо увлажнённая", sites: ["Рузаевский ГСУ", "Шалақынский ГСУ", "Сергеевский ГСУ", "Кызылжарский ГСУ"] },
    ],
  },
  {
    region: "Костанайская область",
    zones: [
      { name: "Степная слабо увлажнённая", sites: [
        "Мендыкаринский ГСУ",
        "Федоровский ГСУ",
        "Казахстанская ГСС",
        "Костанайский комплексный ГСУ",
        "Костанайский плодоовощной ГСУ",
      ] },
    ],
  },
];

const siteToRegionMap = new Map<string, string>();
const siteToZoneMap = new Map<string, string>();

for (const r of regionsStructure) {
  for (const z of r.zones) {
    for (const s of z.sites) {
      siteToRegionMap.set(s, r.region);
      siteToZoneMap.set(s, z.name);
    }
  }
}

export const allSites: string[] = Array.from(siteToRegionMap.keys()).sort((a, b) => a.localeCompare(b, 'ru'));
export const allRegions: string[] = Array.from(new Set(regionsStructure.map(r => r.region))).sort((a, b) => a.localeCompare(b, 'ru'));

export function getRegionBySite(siteName: string | undefined): string | undefined {
  if (!siteName) return undefined;
  return siteToRegionMap.get(siteName);
}

export function getZoneBySite(siteName: string | undefined): string | undefined {
  if (!siteName) return undefined;
  return siteToZoneMap.get(siteName);
}

export function listSitesByRegion(region: string): string[] {
  return regionsStructure
    .find(r => r.region === region)?.zones.flatMap(z => z.sites) ?? [];
}

export function listSitesByRegionAndZone(region: string, zone: string): string[] {
  return regionsStructure
    .find(r => r.region === region)?.zones.find(z => z.name === zone)?.sites ?? [];
}
