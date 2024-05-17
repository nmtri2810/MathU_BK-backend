import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_ABILITY,
  IRequiredRule,
} from '../decorators/abilities.decorator';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UsersService } from 'src/modules/users/users.service';
import { ForbiddenError } from '@casl/ability';
import { Action } from 'src/constants/enum';
import { Post } from 'src/modules/posts/entities/post.entity';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbility: CaslAbilityFactory,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const rules =
      this.reflector.get<IRequiredRule[]>(
        CHECK_ABILITY,
        context.getHandler(),
      ) || [];

    const request = context.switchToHttp().getRequest();
    const { userId } = request.user;
    const user = await this.usersService.findOne(userId);

    try {
      // const ability = this.caslAbility.createForUser(user);

      const article = new Post();
      article.user_id = user.id;

      const ability = this.caslAbility.createForUser(user);
      console.log(
        'src/common/guards/abilities.guard.ts#45: ',
        ability.can(Action.Update, article),
      ); // true temp

      article.user_id = 2;
      console.log(
        'src/common/guards/abilities.guard.ts#51: ',
        ability.can(Action.Update, article),
      ); // false

      rules.forEach((rule) => {
        ForbiddenError.from(ability)
          .setMessage('You are not allowed to perform this action')
          .throwUnlessCan(rule.action, rule.subject);
      });

      return true;
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException(error.message);
      }

      throw error;
    }
  }
}
