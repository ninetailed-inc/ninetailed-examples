// WARNING: Don't do this in production! This is for demos only!
// This function tries to revalidate the home page when hit
// Why? Because for demo purposes it prevents having to refresh a page for ISR to kick in
export default async function handler(req, res) {
  // Check for secret to confirm this is a valid request
  // if (req.query.secret !== process.env.MY_SECRET_TOKEN) {
  //   return res.status(401).json({ message: 'Invalid token' })
  // }

  try {
    await Promise.all([res.revalidate('/')]);
    return res.json({ revalidated: true });
  } catch (err) {
    // If there was an error, Next.js will continue
    // to show the last successfully generated page
    return res.status(500).send('Error revalidating');
  }
}
