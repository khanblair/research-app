export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateISBN = (isbn: string): boolean => {
  const cleaned = isbn.replace(/[-\s]/g, "");
  return cleaned.length === 10 || cleaned.length === 13;
};

export const sanitizeString = (str: string): string => {
  return str.trim().replace(/\s+/g, " ");
};
