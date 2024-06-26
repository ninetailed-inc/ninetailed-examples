// WARNING: Don't do this in production! This is for demos only!
// This function tries to revalidate the home page when hit
// Why? Because for demo purposes it prevents having to refresh a page for ISR to kick in
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  if (
    req.headers['x-ninetailed-secret'] !== process.env.WEBHOOK_CLIENT_SECRET
  ) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  try {
    // This is the part you don't want to copy for use anywhere. Live demo purposes only!
    // TODO: Make dynamic by fetching all page-like entries and mapping their paths
    await Promise.all([
      res.revalidate('/'),
      res.revalidate('/contact'),
      res.revalidate('/products/chair'),
      res.revalidate('/products/desk'),
      res.revalidate('/blog/ergonomic-workspace-tips'),
      res.revalidate('/blog/sustainable-office-benefits'),
    ]);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
