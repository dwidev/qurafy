export type QuranLocationType = "Meccan" | "Medinan";

export type QuranSurahSummary = {
  n: number;
  en: string;
  ar: string;
  verses: number;
  loc: QuranLocationType;
};

export type QuranJuzSummary = {
  n: number;
  start: string;
};

export type QuranVerse = {
  n: number;
  key: string;
  ar: string;
  en: string;
  latin: string;
};

export type ReadListData = {
  surahs: QuranSurahSummary[];
  juzs: QuranJuzSummary[];
};

export type ReadContentType = "surah" | "juz";

export type ReadContentData = {
  id: string;
  type: ReadContentType;
  number: number;
  title: string;
  subtitle: string;
  bismillah: string | null;
  verses: QuranVerse[];
};
