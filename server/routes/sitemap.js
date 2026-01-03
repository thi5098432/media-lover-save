import { Router } from 'express';

const router = Router();

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/blog', priority: '0.9', changefreq: 'daily' },
  { loc: '/sobre', priority: '0.6', changefreq: 'monthly' },
  { loc: '/contato', priority: '0.6', changefreq: 'monthly' },
  { loc: '/privacidade', priority: '0.4', changefreq: 'yearly' },
  { loc: '/termos', priority: '0.4', changefreq: 'yearly' },
  { loc: '/dmca', priority: '0.4', changefreq: 'yearly' },
];

const blogSlugs = [
  'como-baixar-videos-youtube-legalmente',
  'melhores-formatos-video',
  'dicas-economizar-espaco-videos',
  'como-baixar-videos-tiktok-sem-marca-dagua',
  'baixar-videos-instagram-reels-stories',
  'como-converter-youtube-mp3',
  'como-baixar-videos-twitter-x',
  'como-baixar-gifs-twitter',
  'como-baixar-videos-facebook',
  'baixar-facebook-reels-stories',
  'como-baixar-videos-reddit',
  'como-baixar-imagens-pinterest',
  'como-baixar-videos-vimeo',
  'como-baixar-musicas-soundcloud',
];

router.get('/', (req, res) => {
  try {
    const baseUrl = process.env.BASE_URL || 'https://saveclip.com.br';
    const today = new Date().toISOString().split('T')[0];

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

    for (const page of staticPages) {
      xml += `  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
    }

    for (const slug of blogSlugs) {
      xml += `  <url>
    <loc>${baseUrl}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
`;
    }

    xml += '</urlset>';

    res.set({
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    });

    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).json({ error: 'Failed to generate sitemap' });
  }
});

export default router;
