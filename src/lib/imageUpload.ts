import { imageUploadSchema, ImageRef } from "./eventValidation";

export interface ImageUploadResult {
  success: boolean;
  data?: ImageRef;
  error?: string;
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  try {
    imageUploadSchema.parse({ file });
    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.errors?.[0]?.message || "Invalid file" };
  }
};

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image"));
    };
    img.src = URL.createObjectURL(file);
  });
};

export const uploadImageToStorage = async (file: File): Promise<ImageUploadResult> => {
  try {
    // Validate the file first
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    // Get image dimensions
    const dimensions = await getImageDimensions(file);
    
    // Create form data for upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'event-image');

    // Upload to your storage service (replace with your actual upload endpoint)
    const response = await fetch('/api/uploads/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (!result.url) {
      throw new Error('No URL returned from upload service');
    }

    const imageRef: ImageRef = {
      url: result.url,
      width: dimensions.width,
      height: dimensions.height,
      sizeBytes: file.size,
      mimeType: file.type as "image/jpeg" | "image/png"
    };

    return { success: true, data: imageRef };
  } catch (error: any) {
    return { success: false, error: error.message || "Upload failed" };
  }
};

export const validateImageDimensions = (width: number, height: number): { valid: boolean; warning?: string } => {
  const recommendedWidth = 2160;
  const recommendedHeight = 1080;
  
  if (width < recommendedWidth || height < recommendedHeight) {
    return {
      valid: true,
      warning: `Recommended dimensions are ${recommendedWidth}×${recommendedHeight}px. Your image is ${width}×${height}px.`
    };
  }
  
  return { valid: true };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
