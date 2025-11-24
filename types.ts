export interface Opponent {
  id: string | number;
  name: string;
  phone: string;
  club: string;
  observation?: string;
}

export interface TimeSlot {
  start: string;
  end: string;
}

export interface DailyAvailability {
  slot1: TimeSlot;
  slot2: TimeSlot;
}

export interface WeeklyAvailability {
  monday: DailyAvailability;
  tuesday: DailyAvailability;
  wednesday: DailyAvailability;
  thursday: DailyAvailability;
  friday: DailyAvailability;
  saturday: DailyAvailability;
  sunday: DailyAvailability;
}

export interface MatchData {
  host: string;
  hostClub: string;
  championship: string;
  observation: string;
  opponentId: string | number | '';
  availability: WeeklyAvailability;
}

export type ViewMode = 'form' | 'opponents';
