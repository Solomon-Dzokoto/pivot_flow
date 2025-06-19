import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  likedBy: string[];
}

interface SocialState {
  comments: Record<string, Comment[]>; // collectionId -> comments
  actions: {
    addComment: (collectionId: string, comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'likedBy'>) => void;
    likeComment: (collectionId: string, commentId: string, userId: string) => void;
    unlikeComment: (collectionId: string, commentId: string, userId: string) => void;
    deleteComment: (collectionId: string, commentId: string) => void;
  };
}

export const useSocialStore = create<SocialState>()(
  immer((set) => ({
    comments: {},
    actions: {
      addComment: (collectionId, comment) =>
        set((state) => {
          if (!state.comments[collectionId]) {
            state.comments[collectionId] = [];
          }
          state.comments[collectionId].unshift({
            ...comment,
            id: Math.random().toString(36).substring(7),
            timestamp: new Date(),
            likes: 0,
            likedBy: [],
          });
        }),
      likeComment: (collectionId, commentId, userId) =>
        set((state) => {
          const comment = state.comments[collectionId]?.find((c) => c.id === commentId);
          if (comment && !comment.likedBy.includes(userId)) {
            comment.likes += 1;
            comment.likedBy.push(userId);
          }
        }),
      unlikeComment: (collectionId, commentId, userId) =>
        set((state) => {
            const comment = state.comments[collectionId]?.find((c) => c.id === commentId);
          if (comment && comment.likedBy.includes(userId)) {
            comment.likes -= 1;
            comment.likedBy = comment.likedBy.filter((id: string) => id !== userId);
          }
        }),
      deleteComment: (collectionId, commentId) =>
        set((state) => {
          if (state.comments[collectionId]) {
            state.comments[collectionId] = state.comments[collectionId].filter(
              (c: Comment) => c.id !== commentId
            );
          }
        }),
    },
  }))
);
