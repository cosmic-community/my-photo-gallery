'use client';

import { useState } from 'react';
import { Comment, ModerationStatus } from '@/types';
import { AdminCommentCard } from '@/components/AdminCommentCard';
import { updateCommentStatus } from '@/lib/cosmic';

export interface AdminDashboardProps {
  comments: Comment[];
}

export function AdminDashboard({ comments: initialComments }: AdminDashboardProps) {
  const [comments, setComments] = useState(initialComments);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusChange = async (commentId: string, status: ModerationStatus) => {
    setIsUpdating(commentId);
    
    try {
      await updateCommentStatus(commentId, status);
      
      // Update local state
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? {
              ...comment,
              metadata: {
                ...comment.metadata,
                moderation_status: { key: status, value: status.charAt(0).toUpperCase() + status.slice(1) }
              }
            }
          : comment
      ));
    } catch (error) {
      console.error('Error updating comment status:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true;
    return comment.metadata.moderation_status.key === filter;
  });

  const pendingCount = comments.filter(c => c.metadata.moderation_status.key === 'pending').length;
  const approvedCount = comments.filter(c => c.metadata.moderation_status.key === 'approved').length;
  const rejectedCount = comments.filter(c => c.metadata.moderation_status.key === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-gray-800">{comments.length}</div>
          <div className="text-sm text-gray-600">Total Comments</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary text-primary-foreground'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 text-xs">
                ({status === 'pending' ? pendingCount : status === 'approved' ? approvedCount : rejectedCount})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {filteredComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">💬</div>
            <p>No comments found for the selected filter.</p>
          </div>
        ) : (
          filteredComments.map((comment) => (
            <AdminCommentCard
              key={comment.id}
              comment={comment}
              onStatusChange={handleStatusChange}
              isUpdating={isUpdating === comment.id}
            />
          ))
        )}
      </div>
    </div>
  );
}