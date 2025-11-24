import { WeeklyAvailability, DailyAvailability } from '../types';

const EMPTY_SLOT = { start: '', end: '' };
const EMPTY_DAY: DailyAvailability = { slot1: EMPTY_SLOT, slot2: EMPTY_SLOT };

const DAYS_MAP: Record<string, keyof WeeklyAvailability> = {
  'segunda': 'monday',
  'seg': 'monday',
  'terça': 'tuesday',
  'terca': 'tuesday',
  'ter': 'tuesday',
  'quarta': 'wednesday',
  'qua': 'wednesday',
  'quinta': 'thursday',
  'qui': 'thursday',
  'sexta': 'friday',
  'sex': 'friday',
  'sábado': 'saturday',
  'sabado': 'saturday',
  'sab': 'saturday',
  'domingo': 'sunday',
  'dom': 'sunday'
};

const DAY_ORDER: (keyof WeeklyAvailability)[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const formatTime = (h: string, m?: string) => `${h.padStart(2, '0')}:${m || '00'}`;

export const parseScheduleText = (text: string): Partial<WeeklyAvailability> => {
  const result: Partial<WeeklyAvailability> = {};
  const lowerText = text.toLowerCase();

  // Strategy: Process ranges with their times FIRST, then process individual days

  // Pattern: "de X a Y das H1 as H2"
  const rangeWithTimePattern = /de\s+(\w+)\s+a\s+(\w+)\s+das\s+(\d{1,2})(?::(\d{2})|h)?\s*(?:às|as|a)\s*(\d{1,2})(?::(\d{2})|h)?/gi;
  let match;

  while ((match = rangeWithTimePattern.exec(lowerText)) !== null) {
    const startDayKey = match[1];
    const endDayKey = match[2];
    const startTime = formatTime(match[3], match[4]);
    const endTime = formatTime(match[5], match[6]);

    const startDay = DAYS_MAP[startDayKey];
    const endDay = DAYS_MAP[endDayKey];

    if (startDay && endDay) {
      const startIdx = DAY_ORDER.indexOf(startDay);
      const endIdx = DAY_ORDER.indexOf(endDay);

      if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
        // Apply this time to ALL days in the range
        for (let i = startIdx; i <= endIdx; i++) {
          const day = DAY_ORDER[i];
          if (!result[day]) {
            result[day] = JSON.parse(JSON.stringify(EMPTY_DAY));
          }
          result[day]!.slot1 = { start: startTime, end: endTime };
        }
      }
    }
  }

  // Now process individual days with their times
  // Pattern: "(segunda|terca|...) das H1 as H2"
  const dayKeys = Object.keys(DAYS_MAP).join('|');
  const dayWithTimePattern = new RegExp(`(${dayKeys})\\s+das\\s+(\\d{1,2})(?::(\\d{2})|h)?\\s*(?:às|as|a)\\s*(\\d{1,2})(?::(\\d{2})|h)?`, 'gi');

  while ((match = dayWithTimePattern.exec(lowerText)) !== null) {
    const dayKey = match[1];
    const startTime = formatTime(match[2], match[3]);
    const endTime = formatTime(match[4], match[5]);

    const day = DAYS_MAP[dayKey];
    if (day) {
      if (!result[day]) {
        result[day] = JSON.parse(JSON.stringify(EMPTY_DAY));
      }

      // If slot1 is empty, use it, otherwise use slot2
      if (!result[day]!.slot1.start) {
        result[day]!.slot1 = { start: startTime, end: endTime };
      } else {
        result[day]!.slot2 = { start: startTime, end: endTime };
      }
    }
  }

  // Handle "e das H1 as H2" for additional slots (like "domingo das 8 as 12 e das 18 as 23")
  // This is tricky - we need to find the last mentioned day before an "e das"
  const additionalTimePattern = /e\s+das\s+(\d{1,2})(?::(\d{2})|h)?\s*(?:às|as|a)\s*(\d{1,2})(?::(\d{2})|h)?/gi;

  while ((match = additionalTimePattern.exec(lowerText)) !== null) {
    const startTime = formatTime(match[1], match[2]);
    const endTime = formatTime(match[3], match[4]);

    // Find the last day mentioned before this "e das"
    const textBeforeMatch = lowerText.substring(0, match.index);
    let lastDay: keyof WeeklyAvailability | null = null;
    let lastDayIndex = -1;

    Object.keys(DAYS_MAP).forEach(key => {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      let dayMatch;
      while ((dayMatch = regex.exec(textBeforeMatch)) !== null) {
        if (dayMatch.index > lastDayIndex) {
          lastDayIndex = dayMatch.index;
          lastDay = DAYS_MAP[key];
        }
      }
    });

    if (lastDay) {
      if (!result[lastDay]) {
        result[lastDay] = JSON.parse(JSON.stringify(EMPTY_DAY));
      }
      // Add to slot2
      result[lastDay]!.slot2 = { start: startTime, end: endTime };
    }
  }

  return result;
};
