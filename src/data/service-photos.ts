import type { ImageMetadata } from 'astro';
import prodazhKolisPhoto from '../assets/images/services/prodazh-kolis.png';
import evakuatorPhoto from '../assets/images/services/evakuator.png';
import rozmytnenniaPhoto from '../assets/images/services/rozmytnennia.png';
import sertyfikatsiiaPhoto from '../assets/images/services/sertyfikatsiia-avtomobiliv.png';

// Реальні фото для hero-блоку сторінок послуг — додаються сюди по мірі надходження.
// Для послуг без запису тут hero показує порожнє місце-плейсхолдер.
export const SERVICE_PHOTOS: Partial<Record<string, ImageMetadata>> = {
  'prodazh-kolis': prodazhKolisPhoto,
  evakuator: evakuatorPhoto,
  rozmytnennia: rozmytnenniaPhoto,
  'sertyfikatsiia-avtomobiliv': sertyfikatsiiaPhoto,
};
