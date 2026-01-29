import sanitizeHtml from "sanitize-html";

export const sanitizeInput = (input: string): string => {
  if (!input) return "";

  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
};
