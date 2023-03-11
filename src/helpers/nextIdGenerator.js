exports.createNextId = data => {
  const idKeys = data.map(item => +item.id);
  const newId = String(Math.max(...idKeys) + 1);
  return newId;
};
