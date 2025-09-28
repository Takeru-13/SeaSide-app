import { put } from '../../../shared/api/http';
import type { RecordInput, RecordView } from '../types';

export async function patchRecord(date: string, input: RecordInput) {
  // 実体は PUT
  return put<RecordView>(`/records/${date}`, input);
}