import { nanoid } from 'nanoid';

export type QRPayloadInput = Record<string, unknown>;

export function generateQRPayload(data: QRPayloadInput) {
  return btoa(JSON.stringify({
    id: nanoid(),
    data,
    expiresAt: Date.now() + 10 * 60 * 1000
  }));
}