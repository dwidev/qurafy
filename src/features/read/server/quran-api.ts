import type { QuranVerse, ReadContentData, ReadListData } from "@/features/read/types";

const QURAN_API_BASE_URL = "https://api.quran.com/api/v4";
const QURAN_API_REVALIDATE_SECONDS = 12 * 60 * 60;
const ENGLISH_TRANSLATION_ID = 20;
const BISMILLAH = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

type QuranApiChapterSummary = {
  id: number;
  revelation_place: "makkah" | "madinah" | string;
  name_simple: string;
  name_arabic: string;
  verses_count: number;
};

type QuranApiChaptersResponse = {
  chapters: QuranApiChapterSummary[];
};

type QuranApiChapterResponse = {
  chapter: QuranApiChapterSummary & {
    bismillah_pre: boolean;
  };
};

type QuranApiJuzResponse = {
  juzs: Array<{
    juz_number: number;
    verse_mapping: Record<string, string>;
  }>;
};

type QuranApiWord = {
  char_type_name: string;
  text_uthmani?: string;
  text?: string;
  translation?: {
    text?: string;
  };
  transliteration?: {
    text?: string;
  };
};

type QuranApiVerse = {
  verse_number: number;
  verse_key: string;
  words?: QuranApiWord[];
  translations?: Array<{
    text?: string;
  }>;
};

type QuranApiVersesResponse = {
  verses: QuranApiVerse[];
  pagination?: {
    current_page: number;
    total_pages: number;
  };
};

