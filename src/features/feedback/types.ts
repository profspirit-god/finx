export type FeedbackType = 'bug' | 'idea';

export type FeedbackRow = {
  id: string;
  type: FeedbackType;
  message: string;
  username: string | null;
  app_version: string | null;
  user_agent: string | null;
  handled: boolean;
  created_at: string;
};

export type FeedbackSubmission = {
  type: FeedbackType;
  message: string;
  username: string;
};