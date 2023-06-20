import { GeneratedProblemForm } from '@/utils/types/problem';
import { $authHost } from './index';

class ChatGptService {
  static async generateProblem({
    prevProblems,
    difficulty,
    category,
  }: GeneratedProblemForm): Promise<string> {
    const { data } = await $authHost.post<string>('chatgpt', {
      prevProblems,
      difficulty,
      category,
    });
    return data;
  }
}

export default ChatGptService;
