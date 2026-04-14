import rankingData from '../data/ranking.json';
import type { RankingPayload } from '../types/domain';

/**
 * S1: lê do JSON local.
 * S2: substitui pelo client Supabase mantendo a mesma assinatura.
 */
export function useRanking(): RankingPayload {
  return rankingData as RankingPayload;
}
