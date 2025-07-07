'use client';

import { useState } from 'react';
import { createComment } from '@/lib/cosmic';

export interface CommentFormProps {
  photoId: string;
  onCommentSubmitted?: () => void;
}

export function CommentForm({ photoId, onCommentSubmitted }: CommentFormProps) {
  const [formData, setFormData] = useState({
    commenter_name: '',
    comment_text: '',
    commenter_email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.commenter_name.trim() || !formData.comment_text.trim()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createComment({
        commenter_name: formData.commenter_name.trim(),
        comment_text: formData.comment_text.trim(),
        photo_id: photoId,
        commenter_email: formData.commenter_email.trim()
      });
      
      setFormData({ commenter_name: '', comment_text: '', commenter_email: '' });
      setSubmitted(true);
      onCommentSubmitted?.();
      
      // Reset submitted state after 3 seconds
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="comment-form rounded-lg p-6 text-center">
        <div className="text-green-600 mb-2">
          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          Comment Submitted!
        </h3>
        <p className="text-green-700">
          Your comment has been submitted for moderation and will appear once approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="comment-form rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Leave a Comment
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="commenter_name" className="block text-sm font-medium text-gray-700 mb-2">
            Your Name *
          </label>
          <input
            type="text"
            id="commenter_name"
            name="commenter_name"
            value={formData.commenter_name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter your name"
          />
        </div>
        
        <div>
          <label htmlFor="commenter_email" className="block text-sm font-medium text-gray-700 mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            id="commenter_email"
            name="commenter_email"
            value={formData.commenter_email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment_text" className="block text-sm font-medium text-gray-700 mb-2">
          Your Comment *
        </label>
        <textarea
          id="comment_text"
          name="comment_text"
          value={formData.comment_text}
          onChange={handleChange}
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder="Share your thoughts about this photo..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !formData.commenter_name.trim() || !formData.comment_text.trim()}
        className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="loading-spinner" />
            Submitting...
          </>
        ) : (
          'Submit Comment'
        )}
      </button>
      
      <p className="text-xs text-gray-500 mt-2">
        Your comment will be reviewed before appearing on the site.
      </p>
    </form>
  );
}