export default function handler(req, res) {
  res.setDraftMode({ enable: false });
  res.redirect('/');
}
