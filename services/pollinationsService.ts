
import { ImageGenerationConfig, ImageStyle, AspectRatio, PollinationsModel } from "../types";

const DEFAULT_API_KEY = "pk_s65A6dBAlZ3wlX7s";

const STYLE_PROMPTS: Record<ImageStyle, string> = {
  [ImageStyle.NONE]: "",
  [ImageStyle.CINEMATIC]: "cinematic lighting, dramatic atmosphere, high dynamic range, 8k resolution, highly detailed, movie still, wide angle",
  [ImageStyle.PHOTOGRAPHIC]: "photorealistic, 35mm photography, sharp focus, natural lighting, dslr, highly detailed, raw photo",
  [ImageStyle.ANIME]: "anime style, vibrant colors, studio ghibli inspired, high quality drawing, detailed background, cell shaded",
  [ImageStyle.MANGA]: "manga style, black and white, ink lines, high contrast, screentones, clean linework",
  [ImageStyle.DIGITAL_ART]: "digital painting, artstation trending, illustration, concept art, sharp focus, masterpiece",
  [ImageStyle.PIXEL_ART]: "pixel art, 16-bit, retro game style, distinct pixels, vivid colors",
  [ImageStyle.FANTASY_ART]: "fantasy oil painting, dungeons and dragons style, majestic, magical atmosphere, intricate details",
  [ImageStyle.NEON_PUNK]: "cyberpunk aesthetic, neon glow, futuristic city, synthwave color palette, volumetric lighting",
  [ImageStyle._3D_MODEL]: "3d render, unreal engine 5, octane render, ray tracing, pbr textures, hyper-detailed"
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Nanobanana Pro Text-Inference Enhancement
 */
export const enhancePromptWithAI = async (
  userInstruction: string, 
  mode: 'expand' | 'modify' = 'expand', 
  originalPrompt?: string,
  apiKey?: string
): Promise<string> => {
  const safeInstruction = userInstruction.trim().slice(0, 500);
  const safeOriginal = originalPrompt ? originalPrompt.trim().slice(0, 500) : "";

  let systemInstruction = "";
  if (mode === 'expand') {
    systemInstruction = `Act as a high-end prompt engineer. Expand the following simple concept into a professional, descriptive 8K image prompt. Focus on lighting, textures, composition, and emotional weight. Return ONLY the final prompt text without any introductory labels: "${safeInstruction}"`;
  } else {
    systemInstruction = `Act as a precision image editor. Based on the current image metadata prompt: "${safeOriginal}", perform the following modification requested by the user: "${safeInstruction}". Crucially, keep the original art style and core elements unless explicitly asked to change them. Merge them into a single, cohesive NEW prompt for stable diffusion generation. Return ONLY the final result text:`;
  }

  const encodedMessage = encodeURIComponent(systemInstruction);
  const seed = Math.floor(Math.random() * 999999);
  const model = "openai-fast"; 
  const url = `https://text.pollinations.ai/${encodedMessage}?model=${model}&seed=${seed}&json=false`;

  const activeKey = apiKey?.trim() || DEFAULT_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${activeKey}`
      }
    });
    
    if (!response.ok) return userInstruction;

    const result = await response.text();
    const cleanedResult = result
      .replace(/^Prompt:/i, '')
      .replace(/^"(.*)"$/g, '$1')
      .replace(/^'(.*)'$/g, '$1')
      .replace(/```markdown|```/g, '')
      .trim();

    return cleanedResult || userInstruction;
  } catch (error) {
    console.error("Nanobanana Reasoning Error:", error);
    return userInstruction;
  }
};

/**
 * Z-Image Precision Core
 */
export const generateImage = async (config: ImageGenerationConfig): Promise<string> => {
  let finalPrompt = config.prompt;

  if (config.style && config.style !== ImageStyle.NONE) {
    const styleSuffix = STYLE_PROMPTS[config.style];
    if (styleSuffix) {
      finalPrompt = `${finalPrompt}, ${styleSuffix}`;
    }
  }

  const [width, height] = config.aspectRatio.split('x').map(Number);
  const seed = (config.seed !== undefined && config.seed !== -1) 
    ? config.seed 
    : Math.floor(Math.random() * 20000000);

  const encodedPrompt = encodeURIComponent(finalPrompt);
  const cacheBuster = Math.random().toString(36).substring(7);
  
  // Z-Image dedicated high-performance endpoint
  let url = `https://gen.pollinations.ai/image/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=zimage&v=${cacheBuster}`;

  const activeKey = config.apiKey?.trim() || DEFAULT_API_KEY;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${activeKey}`
      }
    });
    
    if (!response.ok) throw new Error(`Node Error: ${response.status}`);
    const blob = await response.blob();
    return await blobToBase64(blob);
  } catch (error) {
    console.error("Nanobanana Visual Synthesis Error:", error);
    throw error;
  }
};
