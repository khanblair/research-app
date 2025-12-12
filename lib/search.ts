export const highlightSearchTerms = (text: string, query: string): string => {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
};

export const escapeRegex = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const fuzzySearch = (items: string[], query: string): string[] => {
  if (!query) return items;
  
  const lowerQuery = query.toLowerCase();
  
  return items.filter((item) =>
    item.toLowerCase().includes(lowerQuery)
  );
};

export const searchInText = (text: string, query: string): boolean => {
  return text.toLowerCase().includes(query.toLowerCase());
};

export const getSearchContext = (
  text: string,
  query: string,
  contextLength: number = 50
): string | null => {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  
  if (index === -1) return null;
  
  const start = Math.max(0, index - contextLength);
  const end = Math.min(text.length, index + query.length + contextLength);
  
  let excerpt = text.substring(start, end);
  
  if (start > 0) excerpt = "..." + excerpt;
  if (end < text.length) excerpt = excerpt + "...";
  
  return excerpt;
};
