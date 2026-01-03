import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Share2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import Footer from '@/components/Footer';
import { getPostBySlug, blogPosts } from '@/data/blogPosts';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getPostBySlug(slug) : undefined;

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copiado para a área de transferência!');
    }
  };

  // Get related posts (exclude current post)
  const relatedPosts = blogPosts
    .filter(p => p.id !== post.id)
    .slice(0, 3);

  // Convert markdown-like content to HTML
  const renderContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        // Headers
        if (line.startsWith('## ')) {
          return <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">{line.replace('## ', '')}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={index} className="text-xl font-semibold mt-6 mb-3 text-foreground">{line.replace('### ', '')}</h3>;
        }
        
        // Horizontal rule
        if (line.trim() === '---') {
          return <hr key={index} className="my-8 border-border" />;
        }
        
        // Bold text and lists
        if (line.startsWith('- **') || line.startsWith('- ✅') || line.startsWith('- ❌')) {
          const content = line.replace(/^- /, '').replace(/\*\*/g, '');
          return (
            <li key={index} className="ml-4 mb-2 text-muted-foreground">
              {content}
            </li>
          );
        }
        
        // Regular list items
        if (line.startsWith('- ')) {
          return (
            <li key={index} className="ml-4 mb-2 text-muted-foreground">
              {line.replace('- ', '')}
            </li>
          );
        }
        
        // Numbered lists
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="ml-4 mb-2 text-muted-foreground list-decimal">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          );
        }
        
        // Tables (simplified rendering)
        if (line.startsWith('|')) {
          const cells = line.split('|').filter(cell => cell.trim());
          if (cells.every(cell => cell.trim().match(/^[-:]+$/))) {
            return null; // Skip separator row
          }
          const isHeader = index > 0 && content.split('\n')[index + 1]?.includes('---');
          return (
            <tr key={index} className={isHeader ? 'bg-muted/50' : ''}>
              {cells.map((cell, cellIndex) => (
                isHeader ? (
                  <th key={cellIndex} className="px-4 py-2 text-left font-semibold text-foreground border border-border">
                    {cell.trim()}
                  </th>
                ) : (
                  <td key={cellIndex} className="px-4 py-2 text-muted-foreground border border-border">
                    {cell.trim()}
                  </td>
                )
              ))}
            </tr>
          );
        }
        
        // Regular paragraphs
        if (line.trim() && !line.startsWith('|')) {
          // Handle inline formatting
          let formattedLine = line
            .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-foreground">$1</strong>')
            .replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');
          
          return (
            <p 
              key={index} 
              className="mb-4 text-muted-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formattedLine }}
            />
          );
        }
        
        return null;
      });
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | SaveClip Blog</title>
        <meta name="description" content={post.metaDescription} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.metaDescription} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.metaDescription} />
        <link rel="canonical" href={`https://saveclip.com.br/blog/${post.slug}`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Background effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        </div>

        <main className="relative z-10 container mx-auto px-4 py-12">
          <Link to="/blog" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao blog
          </Link>

          <article className="max-w-3xl mx-auto">
            {/* Header */}
            <header className="mb-8">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  {post.category}
                </span>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  {new Date(post.date).toLocaleDateString('pt-BR', { 
                    day: 'numeric', 
                    month: 'long', 
                    year: 'numeric' 
                  })}
                </div>
                <div className="flex items-center gap-1 text-muted-foreground text-sm">
                  <Clock className="w-4 h-4" />
                  {post.readTime} de leitura
                </div>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold font-display mb-4 text-foreground">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground mb-6">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between border-b border-border pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Equipe SaveClip</p>
                    <p className="text-sm text-muted-foreground">Especialistas em download de mídia</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar
                </Button>
              </div>
            </header>

            {/* Content */}
            <div className="prose prose-lg max-w-none">
              {renderContent(post.content)}
            </div>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold mb-3 text-foreground">Pronto para começar?</h3>
              <p className="text-muted-foreground mb-6">
                Experimente o SaveClip gratuitamente e baixe seus vídeos favoritos agora mesmo!
              </p>
              <Link to="/">
                <Button size="lg" className="font-semibold">
                  Baixar Vídeos Grátis
                </Button>
              </Link>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-16">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Artigos Relacionados</h3>
                <div className="grid gap-4 md:grid-cols-3">
                  {relatedPosts.map(relatedPost => (
                    <Link
                      key={relatedPost.id}
                      to={`/blog/${relatedPost.slug}`}
                      className="bg-card rounded-xl p-4 border border-border hover:border-primary/30 transition-colors group"
                    >
                      <span className="text-xs text-primary font-medium">{relatedPost.category}</span>
                      <h4 className="font-semibold mt-2 group-hover:text-primary transition-colors line-clamp-2">
                        {relatedPost.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BlogPost;
