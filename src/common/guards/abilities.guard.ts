import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import {
  CHECK_ABILITY,
  IRequiredRule,
} from '../decorators/abilities.decorator';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UsersService } from 'src/modules/users/users.service';
import { ForbiddenError } from '@casl/ability';
import { Messages } from 'src/constants';

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

    const ability = this.caslAbility.createForUser(user);
    rules.forEach((rule) => {
      ForbiddenError.from(ability)
        .setMessage(Messages.NOT_ALLOWED)
        .throwUnlessCan(rule.action, rule.subject);
    });

    return true;
  }
}
