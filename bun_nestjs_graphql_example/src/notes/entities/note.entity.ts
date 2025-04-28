import { ObjectType, Field, Int } from "@nestjs/graphql";
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { User } from "../../users/entities/user.entity";

@Entity()
@ObjectType()
export class Note {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: "Note identifier" })
  id: number;

  @Column()
  @Field(() => String, { description: "Note title" })
  title: string;

  @Column()
  @Field(() => String, { description: "Note content" })
  content: string;

  @Column({ nullable: true })
  @Field(() => Int, { description: "User ID this note belongs to" })
  userId: number;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  @Field(() => User, { description: "User who owns this note", nullable: true })
  user?: User;

  @Column({ type: "datetime", default: () => "CURRENT_TIMESTAMP" })
  @Field(() => Date, { description: "Creation timestamp" })
  createdAt: Date;
}
