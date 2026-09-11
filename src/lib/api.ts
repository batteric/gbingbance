const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://example.infinityfreeapp.com/api/v1';

type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

interface RequestOptions {
  method?: HttpMethod;
  body?: unknown;
  token?: string | null;
  formData?: FormData;
}

export class ApiError extends Error {
  status: number;
  detail?: string;
  constructor(message: string, status: number, detail?: string) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

export async function api<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', body, token, formData } = options;
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let fetchBody: BodyInit | undefined;
  if (formData) {
    fetchBody = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    fetchBody = JSON.stringify(body);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: fetchBody,
  });

  let data: any;
  try {
    data = await res.json();
  } catch {
    data = { ok: false, error: 'Invalid JSON response' };
  }

  if (!res.ok || data.ok === false) {
    throw new ApiError(
      data.error || data.detail || `HTTP ${res.status}`,
      res.status,
      data.detail
    );
  }

  return data as T;
}

// Auth
export const authApi = {
  register: (payload: { pseudo: string; password: string; email?: string; sex?: string }) =>
    api('/auth/register', { method: 'POST', body: payload }),
  login: (payload: { login: string; password: string }) =>
    api<{ ok: boolean; token: string; user: any }>('/auth/login', { method: 'POST', body: payload }),
  me: (token: string) => api('/auth/me', { token }),
};

// Users
export const usersApi = {
  online: (token: string) => api('/users/online', { token }),
  get: (id: number, token: string) => api(`/users/${id}`, { token }),
  updateMe: (token: string, data: Partial<any>) =>
    api('/users/me', { method: 'PATCH', body: data, token }),
  uploadAvatar: (token: string, formData: FormData) =>
    api('/users/me/avatar', { method: 'POST', formData, token }),
  heartbeat: (token: string) =>
    api('/presence/heartbeat', { method: 'POST', token }),
};

// Rooms
export const roomsApi = {
  list: (token: string) => api('/rooms', { token }),
  create: (token: string, data: { name: string; description?: string; emoji?: string; is_public?: boolean }) =>
    api('/rooms', { method: 'POST', body: { action: 'create', ...data }, token }),
  enter: (token: string, roomId: number) =>
    api('/rooms', { method: 'POST', body: { action: 'enter', room_id: roomId }, token }),
  leave: (token: string, roomId: number) =>
    api('/rooms', { method: 'POST', body: { action: 'leave', room_id: roomId }, token }),
  joinCode: (token: string, code: string) =>
    api('/rooms', { method: 'POST', body: { action: 'join_code', code }, token }),
  setMusic: (token: string, roomId: number, trackId: number) =>
    api('/rooms', { method: 'POST', body: { action: 'set_music', room_id: roomId, track_id: trackId }, token }),
  messages: (token: string, roomId: number) =>
    api(`/rooms/${roomId}/messages`, { token }),
  postMessage: (token: string, roomId: number, content: string, kind?: string, meta?: any) =>
    api(`/rooms/${roomId}/messages`, { method: 'POST', body: { content, kind, meta }, token }),
};

// Messages (global)
export const messagesApi = {
  list: (token: string) => api('/messages', { token }),
  post: (token: string, content: string) =>
    api('/messages', { method: 'POST', body: { content }, token }),
  react: (token: string, id: number, emoji: string) =>
    api(`/messages/${id}/react`, { method: 'POST', body: { emoji }, token }),
};

// Music
export const musicApi = {
  tracks: (token: string) => api('/music/tracks', { token }),
  playback: (token: string) => api('/music/playback', { token }),
  setSite: (token: string, enabled: boolean) =>
    api('/music/site', { method: 'POST', body: { enabled }, token }),
  next: (token: string) => api('/music/next', { method: 'POST', token }),
};

// Games
export const gamesApi = {
  draw: (token: string, params: { type: string; category?: string; include18?: boolean; room_id?: number }) => {
    const q = new URLSearchParams();
    q.set('type', params.type);
    if (params.category) q.set('category', params.category);
    if (params.include18) q.set('include18', '1');
    if (params.room_id) q.set('room_id', String(params.room_id));
    return api(`/games/draw?${q}`, { token });
  },
  wheel: (token: string) => api('/games/wheel', { token }),
  challenges: {
    list: (token: string) => api('/games/challenges', { token }),
    create: (token: string, toUserId: number, promptId?: number) =>
      api('/games/challenges', { method: 'POST', body: { to_user_id: toUserId, prompt_id: promptId }, token }),
    action: (token: string, id: number, action: 'accept' | 'refuse' | 'complete') =>
      api(`/games/challenges/${id}`, { method: 'POST', body: { action }, token }),
  },
};

// Social
export const socialApi = {
  friends: (token: string) => api('/friends', { token }),
  request: (token: string, userId: number) =>
    api('/friends', { method: 'POST', body: { action: 'request', user_id: userId }, token }),
  accept: (token: string, requestId: number) =>
    api('/friends', { method: 'POST', body: { action: 'accept', request_id: requestId }, token }),
  refuse: (token: string, requestId: number) =>
    api('/friends', { method: 'POST', body: { action: 'refuse', request_id: requestId }, token }),
  pmList: (token: string) => api('/pm', { token }),
  pmThread: (token: string, userId: number) => api(`/pm/${userId}`, { token }),
  pmSend: (token: string, userId: number, content: string) =>
    api(`/pm/${userId}`, { method: 'POST', body: { content }, token }),
  notifications: (token: string) => api('/notifications', { token }),
  markRead: (token: string, id?: number) =>
    api('/notifications', { method: 'POST', body: { action: 'read', id }, token }),
  swipe: (token: string, targetId: number, like: boolean) =>
    api('/swipe', { method: 'POST', body: { target_id: targetId, like }, token }),
  discover: (token: string) => api('/discover/queue', { token }),
};

export default api;
