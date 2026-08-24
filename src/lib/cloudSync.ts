import { supabase } from './supabaseClient';
import { ProgressMap } from './srs';

// Cloud is a best-effort mirror of local AsyncStorage progress, scoped to
// one child per parent account (MVP — multi-child support can extend this
// by letting the parent pick/create a child instead of always using [0]).

export async function ensureChild(): Promise<string | null> {
  if (!supabase) return null; // env vars missing/misconfigured — sync stays off
  const { data: userData } = await supabase.auth.getUser();
  const user = userData.user;
  if (!user) return null;

  const { data: existing, error: fetchError } = await supabase
    .from('children')
    .select('id')
    .eq('parent_id', user.id)
    .limit(1)
    .maybeSingle();
  if (fetchError) throw fetchError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await supabase
    .from('children')
    .insert({ parent_id: user.id })
    .select('id')
    .single();
  if (insertError) throw insertError;
  return created.id;
}

export async function pushSessionResult(progress: ProgressMap, correctCount: number, totalCount: number): Promise<void> {
  const childId = await ensureChild();
  if (!childId || !supabase) return; // not signed in / sync off — local-only, sync happens next time

  const rows = Object.entries(progress).map(([key, p]) => {
    const [wordId, lang] = key.split(':');
    return {
      child_id: childId,
      word_id: wordId,
      lang,
      interval: p.interval,
      repetition: p.repetition,
      ease_factor: p.easeFactor,
      next_review_at: p.nextReviewAt ? new Date(p.nextReviewAt).toISOString() : null,
      last_seen_at: p.lastSeenAt ? new Date(p.lastSeenAt).toISOString() : null,
      correct_count: p.correctCount,
      wrong_count: p.wrongCount,
      updated_at: new Date().toISOString(),
    };
  });

  if (rows.length > 0) {
    const { error } = await supabase.from('word_progress').upsert(rows, { onConflict: 'child_id,word_id,lang' });
    if (error) throw error;
  }

  const { error: sessionError } = await supabase
    .from('sessions')
    .insert({ child_id: childId, correct_count: correctCount, total_count: totalCount });
  if (sessionError) throw sessionError;
}

export interface RemoteWordProgressRow {
  word_id: string;
  lang: string;
  interval: number;
  repetition: number;
  ease_factor: number;
  correct_count: number;
  wrong_count: number;
}

export interface RemoteDashboardData {
  progress: RemoteWordProgressRow[];
  totalSessions: number;
  lastSessionAt: string | null;
}

export async function fetchDashboardData(): Promise<RemoteDashboardData | null> {
  const childId = await ensureChild();
  if (!childId || !supabase) return null;

  const [{ data: progress, error: progressError }, { data: sessions, error: sessionsError }] = await Promise.all([
    supabase
      .from('word_progress')
      .select('word_id, lang, interval, repetition, ease_factor, correct_count, wrong_count')
      .eq('child_id', childId),
    supabase.from('sessions').select('completed_at').eq('child_id', childId).order('completed_at', { ascending: false }),
  ]);
  if (progressError) throw progressError;
  if (sessionsError) throw sessionsError;

  return {
    progress: progress ?? [],
    totalSessions: sessions?.length ?? 0,
    lastSessionAt: sessions?.[0]?.completed_at ?? null,
  };
}
