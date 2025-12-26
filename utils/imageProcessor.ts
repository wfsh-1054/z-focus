/**
 * Utility functions for image processing, downloading, and compositing.
 */

/**
 * Downloads an image with optional format conversion and simple background removal.
 * @param sourceUrl The data URL or blob URL of the source image
 * @param filename Preferred filename without extension
 * @param format target format (png, jpeg, webp)
 * @param removeBackground simple luma keying for white background
 */
export const downloadImageAs = async (
  sourceUrl: string, 
  filename: string, 
  format: 'png' | 'jpeg' | 'webp',
  removeBackground: boolean = false,
  quality: number = 0.95
): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = sourceUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not initialize canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);

      // Simple Luma Keying for White Background Removal
      if (removeBackground && (format === 'png' || format === 'webp')) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const threshold = 245;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r > threshold && g > threshold && b > threshold) {
            data[i + 3] = 0; // Alpha
          }
        }
        ctx.putImageData(imageData, 0, 0);
      }

      // JPEG Background Fallback (Transparency -> White)
      if (format === 'jpeg') {
        ctx.globalCompositeOperation = 'destination-over';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality);

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${filename}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      resolve();
    };

    img.onerror = (err) => reject(err);
  });
};

/**
 * Composites two images with a mask (standard in-painting utility)
 */
export const compositeImageWithMask = async (
  baseImageBase64: string,
  generatedImageBase64: string,
  maskBase64: string
): Promise<string> => {
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  try {
    const [baseImg, genImg, maskImg] = await Promise.all([
      loadImage(baseImageBase64),
      loadImage(generatedImageBase64),
      loadImage(maskBase64)
    ]);

    const canvas = document.createElement('canvas');
    canvas.width = baseImg.width;
    canvas.height = baseImg.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Context creation failed");

    ctx.drawImage(baseImg, 0, 0);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = baseImg.width;
    tempCanvas.height = baseImg.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) throw new Error("Temp context failed");

    tempCtx.drawImage(genImg, 0, 0, baseImg.width, baseImg.height);
    tempCtx.globalCompositeOperation = 'destination-in';
    tempCtx.drawImage(maskImg, 0, 0, baseImg.width, baseImg.height);

    ctx.drawImage(tempCanvas, 0, 0);
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error("Compositing pipeline failed", error);
    return generatedImageBase64;
  }
};