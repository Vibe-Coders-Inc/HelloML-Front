import Link from 'next/link';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F3]">
      <div className="max-w-4xl mx-auto px-4 py-24">
        <h1 className="text-4xl font-bold text-[#8B6F47] mb-4">
          HelloML Blog
        </h1>
        <p className="text-lg text-[#A89070] mb-12">
          Tips on AI phone agents, virtual receptionists, and small business
          automation. Coming soon.
        </p>
        <div className="rounded-2xl border border-[#E8DCC8] bg-white p-8 text-center">
          <h2 className="text-xl font-semibold text-[#8B6F47] mb-2">
            We&apos;re writing our first posts
          </h2>
          <p className="text-[#A89070] mb-6">
            Subscribe to get notified when we publish guides on automated phone
            answering, AI appointment booking, and more.
          </p>
          <Link
            href="/auth?mode=signup"
            className="inline-flex items-center gap-2 bg-[#8B6F47] text-white px-6 py-3 rounded-full font-medium hover:bg-[#A67A5B] transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
