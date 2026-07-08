export type AdventurerClass =
  | "SOLDIER"
  | "Paladin"
  | "Summoner"
  | "White Mage"
  | "Black Mage"
  | "Thief"
  | "Ravager"
  | "Sorceress"
  | "Court Mage"
  | "Genome"
  | "Guardian"
  | "General"
  | "Gunner"
  | "Martial Artist"
  | "Esper"
  | "Prince";

export type AdventurerStatus = "hero" | "villain" | "ally";

export interface Adventurer {
  id: number;
  name: string;
  adventurerClass: AdventurerClass;
  game: string;
  level: number;
  score: number;
  joinedDate: string;
  status: AdventurerStatus;
}