function cleanHtmlText(text: string) {
  return text
    .replace(/<sup[^>]*>.*?<\/sup>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function mapRevelationPlace(place: string): ReadListData["surahs"][number]["loc"] {
  return place.toLowerCase() === "madinah" ? "Medinan" : "Meccan";
}

function buildWordText(words: QuranApiWord[] | undefined, selector: (word: QuranApiWord) => string | undefined) {
  if (!words || words.length === 0) {
    return "";
  }

  return words
    .filter((word) => word.char_type_name === "word")
    .map((word) => selector(word)?.trim())
    .filter((value): value is string => Boolean(value))
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function mapVerse(verse: QuranApiVerse): QuranVerse {
  const arabic = buildWordText(verse.words, (word) => word.text_uthmani ?? word.text);
  const transliteration = buildWordText(verse.words, (word) => word.transliteration?.text);
  const translationRaw = verse.translations?.[0]?.text ?? "";
  const translation = cleanHtmlText(translationRaw);
  const fallbackTranslation = buildWordText(verse.words, (word) => word.translation?.text);

  return {
    n: verse.verse_number,
    key: verse.verse_key,
    ar: arabic,
    latin: transliteration,
    en: translation.length > 0 ? translation : fallbackTranslation,
  };
}

async function fetchQuranApiJson<T>(path: string, revalidateSeconds = QURAN_API_REVALIDATE_SECONDS): Promise<T> {
  const response = await fetch(`${QURAN_API_BASE_URL}${path}`, {
    next: {
      revalidate: revalidateSeconds,
    },
  });

  if (!response.ok) {
    throw new Error(`Quran API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}

async function fetchAllVerses(pathBuilder: (page: number) => string): Promise<QuranApiVerse[]> {
  const firstPage = await fetchQuranApiJson<QuranApiVersesResponse>(pathBuilder(1));
  const firstVerses = firstPage.verses ?? [];
  const totalPages = Math.max(1, firstPage.pagination?.total_pages ?? 1);

  if (totalPages === 1) {
    return firstVerses;
  }

  const remainingPages = await Promise.all(
    Array.from({ length: totalPages - 1 }, (_, index) =>
      fetchQuranApiJson<QuranApiVersesResponse>(pathBuilder(index + 2)),
    ),
  );

  return firstVerses.concat(...remainingPages.map((page) => page.verses ?? []));
}

type ParsedStandardReadId = {
  type: "surah" | "juz";
  number: number;
};

type ParsedRangeReadId = {
  type: "range";
  startSurahNumber: number;
  startVerse: number;
  endSurahNumber: number;
  endVerse: number;
};

function parseReadId(id: string): ParsedStandardReadId | ParsedRangeReadId | null {
  const rangeMatch = id.match(/^range-(\d+)-(\d+)-(\d+)-(\d+)$/);

  if (rangeMatch) {
    const [, startSurahRaw, startVerseRaw, endSurahRaw, endVerseRaw] = rangeMatch;
    const startSurahNumber = Number(startSurahRaw);
    const startVerse = Number(startVerseRaw);
    const endSurahNumber = Number(endSurahRaw);
    const endVerse = Number(endVerseRaw);

    if (
      !Number.isInteger(startSurahNumber) ||
      !Number.isInteger(startVerse) ||
      !Number.isInteger(endSurahNumber) ||
      !Number.isInteger(endVerse) ||
      startSurahNumber <= 0 ||
      startVerse <= 0 ||
      endSurahNumber <= 0 ||
      endVerse <= 0
    ) {
      return null;
    }

    return {
      type: "range",
      startSurahNumber,
      startVerse,
      endSurahNumber,
      endVerse,
    };
  }

  const [rawType, rawNumber] = id.split("-");

  if (rawType !== "surah" && rawType !== "juz") {
    return null;
  }

  const number = Number(rawNumber);

  if (!Number.isInteger(number) || number <= 0) {
    return null;
  }

  return { type: rawType, number };
}

function isRangeOrdered(parsed: ParsedRangeReadId) {
  if (parsed.startSurahNumber !== parsed.endSurahNumber) {
    return parsed.startSurahNumber < parsed.endSurahNumber;
  }

  return parsed.startVerse <= parsed.endVerse;
}

export async function getQuranReadListData(): Promise<ReadListData> {
  const [chaptersResponse, juzResponse] = await Promise.all([
    fetchQuranApiJson<QuranApiChaptersResponse>("/chapters?language=id"),
    fetchQuranApiJson<QuranApiJuzResponse>("/juzs"),
  ]);

  const surahs: ReadListData["surahs"] = chaptersResponse.chapters.map((chapter) => ({
    n: chapter.id,
    en: chapter.name_simple,
    ar: chapter.name_arabic,
    verses: chapter.verses_count,
    loc: mapRevelationPlace(chapter.revelation_place),
  }));

  const juzByNumber = new Map<number, QuranApiJuzResponse["juzs"][number]>();

  for (const juz of juzResponse.juzs) {
    if (!juzByNumber.has(juz.juz_number)) {
      juzByNumber.set(juz.juz_number, juz);
    }
  }

  const juzs: ReadListData["juzs"] = [...juzByNumber.values()]
    .sort((left, right) => left.juz_number - right.juz_number)
    .map((juz) => {
      const firstSurah = Object.keys(juz.verse_mapping)
        .map((value) => Number(value))
        .sort((left, right) => left - right)[0];
      const firstRange = juz.verse_mapping[String(firstSurah)] ?? "1-1";
      const firstVerse = firstRange.split("-")[0] ?? "1";

      return {
        n: juz.juz_number,
        start: `Starts at ${firstSurah}:${firstVerse}`,
      };
    });

  return {
    surahs,
    juzs,
  };
}

export async function getQuranReadContentData(id: string): Promise<ReadContentData | null> {
  const parsed = parseReadId(id);

  if (!parsed) {
    return null;
  }

  if (parsed.type === "range") {
    if (
      parsed.startSurahNumber > 114 ||
      parsed.endSurahNumber > 114 ||
      !isRangeOrdered(parsed)
    ) {
      return null;
    }

    const quranList = await getQuranReadListData();
    const surahMap = new Map(quranList.surahs.map((surah) => [surah.n, surah] as const));
    const startSurah = surahMap.get(parsed.startSurahNumber);
    const endSurah = surahMap.get(parsed.endSurahNumber);

    if (!startSurah || !endSurah) {
      return null;
    }

    if (parsed.startVerse > startSurah.verses || parsed.endVerse > endSurah.verses) {
      return null;
    }

    const surahNumbers = Array.from(
      { length: parsed.endSurahNumber - parsed.startSurahNumber + 1 },
      (_, index) => parsed.startSurahNumber + index,
    );
    const versesBySurah = await Promise.all(
      surahNumbers.map((surahNumber) =>
        fetchAllVerses(
          (page) =>
            `/verses/by_chapter/${surahNumber}?language=en&words=true&word_fields=text_uthmani,transliteration&translations=${ENGLISH_TRANSLATION_ID}&per_page=300&page=${page}`,
        ),
      ),
    );

    const verses = versesBySurah
      .flatMap((surahVerses, index) => {
        const surahNumber = surahNumbers[index];

        if (surahNumber === undefined) {
          return [];
        }

        return surahVerses.filter((verse) => {
          if (surahNumber === parsed.startSurahNumber && verse.verse_number < parsed.startVerse) {
            return false;
          }

          if (surahNumber === parsed.endSurahNumber && verse.verse_number > parsed.endVerse) {
            return false;
          }

          return true;
        });
      })
      .map(mapVerse);

    if (verses.length === 0) {
      return null;
    }

    const chapterResponse =
      parsed.startVerse === 1
        ? await fetchQuranApiJson<QuranApiChapterResponse>(`/chapters/${parsed.startSurahNumber}?language=en`)
        : null;
    const sameSurah = parsed.startSurahNumber === parsed.endSurahNumber;
    const subtitle = sameSurah
      ? `${startSurah.en} • Verses ${parsed.startVerse}-${parsed.endVerse} • ${verses.length} Verses`
      : `${startSurah.en} ${parsed.startSurahNumber}:${parsed.startVerse} to ${endSurah.en} ${parsed.endSurahNumber}:${parsed.endVerse} • ${verses.length} Verses`;

    return {
      id,
      type: "range",
      number: parsed.startSurahNumber,
      title: sameSurah ? startSurah.en : "Khatam Reading",
      subtitle,
      bismillah: parsed.startVerse === 1 && chapterResponse?.chapter.bismillah_pre ? BISMILLAH : null,
      verses,
    };
  }

  if (parsed.type === "surah") {
    if (parsed.number > 114) {
      return null;
    }

    const [chapterResponse, verses] = await Promise.all([
      fetchQuranApiJson<QuranApiChapterResponse>(`/chapters/${parsed.number}?language=en`),
      fetchAllVerses(
        (page) =>
          `/verses/by_chapter/${parsed.number}?language=en&words=true&word_fields=text_uthmani,transliteration&translations=${ENGLISH_TRANSLATION_ID}&per_page=300&page=${page}`,
      ),
    ]);

    return {
      id,
      type: "surah",
      number: parsed.number,
      title: `Surah ${parsed.number}`,
      subtitle: `${chapterResponse.chapter.name_simple} • ${chapterResponse.chapter.verses_count} Verses`,
      bismillah: chapterResponse.chapter.bismillah_pre ? BISMILLAH : null,
      verses: verses.map(mapVerse),
    };
  }

  if (parsed.number > 30) {
    return null;
  }

  const verses = await fetchAllVerses(
    (page) =>
      `/verses/by_juz/${parsed.number}?language=en&words=true&word_fields=text_uthmani,transliteration&translations=${ENGLISH_TRANSLATION_ID}&per_page=300&page=${page}`,
  );

  const firstVerseKey = verses[0]?.verse_key;
  const lastVerseKey = verses[verses.length - 1]?.verse_key;
  const subtitle =
    firstVerseKey && lastVerseKey ? `From ${firstVerseKey} to ${lastVerseKey}` : "Khatam Reading";

  return {
    id,
    type: "juz",
    number: parsed.number,
    title: `Juz ${parsed.number}`,
    subtitle,
    bismillah: null,
    verses: verses.map(mapVerse),
  };
}
