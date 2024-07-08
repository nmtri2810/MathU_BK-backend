import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.dto';
import { ChatCompletionMessageParam } from 'openai/resources';
import { QuestionsService } from 'src/modules/questions/questions.service';

@Injectable()
export class OpenaiService {
  constructor(
    private readonly openai: OpenAI,
    private readonly questionService: QuestionsService,
  ) {}

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    return await this.openai.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: 'gpt-4o',
    });
  }

  async checkDuplicateQuestions(messages: ChatCompletionMessageDto[]) {
    const questionList = await this.questionService.findAll(1, 100000, '');

    const checkMsg = `So sánh tiêu đề "${messages[0].content}" với từng tiêu đề (title: "") trong mảng dưới đây ${JSON.stringify(questionList.list)} và xem có những tiêu đề nào có nội dung tương tự. Nếu có, trả lại mảng những giá trị tương đồng.`;
    const askMsgs = messages.map((msg) => ({
      role: msg.role,
      content: checkMsg,
    }));

    console.log('src_openai_openai.service.ts#30: ', askMsgs);
    const aiRes = await this.createChatCompletion(askMsgs);
    return aiRes;
  }
}
