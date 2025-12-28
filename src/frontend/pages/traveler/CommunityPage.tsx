import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  const [newPost, setNewPost] = useState({ title: '', text: '', location: '' });
  const [showNewPostForm, setShowNewPostForm] = useState(false);
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

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title.trim() || !newPost.text.trim()) return;

    try {
      const travellerId = getCurrentTravellerId();
      if (!travellerId) return;

      const response = await api.post('/pst/posts', {
        title: newPost.title,
        text: newPost.text,
        location: newPost.location,
        traveller_id: travellerId,
        stars: 5
      });
      
      if (response.data.success) {
        setNewPost({ title: '', text: '', location: '' });
        setShowNewPostForm(false);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLike = async (postId: number) => {
    try {
      const travellerId = getCurrentTravellerId();
      if (!travellerId) return;

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
      console.error('Error fetching comments:', error);
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
      alert('Please sign in to comment.');
      return;
    }

    const caption = (commentDraftByPostId[postId] || '').trim();
    if (!caption) return;

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
      alert('Link copied to clipboard.');
    } catch {
      alert('Unable to share or copy link.');
    }
  };

  const handleReport = async (postId: number) => {
    const reporterId = getCurrentTravellerId();
    if (!reporterId) {
      alert('Please sign in to report a post.');
      return;
    }

    const reason = window.prompt('Report reason (required):');
    if (!reason || !reason.trim()) return;

    const reportMessage = window.prompt('Additional details (optional):') || '';

    try {
      const response = await api.post(`/pst/posts/${postId}/report`, {
        reason: reason.trim(),
        reporter_id: reporterId,
        report_message: reportMessage
      });
      if (response.data?.success) {
        alert('Report submitted.');
      }
    } catch (error) {
      console.error('Error reporting post:', error);
      alert('Failed to submit report.');
    }
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-8"
        >
          Community Feed
        </motion.h1>

        <div className="max-w-3xl">
            {/* Create New Post */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow p-6 mb-6"
            >
              <h2 className="text-xl font-semibold mb-4">Reviews</h2>
              
              {!showNewPostForm ? (
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                  onClick={() => setShowNewPostForm(true)}
                >
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Create New Post</h3>
                  <p className="text-gray-600">Share your travel experiences with the community</p>
                </div>
              ) : (
                <form onSubmit={handleCreatePost} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                  <textarea
                    placeholder="Share your experience..."
                    value={newPost.text}
                    onChange={(e) => setNewPost({...newPost, text: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    rows={4}
                    required
                  />
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Post
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowNewPostForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </motion.div>

            {/* Posts */}
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-gray-600">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.post_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow mb-6 overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
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
                          <div className="flex items-center gap-2 text-sm text-gray-500">
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

                    <p className="text-gray-700 mb-4 whitespace-pre-line leading-relaxed">{post.text}</p>
                    
                    {post.image_url && (
                      <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg mb-4"
                      />
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => handleLike(post.post_id)}
                          className="flex items-center gap-2 text-gray-700 hover:text-red-600"
                          type="button"
                        >
                          <Heart className={`w-5 h-5 ${post.likedByMe ? 'text-red-600 fill-red-600' : 'text-gray-700'}`} />
                          <span className="text-sm font-medium">{post.likes || 0}</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post.post_id)}
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
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
                          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                          type="button"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleReport(post.post_id)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-900"
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
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(post.post_id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
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
              <div className="flex justify-center mt-8">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 mx-1 rounded ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
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
              className="bg-white rounded-lg shadow p-6 mt-8"
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