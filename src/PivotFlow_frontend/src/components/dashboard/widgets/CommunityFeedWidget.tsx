import React, { useState } from 'react';
import { Card } from '../../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { ThumbsUp, MessageSquare, Share2 } from 'lucide-react';
import { useSocialStore } from '../../../store/useSocialStore';
import { useAuth } from '../../../contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

export const CommunityFeedWidget: React.FC = () => {
  const { principal } = useAuth();
  const [newComment, setNewComment] = useState('');
  const { comments, actions } = useSocialStore((state) => ({
    comments: state.comments['global'] || [],
    actions: state.actions,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !principal) return;

    const userPrincipal = principal.toString();
    actions.addComment('global', {
      userId: userPrincipal,
      userName: `User ${userPrincipal.slice(0, 6)}`,
      userAvatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${userPrincipal}`,
      content: newComment.trim(),
    });

    setNewComment('');
  };

  return (
    <Card className="p-4 h-full overflow-hidden flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Community Feed</h3>
        <Button variant="ghost" size="sm">
          See All
        </Button>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {comments.slice(0, 5).map((comment, index) => (
          <div key={index} className="flex gap-3 p-3 bg-slate-800/50 rounded-lg">
            <Avatar>
              <AvatarImage src={comment.userAvatar} />
              <AvatarFallback>{comment.userName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{comment.userName}</h4>
                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(comment.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
              <p className="mt-1 text-sm">{comment.content}</p>
              <div className="flex gap-4 mt-2">
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400">
                  <ThumbsUp className="w-4 h-4" />
                  {comment.likes}
                </button>
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </button>
                <button className="flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <Input
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Post
        </Button>
      </form>
    </Card>
  );
};
