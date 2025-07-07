import { format } from 'date-fns';
import { Comment } from '@/types';

export interface CommentListProps {
  comments: Comment[];
  showModeration?: boolean;
}

export function CommentList({ comments, showModeration = false }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">💬</div>
        <p>No comments yet. Be the first to share your thoughts!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-semibold">
                {comment.metadata.commenter_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">
                  {comment.metadata.commenter_name}
                </h4>
                <time className="text-xs text-gray-500" dateTime={comment.metadata.comment_date}>
                  {format(new Date(comment.metadata.comment_date), 'MMM d, yyyy')}
                </time>
              </div>
            </div>
            
            {showModeration && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                comment.metadata.moderation_status.key === 'approved' ? 'status-approved' :
                comment.metadata.moderation_status.key === 'rejected' ? 'status-rejected' :
                'status-pending'
              }`}>
                {comment.metadata.moderation_status.value}
              </span>
            )}
          </div>
          
          <p className="text-gray-700 leading-relaxed responsive-text">
            {comment.metadata.comment_text}
          </p>
        </div>
      ))}
    </div>
  );
}