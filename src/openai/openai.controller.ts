import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateChatCompletionRequest } from './dto/create-chat-completion.dto';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@Controller('openai')
@ApiTags('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat-completion')
  @ApiBody({
    type: CreateChatCompletionRequest,
    examples: {
      messages: {
        value: {
          messages: [
            {
              role: 'user',
              content: 'Hello chatGPT',
            },
          ],
        },
      },
    },
  })
  async createChatCompletion(@Body() body: CreateChatCompletionRequest) {
    return await this.openaiService.createChatCompletion(body.messages);
  }

  @Post('check-duplicate-questions')
  @ApiBody({
    type: CreateChatCompletionRequest,
    examples: {
      messages: {
        value: {
          messages: [
            {
              role: 'user',
              content: 'title of question',
            },
          ],
        },
      },
    },
  })
  async checkDuplicateQuestions(@Body() body: CreateChatCompletionRequest) {
    return await this.openaiService.checkDuplicateQuestions(body.messages);
  }
}
