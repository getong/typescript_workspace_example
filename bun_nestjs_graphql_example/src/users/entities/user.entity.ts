import { ObjectType, Field, Int } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field(() => Int, { description: "User identifier" })
  id: number;

  @Column()
  @Field(() => String, { description: "User name" })
  name: string;

  @Column()
  @Field(() => String, { description: "User email address" })
  email: string;
}
