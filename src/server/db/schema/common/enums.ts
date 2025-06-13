/**
 * Enum representing different caste types with their Nepali translations
 */
export const CasteTypes = {
  chhetri: "क्षेत्री",
  brahmin_hill: "ब्राम्हण पहाड",
  magar: "मगर",
  newar: "नेवार",
  bishwakarma: "विश्वकर्मा",
  pariyar: "परियार",
  thakuri: "ठकुरी",
  sanyasi_dasnami: "सन्यासी/दसनामी",
  mallaha: "मल्लाह",
  hajam_thakur: "हजाम/ठकुर",
  badi: "बादी",
  other: "अन्य",
} as const;

export type CasteType = keyof typeof CasteTypes;
export const casteTypeValues = Object.keys(CasteTypes) as CasteType[];
