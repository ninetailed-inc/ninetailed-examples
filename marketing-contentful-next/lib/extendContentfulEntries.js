/**
 * Recursively transforms Contentful entries within a payload with async support
 * @param {Object} obj - The object to traverse
 * @param {string} targetContentTypeId - The content type ID to look for
 * @param {Function} transformer - Async function to transform matching entries
 * @returns {Promise<Object>} - The transformed object
 */

// TODO: Convert to typescript
export const extendContentfulEntries = async (
  obj,
  targetContentTypeId,
  transformer
) => {
  // Handle null/undefined
  if (!obj) return obj;

  // Handle arrays
  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map((item) =>
        extendContentfulEntries(item, targetContentTypeId, transformer)
      )
    );
  }

  // Handle objects
  if (typeof obj === 'object') {
    let result = obj;

    // First, check if this is a matching entry and transform it
    if (
      obj.sys?.contentType?.sys?.id === targetContentTypeId &&
      obj.sys?.type === 'Entry'
    ) {
      result = await transformer(obj);
    }

    // Then, recursively process all properties of the object (or transformed result)
    // This ensures we catch nested entries even within transformed entries
    return Object.fromEntries(
      await Promise.all(
        Object.entries(result).map(async ([key, value]) => [
          key,
          await extendContentfulEntries(
            value,
            targetContentTypeId,
            transformer
          ),
        ])
      )
    );
  }

  // Return primitive values as-is
  return obj;
};
