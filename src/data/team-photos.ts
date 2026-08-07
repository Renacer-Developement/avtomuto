import type { ImageMetadata } from 'astro';
import type { TeamMemberKey } from './site';

// Реальні фото команди — додаються сюди по мірі надходження від клієнта.
// Для учасників без запису тут використовується іконка-плейсхолдер (TeamCard).
export const TEAM_PHOTOS: Partial<Record<TeamMemberKey, ImageMetadata>> = {};
