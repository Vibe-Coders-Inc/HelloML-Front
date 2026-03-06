import Link from 'next/link';
import { blogPosts } from '@/lib/blog/posts';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-5xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-[#8B6F47] mb-4">
          HelloML Blog
        </h1>
        <p className="text-lg text-[#A89070] mb-12">
          Tips on AI phone agents, virtual receptionists, and small business automation.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-[#E8DCC8] bg-white p-6 hover:shadow-lg transition-shadow"
            >
              <p className="text-sm text-[#A89070] mb-2">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                &middot; {post.readTime}
              </p>
              <h2 className="text-xl font-semibold text-[#8B6F47] mb-3 group-hover:text-[#A67A5B] transition-colors">
                {post.title}
              </h2>
              <p className="text-[#A89070] text-sm leading-relaxed">
                {post.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
