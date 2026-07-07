const { randomUUID } = require('crypto');

const secrets = new Map();

function createSecret(text) {
  const id = randomUUID();
  const secret = { id, text, createdAt: new Date().toISOString() };
  secrets.set(id, secret);
  return secret;
}

function getSecretById(id) {
  return secrets.get(id) || null;
}

module.exports = {
  createSecret,
  getSecretById,
};
