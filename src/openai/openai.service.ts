import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { ChatCompletionMessageDto } from './dto/create-chat-completion.dto';
import { ChatCompletionMessageParam } from 'openai/resources';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class OpenaiService {
  constructor(
    private readonly openai: OpenAI,
    private readonly prisma: PrismaService,
  ) {}

  async createChatCompletion(messages: ChatCompletionMessageDto[]) {
    return await this.openai.chat.completions.create({
      messages: messages as ChatCompletionMessageParam[],
      model: 'gpt-4o',
    });
  }

  async checkDuplicateQuestions(messages: ChatCompletionMessageDto[]) {
    const questionList = await this.prisma.questions.findMany({
      select: {
        id: true,
        title: true,
      },
    });

    const checkMsg = `So sánh tiêu đề "${messages[0].content}" với từng tiêu đề (title) trong mảng được chuỗi hóa (stringify) dưới đây ${JSON.stringify(questionList)} và xem có những tiêu đề nào có nội dung tương tự. Nếu có, trả lại dữ liệu tương tự được chuỗi hóa (stringify) với định dạng sau: [{id: id, title: title},...] và chỉ cần trả về dữ liệu, chỉ trả về tối đa 3 phần tử nếu nhiều hơn, và không cần nói gì thêm. Nếu không, trả lại dữ liệu với định dạng: "[]", không cần nói gì thêm.`;
    const askMsgs = messages.map((msg) => ({
      role: msg.role,
      content: checkMsg,
    }));

    console.log('src_openai_openai.service.ts#30: ', askMsgs);
    const aiRes = await this.createChatCompletion(askMsgs);
    return aiRes.choices[0].message;
  }
}
