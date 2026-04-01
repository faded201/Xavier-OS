export default async function handler(req, res) {
  const chapter = `
  The shadows moved before he did.
  Something inside him had awakened...
  `;

  res.status(200).json({ chapter });
}
