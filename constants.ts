import { Opponent, MatchData } from './types';

export const INITIAL_OPPONENTS: Opponent[] = [
  { id: 1, name: 'João Silva', phone: '85999990001', club: 'Galatasaray', observation: '' },
  { id: 2, name: 'Marcos Ferreira', phone: '85991887722', club: 'Fenerbahçe', observation: '' },
  { id: 3, name: 'Cláudio Santos', phone: '85992221100', club: 'Trabzonspor', observation: '' },
  { id: 4, name: 'Roberto Martins', phone: '85988112233', club: 'Antalyaspor', observation: '' },
];

export const CHAMPIONSHIPS = [
  'Série A',
  'Série B',
  'Série C',
  'Série D',
  'Série E',
  'Copa Squad',
  'Copa Survival',
  'Conference League',
  'Libertadores',
  'Sul Americana',
  'Champions League',
  'Europa League'
];

export const INITIAL_MATCH_DATA: MatchData = {
  host: '',
  hostClub: '',
  championship: 'Série E',
  observation: '',
  opponentId: '',
  availability: {
    monday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    tuesday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    wednesday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    thursday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    friday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    saturday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
    sunday: { slot1: { start: '', end: '' }, slot2: { start: '', end: '' } },
  },
};