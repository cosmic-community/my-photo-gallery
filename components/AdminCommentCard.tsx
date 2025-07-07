import { format } from 'date-fns';
import { Comment, ModerationStatus } from '@/types';

export interface AdminCommentCardProps {
  comment: Comment;
  onStatusChange: (commentId: string, status: ModerationStatus) => void;
  isUpdating?: boolean;
}

export function AdminCommentCard({ comment, onStatusChange, isUpdating = false }: AdminCommentCardProps) {
  const handleStatusChange = (status: ModerationStatus) => {
    onStatusChange(comment.id, status);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold">
            {comment.metadata.commenter_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {comment.metadata.commenter_name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <time dateTime={comment.metadata.comment_date}>
                {format(new Date(comment.metadata.comment_date), 'MMM d, yyyy')}
              </time>
              {comment.metadata.commenter_email && (
                <>
                  <span>•</span>
                  <span>{comment.metadata.commenter_email}</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          comment.metadata.moderation_status.key === 'approved' ? 'status-approved' :
          comment.metadata.moderation_status.key === 'rejected' ? 'status-rejected' :
          'status-pending'
        }`}>
          {comment.metadata.moderation_status.value}
        </span>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">
          {comment.metadata.comment_text}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src={`${comment.metadata.photo.metadata.photo.imgix_url}?w=60&h=60&fit=crop&auto=format,compress`}
            alt={comment.metadata.photo.title}
            width={30}
            height={30}
            className="rounded-md"
          />
          <div className="text-sm">
            <div className="font-medium text-gray-800">
              {comment.metadata.photo.title}
            </div>
            <div className="text-gray-500 text-xs">
              {format(new Date(comment.metadata.photo.metadata.upload_date), 'MMM d, yyyy')}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {comment.metadata.moderation_status.key !== 'approved' && (
            <button
              onClick={() => handleStatusChange('approved')}
              disabled={isUpdating}
              className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Approve'}
            </button>
          )}
          
          {comment.metadata.moderation_status.key !== 'rejected' && (
            <button
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
              className="bg-red-100 text-red-800 hover:bg-red-200 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Reject'}
            </button>
          )}
          
          {comment.metadata.moderation_status.key !== 'pending' && (
            <button
              onClick={() => handleStatusChange('pending')}
              disabled={isUpdating}
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-3 py-1 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isUpdating ? 'Updating...' : 'Pending'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}