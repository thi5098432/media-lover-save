import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, Clock, BookOpen, Search } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Footer from '@/components/Footer';
import { blogPosts } from '@/data/blogPosts';
import { useState } from 'react';
import { Input } from '@/components/ui/input';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // JSON-LD structured data for blog
  const blogStructuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "SaveClip Blog",
    "description": "Dicas, tutoriais e guias sobre download de vídeos, formatos de mídia e muito mais.",
    "url": "https://saveclip.com.br/blog",
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "author": {
        "@type": "Organization",
        "name": "SaveClip"
      },
      "url": `https://saveclip.com.br/blog/${post.slug}`
    }))
  };

  return (
    <>
      <Helmet>
        <title>Blog | SaveClip - Dicas e Tutoriais de Download de Vídeos</title>
        <meta name="description" content="Dicas, tutoriais e guias sobre download de vídeos do YouTube, TikTok, Instagram e outras plataformas. Aprenda a baixar vídeos com qualidade." />
        <meta property="og:title" content="Blog SaveClip - Dicas e Tutoriais" />
        <meta property="og:description" content="Dicas, tutoriais e guias sobre download de vídeos do YouTube, TikTok, Instagram e outras plataformas." />
        <meta property="og:type" content="website" />
        <link rel="canonical" href="https://saveclip.com.br/blog" />
        <script type="application/ld+json">
          {JSON.stringify(blogStructuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <main className="relative z-10 container mx-auto px-4 py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="max-w-4xl mx-auto">
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-xl bg-primary/10">
                  <BookOpen className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold font-display">Blog</h1>
              </div>

              <p className="text-muted-foreground mb-8 max-w-2xl">
                Dicas, tutoriais e guias sobre download de vídeos, formatos de mídia e muito mais. Aprenda a usar o SaveClip da melhor forma.
              </p>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar artigos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </header>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-8">
              {['Todos', ...new Set(blogPosts.map(p => p.category))].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSearchTerm(cat === 'Todos' ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    (cat === 'Todos' && !searchTerm) || searchTerm === cat
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="grid gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-card rounded-xl p-6 border border-border hover:border-primary/30 transition-colors group"
                  >
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground text-sm">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>

                    <h2 className="text-xl font-semibold font-display mb-2 group-hover:text-primary transition-colors">
                      <Link to={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-muted-foreground mb-4">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary hover:gap-3 transition-all"
                    >
                      Ler mais
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                ))
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>Nenhum artigo encontrado para "{searchTerm}"</p>
                </div>
              )}
            </div>

            {/* Newsletter CTA */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-8 text-center">
              <h2 className="text-xl font-semibold font-display mb-3">Quer mais conteúdo?</h2>
              <p className="text-muted-foreground mb-4">
                Novos artigos são publicados regularmente. Volte sempre para mais dicas e tutoriais!
              </p>
              <Link 
                to="/"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Experimentar o SaveClip
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Blog;
