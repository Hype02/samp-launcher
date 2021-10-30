import { writable } from 'svelte/store';
import type { ServerInfo } from "./api/SampApi";

export const currentTab = writable('');
export const currentServer = writable({} as ServerInfo);