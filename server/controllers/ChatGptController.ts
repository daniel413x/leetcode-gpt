import { Request, Response } from 'express';
import openai from '../config/openai';
import { generateProblemPrompt } from '../data/consts';
import { handleGptJson } from '../utils';

class ChatGptController {
  async getChatGptMessages(messages) {
    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 2000,
      temperature: 0.4,
    });
    return response;
  }

  async generatePage(req: Request, res: Response) {
    const {
      prevProblems,
      difficulty,
      category,
    } = req.body;
    const messages = [];
    let prompt = generateProblemPrompt;
    if (prevProblems) {
      prompt = `${prompt} You must not generate a problem that has a title that coincides with a title from the following list: ${prevProblems}.`;
    }
    if (difficulty) {
      prompt = `${prompt} Generate a problem of "${difficulty}" difficulty.`;
    }
    if (category) {
      prompt = `${prompt} Generate a problem from the "${category}" category.`;
    }
    messages.push({
      role: 'system',
      content: prompt,
    });
    messages.push({
      role: 'user',
      content: 'Generate a unique Leetcode problem',
    });
    const data = await this.getChatGptMessages(messages);
    const { content } = data.data.choices[0].message;
    const safeJson = handleGptJson(content);
    return res.json(safeJson);
  }
}

export default new ChatGptController();
