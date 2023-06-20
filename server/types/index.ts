type Role = 'system' | 'user' | 'assistant';

export interface ChatGptMessage {
  role: Role;
  content: string;
}

export interface ChatGptResponse {
  id: string;
  object: 'chat.session';
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: {
    message: ChatGptMessage;
    finish_reason: string;
    index: number;
  }[];
}
