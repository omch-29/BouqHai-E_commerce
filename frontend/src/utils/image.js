const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Cloudinary image fields are already full https:// URLs. Older test data
// (saved before the Cloudinary switch) may still have relative "/uploads/..."
// paths, so this keeps both working.
export const getImageUrl = (image) => {
  if (!image) return "";
  return image.startsWith("http") ? image : `${API_URL}${image}`;
};