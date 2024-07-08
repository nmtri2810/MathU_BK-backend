import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateChatCompletionRequest } from './dto/create-chat-completion.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@Controller('openai')
@ApiTags('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('chat-completion')
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
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
  @UseGuards(AccessTokenGuard)
  @ApiBearerAuth()
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
