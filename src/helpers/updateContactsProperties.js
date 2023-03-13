exports.updateContactsProperties = (contact, body) => {
  const newKeys = Object.keys(body);

  for (const key in contact) {
    contact[key] = newKeys.includes(String(key)) ? body[key] : contact[key];
  }
};
