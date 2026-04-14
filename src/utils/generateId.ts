function generateId() {
  return crypto?.randomUUID?.() || `cat_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export default generateId;
