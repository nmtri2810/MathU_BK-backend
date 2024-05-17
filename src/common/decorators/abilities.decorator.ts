import { SetMetadata } from '@nestjs/common';
import { Subjects } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/constants/enum';

export const CHECK_ABILITY = 'check_ability';

export interface IRequiredRule {
  action: Action;
  subject: Subjects;
}

export const CheckAbilites = (...requirements: IRequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
