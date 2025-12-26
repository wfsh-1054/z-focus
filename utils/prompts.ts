
// Expanded collection of high-quality prompts
export const RANDOM_PROMPTS = [
  // CYBERPUNK & FUTURISTIC
  "A futuristic cyberpunk city street at night with neon lights reflecting on wet pavement, towering skyscrapers, flying cars, cinematic lighting, highly detailed, 8k resolution.",
  "Portrait of a cyborg woman with porcelain skin and glowing blue circuitry, looking at camera, depth of field, neon atmosphere, digital art.",
  "A mech robot covered in moss and vines sitting in a forest, nature reclaiming technology, soft sunlight, studio ghibli style.",
  "Futuristic orbital space station with a view of Earth, lens flare, cinematic composition, unreal engine 5 render.",
  "A hacker's workspace with multiple transparent screens, glowing cables, dark room, synthwave aesthetic.",

  // ANIMALS & CREATURES
  "A cute fluffy white cat wearing distinct round glasses and a small detective hat, reading a newspaper in a cozy vintage cafe, digital art, soft lighting.",
  "A majestic lion made of swirling fire and smoke, dark background, dramatic lighting, fantasy art, intricate details.",
  "A steam-punk style mechanical owl with brass gears and glowing blue eyes, sitting on an antique clock, intricate textures, concept art.",
  "A tiny dragon sleeping inside a crystal geode, glowing scales, macro photography, magical atmosphere.",
  "A polar bear wearing a heavy winter coat and scarf, drinking hot cocoa in a snowy landscape, whimsical illustration style.",
  "Close up macro shot of a chameleon eye, vibrant colors, incredible detail, shallow depth of field.",

  // LANDSCAPES & NATURE
  "A serene Japanese garden in spring, cherry blossoms falling, a koi pond, wooden bridge, mount fuji in the background, watercolor painting style.",
  "A post-apocalyptic landscape with nature reclaiming a ruined city, overgrown vines on skyscrapers, sunset lighting, atmospheric perspective.",
  "An isometric view of a magical floating island with a small cottage, waterfalls cascading into the clouds, low poly 3d render, vibrant colors.",
  "Aurora borealis over a frozen lake in Iceland, reflection in the water, starry night sky, long exposure photography.",
  "A desert oasis with crystal clear blue water and lush palm trees, golden sand dunes, harsh sunlight, national geographic style.",
  "A bioluminescent forest at night, glowing mushrooms and plants, fairy lights, mystical atmosphere, fantasy concept art.",

  // PORTRAITS & CHARACTERS
  "Portrait of a female astronaut looking out a window at a colorful nebula, reflection in helmet visor, photorealistic, cinematic depth of field.",
  "An elderly wizard with a long white beard reading a glowing magical book in an ancient library, dust motes dancing in light beams, oil painting style.",
  "A street samurai with a katana, raining neon city background, dynamic pose, anime style, cel shaded.",
  "Close-up portrait of a tribal warrior with intricate face paint, intense gaze, jungle background, natural lighting, 85mm lens.",
  "A diverse group of adventurers sitting around a campfire, laughing, warm lighting, d&d party concept art.",

  // FOOD & STILL LIFE
  "A bowl of delicious ramen with steam rising, soft boiled egg, chashu pork, nori, anime food style, high quality drawing.",
  "A hyper-realistic close-up of a strawberry splashing into milk, high speed photography, studio lighting.",
  "A vintage typewriter on a wooden desk with scattered papers and a cup of coffee, moody lighting, nostalgic atmosphere.",
  "A stack of fluffy pancakes with dripping maple syrup and butter, blueberries, bright morning light, food photography.",
  "Crystal glass of whiskey with a spherical ice cube, sitting on a leather coaster, dimly lit bar background, bokeh.",

  // ART STYLES & ABSTRACT
  "Abstract fluid art with gold, black, and turquoise marble patterns, liquid texture, glossy finish, wallpaper 4k.",
  "A city skyline drawn in a continuous single line style, minimalist, black ink on white paper.",
  "A landscape made entirely of candy and sweets, chocolate river, lollipop trees, vibrant colors, 3d render.",
  "Paper cut art style layer composition of a mountain range at sunset, depth and shadows, orange and purple color palette.",
  "Stained glass window depicting a cosmic scene with planets and stars, light shining through, vibrant colors.",

  // ARCHITECTURE & INTERIOR
  "Modern minimalist living room with large floor-to-ceiling windows overlooking the ocean, white furniture, golden hour sunlight, architectural visualization.",
  "A cozy hobbit hole interior with round door, wooden furniture, fireplace, warm lighting, detailed textures.",
  "A futuristic gothic cathedral with neon accents, towering arches, fog on the floor, ominous atmosphere.",
  "An abandoned greenhouse filled with exotic overgrown plants, glass roof, sun rays, cinematic lighting.",
  "Tiny isometric coffee shop cutaway view, detailed interior, customers, barista, warm colors, 3d illustration.",

  // MISC
  "A message in a bottle floating in a stormy ocean, lightning in the distance, dramatic waves, oil painting texture.",
  "A skeleton playing a saxophone in a jazz club, smoky atmosphere, noir style, black and white photography.",
  "A transparent glass chess set on a glowing table, futuristic setting, ray tracing, reflection.",
  "A cute robot holding a red umbrella in the rain, reflection on the ground, emotional atmosphere, pixar style.",
  "An explosion of colorful powder paints, holi festival, black background, high speed photography, vibrant."
];

let lastPromptIndex = -1;

export const getRandomPrompt = (): string => {
  let randomIndex;
  // Simple logic to ensure we don't get the exact same prompt twice in a row
  do {
    randomIndex = Math.floor(Math.random() * RANDOM_PROMPTS.length);
  } while (randomIndex === lastPromptIndex && RANDOM_PROMPTS.length > 1);
  
  lastPromptIndex = randomIndex;
  return RANDOM_PROMPTS[randomIndex];
};
