'use client';

import { useState, useMemo } from 'react';
import {
  Plus,
  MessageCircle,
  Heart,
  Search,
  X,
  Tag,
  Users,
  TrendingUp,
  FileText,
} from 'lucide-react';
import { communityPosts } from '@/lib/data';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

/* ── Popular Tags ── */
const popularTags = [
  { name: 'Trading Cards', count: 342, color: 'bg-orange-50 text-orange-600 border-orange-200/60 hover:bg-orange-100' },
  { name: 'Gundam', count: 218, color: 'bg-blue-50 text-blue-600 border-blue-200/60 hover:bg-blue-100' },
  { name: 'Authentication', count: 156, color: 'bg-amber-50 text-amber-600 border-amber-200/60 hover:bg-amber-100' },
  { name: 'Storage', count: 134, color: 'bg-green-50 text-green-600 border-green-200/60 hover:bg-green-100' },
  { name: 'Tips', count: 198, color: 'bg-purple-50 text-purple-600 border-purple-200/60 hover:bg-purple-100' },
  { name: 'Figures', count: 167, color: 'bg-pink-50 text-pink-600 border-pink-200/60 hover:bg-pink-100' },
];

/* ── User color map for avatars ── */
const userColorMap: Record<string, string> = {
  CardNewbie: 'from-orange-400 to-red-400',
  GundamBuilderID: 'from-blue-400 to-indigo-500',
  ProCollector: 'from-emerald-400 to-teal-500',
  FigureFanatic: 'from-purple-400 to-pink-400',
};

function getInitials(name: string): string {
  return name
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filteredPosts = useMemo(() => {
    return communityPosts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.preview.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTag =
        activeTag === null || post.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [searchQuery, activeTag]);

  const hasActiveFilters = searchQuery !== '' || activeTag !== null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={() => {}}
                  className="cursor-pointer text-[#64748B] hover:text-[#FF6B35] transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-[#E5E7EB]" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-[#111827] font-semibold">
                  Community
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
              <span className="text-[#FF6B35]">💬</span> HobiMart Community
            </h1>
            <p className="text-sm text-[#64748B] mt-1">
              Connect, share, and learn from fellow hobbyists
            </p>
          </div>
          <Button className="bg-[#FF6B35] text-white hover:bg-[#E55A2B] rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/20 self-start sm:self-auto">
            <Plus className="w-4 h-4 mr-1.5" />
            New Discussion
          </Button>
        </div>

        {/* ── Search ── */}
        <div className="relative mb-6 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search discussions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-9 h-10 rounded-xl border-[#E5E7EB] bg-white text-sm focus-visible:ring-[#FF6B35]/20 focus-visible:border-[#FF6B35]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* ── Main Content: Posts + Sidebar ── */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Post List ── */}
          <div className="flex-1 min-w-0">
            {filteredPosts.length > 0 ? (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/5 hover:border-gray-200 cursor-pointer group"
                  >
                    <div className="flex items-start gap-3.5">
                      {/* Avatar */}
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                          userColorMap[post.user] || 'from-gray-300 to-gray-400'
                        } flex items-center justify-center flex-shrink-0`}
                      >
                        <span className="text-xs font-bold text-white">
                          {getInitials(post.user)}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-[#1F2937]">
                            {post.user}
                          </span>
                          <span className="text-xs text-gray-300">·</span>
                          <span className="text-xs text-gray-400">
                            {post.time}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#1F2937] group-hover:text-[#FF6B35] transition-colors line-clamp-1">
                          {post.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1.5 leading-relaxed line-clamp-2">
                          {post.preview}
                        </p>

                        {/* Tags */}
                        <div className="flex items-center flex-wrap gap-1.5 mt-3">
                          {post.tags.map((tag) => (
                            <button
                              key={tag}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTag(activeTag === tag ? null : tag);
                              }}
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-gray-50 text-gray-500 border border-gray-100 hover:bg-[#FF6B35]/10 hover:text-[#FF6B35] hover:border-[#FF6B35]/20 transition-all"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>

                        {/* Engagement */}
                        <div className="flex items-center gap-5 mt-3.5 pt-3.5 border-t border-gray-50">
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-[#FF6B35] transition-colors group/btn">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              {post.replies}
                            </span>
                          </button>
                          <button className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors group/btn">
                            <Heart className="w-4 h-4" />
                            <span className="text-xs font-medium">
                              {post.likes}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              /* ── Empty State ── */
              <div className="bg-white rounded-2xl border border-[#E5E7EB] py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-[#F8FAFC] flex items-center justify-center mx-auto mb-5">
                  <FileText className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-[#1F2937]">
                  No discussions found
                </h3>
                <p className="text-sm text-gray-400 mt-1.5 max-w-sm mx-auto">
                  {hasActiveFilters
                    ? 'Try adjusting your search or filter to find what you\'re looking for'
                    : 'Be the first to start a discussion in the community'}
                </p>
                {hasActiveFilters && (
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setActiveTag(null);
                    }}
                    variant="outline"
                    className="mt-5 rounded-xl font-semibold text-sm border-[#E5E7EB] text-[#1F2937] hover:bg-[#F8FAFC] shadow-none"
                  >
                    <X className="w-3.5 h-3.5 mr-1.5" />
                    Clear Filters
                  </Button>
                )}
                {!hasActiveFilters && (
                  <Button className="mt-5 bg-[#FF6B35] text-white hover:bg-[#E55A2B] rounded-xl font-semibold text-sm shadow-lg shadow-orange-500/20">
                    <Plus className="w-4 h-4 mr-1.5" />
                    Start a Discussion
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-5">
              {/* Popular Tags */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-[#FF6B35]" />
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Popular Tags
                  </h3>
                </div>
                <div className="space-y-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag.name}
                      onClick={() =>
                        setActiveTag(activeTag === tag.name ? null : tag.name)
                      }
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                        activeTag === tag.name
                          ? 'bg-[#FF6B35]/10 border-[#FF6B35]/30 text-[#FF6B35]'
                          : `${tag.color} border-transparent hover:shadow-sm`
                      }`}
                    >
                      <span>{tag.name}</span>
                      <span
                        className={`text-xs font-semibold ${
                          activeTag === tag.name
                            ? 'text-[#FF6B35]/70'
                            : 'text-gray-400'
                        }`}
                      >
                        {tag.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Community Stats Mini Card */}
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
                  <h3 className="text-sm font-bold text-[#1F2937]">
                    Community Stats
                  </h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
                      Members
                    </span>
                    <span className="text-xs font-bold text-[#1F2937]">
                      12,847
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-gray-400" />
                      Discussions
                    </span>
                    <span className="text-xs font-bold text-[#1F2937]">
                      3,291
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <MessageCircle className="w-3.5 h-3.5 text-gray-400" />
                      Replies Today
                    </span>
                    <span className="text-xs font-bold text-green-600">
                      +89
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
