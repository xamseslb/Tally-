import { err, ok, type Result } from '@/lib/result';
import { supabase } from '@/lib/supabase';

const BUCKET = 'attachments';

export interface PickedAsset {
  uri: string;
  mimeType?: string;
}

function extAndKind(type: string): { ext: string; kind: 'image' | 'video' } {
  if (type.includes('png')) return { ext: 'png', kind: 'image' };
  if (type.includes('mp4')) return { ext: 'mp4', kind: 'video' };
  if (type.includes('quicktime') || type.includes('mov')) return { ext: 'mov', kind: 'video' };
  return { ext: 'jpg', kind: 'image' };
}

/** Laster opp bilde/video til storage og lagrer en attachments-rad (med GPS). */
export async function uploadAttachment(
  reportId: string,
  asset: PickedAsset,
  meta: { caption?: string; lat?: number; lng?: number },
): Promise<Result<void>> {
  try {
    const response = await fetch(asset.uri);
    const bytes = await response.arrayBuffer();
    const type = asset.mimeType || response.headers.get('content-type') || 'image/jpeg';
    const { ext, kind } = extAndKind(type);
    const path = `${reportId}/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, bytes, { contentType: type, upsert: false });
    if (upErr) return err('Could not upload the file. Try again when you have coverage.');

    const { data: userData } = await supabase.auth.getUser();
    const uid = userData.user?.id;
    if (!uid) return err('Not signed in.');

    const { error: rowErr } = await supabase.from('attachments').insert({
      report_id: reportId,
      storage_path: path,
      kind,
      caption: meta.caption || null,
      uploaded_by: uid,
      captured_at: new Date().toISOString(),
      lat: meta.lat ?? null,
      lng: meta.lng ?? null,
    });
    if (rowErr) return err('Could not save the attachment.');
    return ok(undefined);
  } catch {
    return err('Could not upload. Check your connection and try again.');
  }
}

export async function removeAttachment(
  id: string,
  storagePath: string | null,
): Promise<Result<void>> {
  if (storagePath) await supabase.storage.from(BUCKET).remove([storagePath]);
  const { error } = await supabase.from('attachments').delete().eq('id', id);
  return error ? err('Could not remove the attachment.') : ok(undefined);
}

export async function getSignedUrl(storagePath: string): Promise<string | null> {
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(storagePath, 3600);
  return data?.signedUrl ?? null;
}
