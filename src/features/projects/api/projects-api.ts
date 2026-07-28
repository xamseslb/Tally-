import { z } from 'zod';

import { err, ok, type Result } from '@/lib/result';
import { supabase } from '@/lib/supabase';

import type { CreateProjectInput } from '../model/schemas';

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  project_number: z.string().nullable(),
  address: z.string().nullable(),
  client_name: z.string().nullable(),
  status: z.string(),
});
export type Project = z.infer<typeof ProjectSchema>;

export async function listProjects(): Promise<Result<Project[]>> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, project_number, address, client_name, status')
    .is('deleted_at', null)
    .order('created_at', { ascending: false });

  if (error) return err('Kunne ikke hente prosjekter. Prøv igjen når du har dekning.');
  const parsed = z.array(ProjectSchema).safeParse(data ?? []);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}

export async function createProject(input: CreateProjectInput): Promise<Result<string>> {
  const { data, error } = await supabase.rpc('create_project', {
    project_name: input.name,
    project_number: input.projectNumber ?? null,
    address: input.address ?? null,
    client_name: input.clientName ?? null,
  });

  if (error) return err('Kunne ikke opprette prosjekt. Prøv igjen.');
  const parsed = z.string().safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Uventet svar fra server.');
}

export async function getProject(id: string): Promise<Result<Project | null>> {
  const { data, error } = await supabase
    .from('projects')
    .select('id, name, project_number, address, client_name, status')
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle();
  if (error) return err('Could not load the project.');
  if (!data) return ok(null);
  const parsed = ProjectSchema.safeParse(data);
  return parsed.success ? ok(parsed.data) : err('Unexpected response from server.');
}

export async function updateProject(id: string, input: CreateProjectInput): Promise<Result<void>> {
  const { error } = await supabase
    .from('projects')
    .update({
      name: input.name,
      project_number: input.projectNumber || null,
      address: input.address || null,
      client_name: input.clientName || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  return error ? err('Could not save the project. Try again.') : ok(undefined);
}

export async function setProjectStatus(
  id: string,
  status: 'active' | 'paused' | 'completed' | 'archived',
): Promise<Result<void>> {
  const { error } = await supabase
    .from('projects')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  return error ? err('Could not change the status. Try again.') : ok(undefined);
}
