// WARNING: Don't do this in production! This is for demos only!
export default async function handler(req, res) {
  if (
    req.headers['x-ninetailed-secret'] !== process.env.WEBHOOK_CLIENT_SECRET
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // This is the part you don't want to copy for use anywhere. Ninetailed live demo purposes only!
    // TODO: Make dynamic by fetching all page-like entries and mapping their paths
    await Promise.all([
      res.revalidate('/'),
      res.revalidate('/membership'),
      res.revalidate('/contact'),
      res.revalidate('/products/chair'),
      res.revalidate('/products/desk'),
      res.revalidate('/blog/ergonomic-workspace-tips'),
      res.revalidate('/blog/sustainable-office-benefits'),
    ]);
    return res.json({ revalidated: true });
  } catch (err) {
    return res.status(500).send('Error revalidating');
  }
}
