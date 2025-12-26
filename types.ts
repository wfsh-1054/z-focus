
export enum AspectRatio {
  SQUARE = '1024x1024',
  LANDSCAPE = '1280x736',
  PORTRAIT = '736x1280',
  WIDE_LANDSCAPE = '1344x768',
  TALL_PORTRAIT = '768x1344'
}

export enum ImageStyle {
  NONE = 'None',
  CINEMATIC = 'Cinematic',
  PHOTOGRAPHIC = 'Photographic',
  ANIME = 'Anime',
  MANGA = 'Manga',
  DIGITAL_ART = 'Digital Art',
  PIXEL_ART = 'Pixel Art',
  FANTASY_ART = 'Fantasy Art',
  NEON_PUNK = 'Neon Punk',
  _3D_MODEL = '3D Model'
}

export enum PollinationsModel {
  ZIMAGE = 'zimage'
}

export interface GeneratedImage {
  id: string;
  url: string; 
  prompt: string;
  timestamp: number;
  seed?: number;
  style?: ImageStyle;
  aspectRatio: AspectRatio;
  model: PollinationsModel;
}

export interface ImageGenerationConfig {
  prompt: string;
  aspectRatio: AspectRatio;
  seed?: number; 
  style?: ImageStyle;
  model: PollinationsModel;
  apiKey?: string;
}
