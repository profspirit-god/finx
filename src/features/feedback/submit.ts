import { getFinxClient, isSupabaseConfigured } from '@/lib/supabase';
import type { FeedbackSubmission } from './types';

const APP_VERSION = '1.6.0.0';

export class FeedbackSubmitError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'FeedbackSubmitError';
  }
}

export async function submitFeedback(input: FeedbackSubmission): Promise<void> {
  if (!isSupabaseConfigured()) {
    throw new FeedbackSubmitError(
      'Feedback is not configured on this build. Please report the issue through the GitHub repository instead.',
    );
  }

  if (input.message.trim().length < 10) {
    throw new FeedbackSubmitError('Message must be at least 10 characters.');
  }
  if (input.message.length > 2000) {
    throw new FeedbackSubmitError('Message must be 2000 characters or fewer.');
  }

  const client = getFinxClient();

  const { error } = await client.from('feedback').insert({
    type: input.type,
    message: input.message.trim(),
    username: input.username.trim() || null,
    app_version: APP_VERSION,
    user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
  });

  if (error) {
    if (error.code === '42501' || error.message.includes('permission')) {
      throw new FeedbackSubmitError(
        'The feedback server refused the submission. Please try again later.',
        error,
      );
    }
    if (error.message.toLowerCase().includes('fetch') || error.message.toLowerCase().includes('network')) {
      throw new FeedbackSubmitError(
        'Could not reach the feedback server. Check your connection and try again, or copy your message and send it manually.',
        error,
      );
    }
    throw new FeedbackSubmitError(error.message, error);
  }
}