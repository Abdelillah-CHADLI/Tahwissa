import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PostComposer } from '../../components/community/PostComposer';
import { Button, Dialog, Notice, PageState } from '../../components/ui';
import { motion } from 'motion/react';
import api from '../../services/api';
import defaultAvatar from '../../assets/imgs/guide.png';
import { Heart, MessageCircle, Share2, Flag, MapPin } from 'lucide-react';

interface Post {
  post_id: number;
  title: string;
  text: string;
  location: string;
  traveller_id: string;
  stars: number;
  likes: number;
  likedByMe?: boolean;
  commentsCount?: number;
  image_url: string;
  created_at: string;
  traveller_full_name: string;
  profile_picture: string;
}

interface Comment {
  commentId: number;
  created_at: string;
  caption: string;
  traveller_full_name: string;
  traveller_profile_picture: string | null;
}

const CommunityFeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [reportPost, setReportPost] = useState<number | null>(null);
  const [reportBusy, setReportBusy] = useState(false);
  const [reportError, setReportError] = useState('');
  const [commentBusy, setCommentBusy] = useState<number | null>(null);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [expandedPostId, setExpandedPostId] = useState<number | null>(null);
  const [commentsByPostId, setCommentsByPostId] = useState<Record<number, Comment[]>>({});
  const [commentsLoadingByPostId, setCommentsLoadingByPostId] = useState<Record<number, boolean>>({});
  const [commentDraftByPostId, setCommentDraftByPostId] = useState<Record<number, string>>({});

  const getCurrentTravellerId = (): string | null => {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
      const user = JSON.parse(userStr) as Record<string, unknown>;
      const travellerId =
        (user.traveller_id as string | undefined) ||
        (user.profileId as string | undefined) ||
        (user.userId as string | undefined) ||
        (user.id as string | undefined);

      return travellerId ? String(travellerId) : null;
    } catch {
      return null;
    }
  };

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const travellerId = getCurrentTravellerId();
      const response = await api.get('/pst/posts', {
        params: {
          pageSize: 10,
          pageNum: currentPage,
          travellerId: travellerId || undefined,
        }
      });
      
      if (response.data?.success) {
        const result = response.data.data;
        setPosts(Array.isArray(result?.posts) ? result.posts : []);
        setTotalPages(Number(result?.pagination?.totalPages) || 1);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Stories could not be loaded. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => { void fetchPosts(); }, [fetchPosts]);

  const handleLike = async (postId: number) => {
    try {
      const travellerId = getCurrentTravellerId();
      if (!travellerId) { setFeedback('Sign in to like a story.'); return; }

      const current = posts.find(p => p.post_id === postId);
      const currentlyLiked = Boolean(current?.likedByMe);

      // Optimistic update
      setPosts(prev => prev.map(p => {
        if (p.post_id !== postId) return p;
        const nextLiked = !currentlyLiked;
        const nextLikes = Math.max(0, (Number(p.likes) || 0) + (nextLiked ? 1 : -1));
        return { ...p, likedByMe: nextLiked, likes: nextLikes };
      }));

      const endpoint = currentlyLiked ? `/pst/posts/${postId}/unlike` : `/pst/posts/${postId}/like`;
      const response = await api.post(endpoint, { travellerId });
      
      if (response.data.success) {
        // keep optimistic state; optionally re-fetch if you want strict consistency
        return;
      }
    } catch (error) {
      console.error('Error liking post:', error);
      // rollback by refetching
      fetchPosts();
    }
  };

  const fetchComments = async (postId: number) => {
    setCommentsLoadingByPostId(prev => ({ ...prev, [postId]: true }));
    try {
      const response = await api.get(`/pst/posts/${postId}/comments`);
      if (response.data?.success) {
        const comments = response.data?.data?.comments;
        setCommentsByPostId(prev => ({
          ...prev,
          [postId]: Array.isArray(comments) ? comments : []
        }));
      }
    } catch (error) {
      console.error('Error fetching comments:', error); setFeedback('Comments could not be loaded. Close and reopen the comments to retry.');
    } finally {
      setCommentsLoadingByPostId(prev => ({ ...prev, [postId]: false }));
    }
  };

  const toggleComments = async (postId: number) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
      return;
    }

    setExpandedPostId(postId);

    // Always fetch when expanding so existing comments show immediately.
    await fetchComments(postId);
  };

  const handleAddComment = async (postId: number) => {
    const travellerId = getCurrentTravellerId();
    if (!travellerId) {
      setFeedback('Sign in to add a comment.');
      return;
    }

    const caption = (commentDraftByPostId[postId] || '').trim();
    if (!caption || commentBusy !== null) return;
    setCommentBusy(postId);

    try {
      const response = await api.post(`/pst/posts/${postId}/comments`, {
        caption,
        travellerId
      });

      if (response.data?.success) {
        setCommentDraftByPostId(prev => ({ ...prev, [postId]: '' }));
        await fetchComments(postId);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleShare = async (post: Post) => {
    const shareText = `${post.traveller_full_name}: ${post.title}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Community Post',
          text: shareText,
          url: window.location.href
        });
        return;
      }
    } catch {
      // fall back to clipboard
    }

    try {
      await navigator.clipboard.writeText(`${shareText} - ${window.location.href}`);
      setFeedback('Link copied to clipboard.');
    } catch {
      setFeedback('Unable to copy the link. You can copy this page’s address from your browser.');
    }
  };

  const submitReport = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (reportBusy || !reportPost) return;
    setReportBusy(true); setReportError('');
    try {
      const response = await api.post(`/pst/posts/${reportPost}/report`, { reason: data.get('reason'), reporter_id: getCurrentTravellerId(), report_message: data.get('details') });
      if (!response.data?.success) throw new Error('Report not saved');
      setReportPost(null); setFeedback('Report submitted. Our team will review this story.');
    } catch { setReportError('Your report could not be submitted. Please try again.'); }
    finally { setReportBusy(false); }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours <= 0) return 'Just now';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const renderStars = (rating: number) => {
    const safe = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
      <div className="flex items-center gap-0.5" aria-label={`${safe} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < safe ? 'text-yellow-400' : 'text-gray-200'}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.539 1.118L10.588 15.1a1 1 0 00-1.176 0l-3.368 2.45c-.784.57-1.838-.197-1.539-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.052 9.393c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.966z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f5f8f7] py-5 sm:py-8">
      <Dialog open={reportPost !== null} onClose={() => setReportPost(null)} title="Report this story" description="Tell our team what needs attention. Your report is private." busy={reportBusy}>
        <form onSubmit={submitReport} className="space-y-4">{reportError && <Notice tone="error">{reportError}</Notice>}<div><label className="field-label" htmlFor="report-reason">Reason (required)</label><select className="field" id="report-reason" name="reason" required><option value="">Select a reason</option><option>Spam or misleading content</option><option>Harassment or offensive content</option><option>Privacy concern</option><option>Other</option></select></div><div><label className="field-label" htmlFor="report-details">Additional details (optional)</label><textarea className="field" id="report-details" name="details" rows={3} /></div><div className="flex justify-end gap-2"><Button variant="secondary" disabled={reportBusy} onClick={() => setReportPost(null)}>Cancel</Button><Button busy={reportBusy} type="submit">Submit report</Button></div></form>
      </Dialog>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="mb-6 overflow-hidden rounded-2xl bg-[#245f63] px-5 py-7 text-white sm:px-8 sm:py-9">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#cbf492]">Traveler stories</p>
          <h1 className="mt-2 text-2xl font-bold sm:text-3xl">The Tahwissa community</h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
            Places, people, and moments worth sharing from around Algeria.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl">
            {(feedback || location.state?.published) && <div className="mb-4"><Notice>{feedback || 'Your story has been published.'}</Notice></div>}
            <section className="panel panel-body mb-6">
              <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold text-brand-ink">Share your journey</h2><p className="mt-1 text-sm text-gray-500">A local tip or a memorable trip can inspire someone’s next adventure.</p></div>{!showNewPostForm && <Button onClick={() => setShowNewPostForm(true)}>Write a story</Button>}</div>
              {showNewPostForm && <div className="mt-5 border-t border-line pt-5"><PostComposer onCancel={() => setShowNewPostForm(false)} onCreated={() => { setShowNewPostForm(false); setFeedback('Your story has been published.'); void fetchPosts(); }} /></div>}
            </section>

            {/* Posts */}
            {loading ? <PageState kind="loading" title="Loading traveler stories" /> : error ? <PageState kind="error" title="Community unavailable" description={error} action={<Button onClick={() => void fetchPosts()}>Try again</Button>} /> : posts.length === 0 ? <PageState title="Every journey has a story" description="Be the first to share a place, a tip, or a moment from your travels." action={<Link to="/traveler/add-post" className="button button-primary">Share a story</Link>} /> : (
              posts.map((post, index) => (
                <motion.div
                  key={post.post_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="panel mb-5 overflow-hidden"
                >
                  <div className="p-4 sm:p-6">
                    {/* Post Header */}
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={post.profile_picture || defaultAvatar}
                          alt={post.traveller_full_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{post.traveller_full_name}</h3>
                          <div className="flex flex-wrap items-center gap-x-2 text-xs text-gray-500">
                            {post.location ? (
                              <span className="inline-flex items-center gap-1 truncate">
                                <MapPin className="w-4 h-4" />
                                {post.location}
                              </span>
                            ) : null}
                            <span className="whitespace-nowrap">{formatDate(post.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        {renderStars(post.stars)}
                      </div>
                    </div>

                    {/* Post Content */}
                    {post.title ? (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                          {post.title}
                        </span>
                      </div>
                    ) : null}

                    <p className="text-gray-700 mb-4 whitespace-pre-line break-words leading-relaxed">{post.text}</p>
                    
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Post Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                      <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <button
                          aria-label="Like story" aria-pressed={!!post.likedByMe}
                          onClick={() => handleLike(post.post_id)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-md px-1 text-gray-700 hover:text-red-600"
                          type="button"
                        >
                          <Heart className={`w-5 h-5 ${post.likedByMe ? 'text-red-600 fill-red-600' : 'text-gray-700'}`} />
                          <span className="text-sm font-medium">{post.likes || 0}</span>
                        </button>

                        <button
                          aria-label="Show comments" aria-expanded={expandedPostId === post.post_id}
                          onClick={() => toggleComments(post.post_id)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-md px-1 text-gray-700 hover:text-gray-900"
                          type="button"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">
                            {Array.isArray(commentsByPostId[post.post_id])
                              ? commentsByPostId[post.post_id].length
                              : (post.commentsCount || 0)}
                          </span>
                        </button>

                        <button
                          onClick={() => handleShare(post)}
                          className="inline-flex min-h-10 items-center gap-2 rounded-md px-1 text-gray-700 hover:text-gray-900"
                          type="button"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>

                      <button
                        onClick={() => { if (!getCurrentTravellerId()) { setFeedback('Sign in to report a story.'); return; } setReportError(''); setReportPost(post.post_id); }}
                        className="inline-flex min-h-10 items-center gap-2 rounded-md px-1 text-gray-500 hover:text-gray-900"
                        type="button"
                      >
                        <Flag className="w-5 h-5" />
                        <span className="text-sm font-medium">Report</span>
                      </button>
                    </div>

                    {expandedPostId === post.post_id && (
                      <div className="mt-4">
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                          {commentsLoadingByPostId[post.post_id] ? (
                            <div className="text-sm text-gray-600">Loading comments…</div>
                          ) : (
                            <div className="space-y-3">
                              {(commentsByPostId[post.post_id] || []).length === 0 ? (
                                <div className="text-sm text-gray-600">No comments yet.</div>
                              ) : (
                                (commentsByPostId[post.post_id] || []).map((c) => (
                                  <div key={c.commentId} className="flex items-start gap-3">
                                    <img
                                      src={c.traveller_profile_picture || defaultAvatar}
                                      alt={c.traveller_full_name}
                                      className="w-8 h-8 rounded-full object-cover"
                                    />
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-gray-900">{c.traveller_full_name}</span>
                                        <span className="text-xs text-gray-500">{formatDate(c.created_at)}</span>
                                      </div>
                                      <p className="text-sm text-gray-700 whitespace-pre-line">{c.caption}</p>
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}

                          <div className="mt-4 flex gap-2">
                            <input
                              value={commentDraftByPostId[post.post_id] || ''}
                              onChange={(e) =>
                                setCommentDraftByPostId(prev => ({ ...prev, [post.post_id]: e.target.value }))
                              }
                              placeholder="Write a comment…"
                              aria-label="Write a comment" className="field min-w-0 flex-1"
                            />
                            <button
                              type="button"
                              disabled={commentBusy !== null || !commentDraftByPostId[post.post_id]?.trim()} onClick={() => handleAddComment(post.post_id)}
                              className="button button-primary"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap justify-center gap-2 mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === page
                        ? 'bg-[#348086] text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-8 rounded-2xl border border-[#dce9e5] bg-white p-5 shadow-sm sm:p-6"
            >
              <h2 className="text-xl font-semibold mb-4">Community Guidelines</h2>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Be respectful and kind
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Share authentic experiences
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Provide helpful information
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  Respect local cultures
                </li>
              </ul>
            </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CommunityFeedPage;
