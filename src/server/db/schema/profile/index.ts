export * from "./demographics";
export * from "./economics";

// Re-export ageGroupEnum from demographics to resolve naming conflict
export { ageGroupEnum } from "./demographics";
export * from "./institutions";
export * from "./health";
export * from "./education";
export * from "./fertility";
export * from "./water-and-sanitation";
export * from "./physical";

// Re-export genderEnum from economics to resolve naming conflict
export { genderEnum } from "./economics";