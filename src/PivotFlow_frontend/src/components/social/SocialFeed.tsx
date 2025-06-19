import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Avatar } from '../ui/avatar';
import {  Share2, ThumbsUp } from 'lucide-react';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
}

interface SocialFeedProps {
  collectionId: string;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLike: (commentId: string) => void;
  onShare: (commentId: string) => void;
}

export const SocialFeed: React.FC<SocialFeedProps> = ({
  // collectionId,
  comments,
  onAddComment,
  onLike,
  onShare,
}) => {
  const [newComment, setNewComment] = React.useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Community Discussion</h3>
      
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-2">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-1"
          />
          <Button type="submit">Post</Button>
        </div>
      </form>

      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 p-4 rounded-lg bg-gray-800">
            <Avatar>
              <img src={comment.userAvatar} alt={comment.userName} />
            </Avatar>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{comment.userName}</h4>
                  <p className="text-sm text-gray-400">
                    {comment.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <p className="mt-2">{comment.content}</p>
              
              <div className="flex gap-4 mt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(comment.id)}
                  className="flex items-center gap-2"
                >
                  <ThumbsUp size={16} />
                  <span>{comment.likes}</span>
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onShare(comment.id)}
                  className="flex items-center gap-2"
                >
                  <Share2 size={16} />
                  Share
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
