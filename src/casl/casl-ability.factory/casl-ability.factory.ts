import {
  AbilityBuilder,
  ExtractSubjectType,
  ForbiddenError,
  InferSubjects,
  MongoAbility,
  createAliasResolver,
  createMongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Messages } from 'src/constants';
import { Action, Role } from 'src/constants/enum';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Vote } from 'src/modules/votes/entities/vote.entity';

export type Subjects =
  | InferSubjects<
      typeof User | typeof Post | typeof Comment | typeof Vote | typeof Tag
    >
  | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

const resolveAction = createAliasResolver({
  modify_itself: [Action.Create, Action.Update, Action.Delete],
});

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createMongoAbility,
    );

    // Should have permissions table, but this small project doesn't need it
    const userId = user.id;
    const userRole = user.role_id;

    switch (userRole) {
      case Role.ADMIN:
        can(Action.Manage, 'all');
        break;
      case Role.MODERATOR:
        can(Action.Manage, Tag);
        can(Action.Read, 'all');
        can(Action.Update, User, { id: { $eq: userId } });
        can(Action.Modify_Itself, [Post, Comment, Vote], {
          user_id: { $eq: userId },
        });
        cannot(Action.Delete, User);
        break;
      case Role.USER:
        can(Action.Read, 'all');
        can(Action.Update, User, { id: { $eq: userId } });
        can(Action.Modify_Itself, [Post, Comment, Vote], {
          user_id: { $eq: userId },
        });
        cannot(Action.Delete, User);
        break;
      default:
        can(Action.Read, [Post, Comment, Vote]);
    }

    return build({
      resolveAction,
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  async isSubjectForbidden(
    currentUser: User,
    action: Action,
    subjectClass: any,
    subject: any,
  ) {
    const ability = this.createForUser(currentUser);

    ForbiddenError.from(ability)
      .setMessage(Messages.NOT_ALLOWED)
      .throwUnlessCan(action, Object.assign(new subjectClass(), subject));
  }
}
