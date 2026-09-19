const OPTIMIZABLE_RASTER_TYPES = new Set([
  "image/avif",
  "image/bmp",
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const IMAGE_PROFILES = {
  logo: { maxWidth: 1000, maxHeight: 1000, quality: 0.86 },
  thumbnail: { maxWidth: 960, maxHeight: 960, quality: 0.8 },
  content: { maxWidth: 1920, maxHeight: 1920, quality: 0.82 },
};

export const calculateContainedSize = (width, height, maxWidth, maxHeight) => {
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
};

const replaceExtension = (name, extension) => {
  const baseName = String(name || "imagen").replace(/\.[^/.]+$/, "") || "imagen";
  return `${baseName}.${extension}`;
};

const canvasToBlob = (canvas, type, quality) => new Promise((resolve, reject) => {
  canvas.toBlob((blob) => {
    if (blob) resolve(blob);
    else reject(new Error("El navegador no pudo comprimir la imagen."));
  }, type, quality);
});

const loadImage = async (file) => {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Safari support varies by image codec and version; the HTMLImageElement
      // fallback below handles the common formats without blocking the upload.
    }
  }

  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("El navegador no pudo leer esta imagen."));
    };
    image.src = objectUrl;
  });
};

const buildResult = (originalFile, outputFile, optimized, dimensions = {}) => ({
  file: outputFile,
  optimized,
  originalSize: originalFile.size,
  outputSize: outputFile.size,
  originalWidth: dimensions.originalWidth,
  originalHeight: dimensions.originalHeight,
  outputWidth: dimensions.outputWidth,
  outputHeight: dimensions.outputHeight,
});

export const optimizeImageFile = async (file, profileName = "content") => {
  const profile = IMAGE_PROFILES[profileName] || IMAGE_PROFILES.content;

  // SVG is sanitized elsewhere and animated GIFs must stay animated. Unknown
  // image formats are preserved so choosing a file never becomes extra work.
  if (!OPTIMIZABLE_RASTER_TYPES.has(file.type)) return buildResult(file, file, false);

  let source;
  try {
    source = await loadImage(file);
    const originalWidth = source.width || source.naturalWidth;
    const originalHeight = source.height || source.naturalHeight;
    const outputSize = calculateContainedSize(originalWidth, originalHeight, profile.maxWidth, profile.maxHeight);
    const canvas = document.createElement("canvas");
    canvas.width = outputSize.width;
    canvas.height = outputSize.height;
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) throw new Error("El navegador no pudo preparar la imagen.");

    context.drawImage(source, 0, 0, outputSize.width, outputSize.height);
    const blob = await canvasToBlob(canvas, "image/webp", profile.quality);
    const optimizedFile = new File([blob], replaceExtension(file.name, "webp"), {
      type: "image/webp",
      lastModified: file.lastModified,
    });

    const dimensions = {
      originalWidth,
      originalHeight,
      outputWidth: outputSize.width,
      outputHeight: outputSize.height,
    };

    // Keep an already-efficient original rather than increasing its weight.
    if (optimizedFile.size >= file.size) return buildResult(file, file, false, dimensions);
    return buildResult(file, optimizedFile, true, dimensions);
  } catch {
    // A browser may not decode a newer camera format. Preserve the original
    // instead of making the administrator resize or convert it manually.
    return buildResult(file, file, false);
  } finally {
    source?.close?.();
  }
};

export const formatOptimizationSummary = ({ originalSize, outputSize, optimized }) => {
  if (!optimized || !originalSize || outputSize >= originalSize) return "archivo preparado";
  const percentage = Math.round((1 - outputSize / originalSize) * 100);
  const megabytes = (bytes) => `${(bytes / 1024 / 1024).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  return `optimizada de ${megabytes(originalSize)} a ${megabytes(outputSize)} (${percentage}% menos)`;
};
