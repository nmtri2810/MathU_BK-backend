import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  MongoAbility,
} from '@casl/ability';
import { PrismaQuery, createPrismaAbility } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Action, Role } from 'src/constants/enum';
import { Comment } from 'src/modules/comments/entities/comment.entity';
import { Post } from 'src/modules/posts/entities/post.entity';
import { Tag } from 'src/modules/tags/entities/tag.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Vote } from 'src/modules/votes/entities/vote.entity';

export type Subjects = InferSubjects<
  typeof User | typeof Post | typeof Comment | typeof Vote | typeof Tag | 'all'
>;

export type AppAbility = MongoAbility<[Action, Subjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    // Should have permissions table, but this small project doesn't need it
    const userId = user.id;
    const userRole = user.role_id;

    switch (userRole) {
      case Role.ADMIN:
        can(Action.Manage, 'all');

        break;
      case Role.MODERATOR:
        can(Action.Manage, Vote);
        can(Action.Read, 'all');
        can(Action.Create, [Post, Comment, Vote], { user_id: userId });
        can(Action.Update, [Post, Comment, Vote], { user_id: userId });
        can(Action.Update, User, { id: userId });
        can(Action.Delete, [Post, Comment, Vote], { user_id: userId });

        break;
      case Role.USER:
        can(Action.Manage, Vote);
        can(Action.Read, 'all');
        can(Action.Create, [Post, Comment, Vote], { user_id: userId });
        can(Action.Update, [Post, Comment, Vote], { user_id: userId });
        can(Action.Update, User, { id: userId });
        can(Action.Delete, [Post, Comment, Vote], { user_id: userId });

        break;
      default:
        cannot(Action.Manage, 'all');
    }

    return build({
      // Read https://casl.js.org/v6/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
