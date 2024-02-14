export function isModularBlock(obj: any) {
  if (Object.prototype.hasOwnProperty.call(obj, '_content_type_uid')) {
    return false;
  }

  // Otherwise, it's likely a modular block
  return true;
}

export function getBlockId(obj: any) {
  let id = '';

  if (isModularBlock(obj)) {
    // Find and return the key that is not '$' or 'id' and extract it as the content type
    const keys = Object.keys(obj);
    const blockKey = keys.find((key) => key !== '$' && key !== 'id') || '';
    id = obj[blockKey]._metadata.uid;
  } else {
    id = obj.uid;
  }
  return id;
}

export function getContentType(obj: any) {
  let contentType = '';

  if (isModularBlock(obj)) {
    // Find and return the key that is not '$' or 'id' and extract it as the content type
    const keys = Object.keys(obj);
    contentType = keys.find((key) => key !== '$' && key !== 'id') || '';
  } else {
    contentType = obj['_content_type_uid'];
  }
  return contentType;
}
