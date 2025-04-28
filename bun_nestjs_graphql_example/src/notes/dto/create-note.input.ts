import { InputType, Field, Int } from "@nestjs/graphql";
import { IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class CreateNoteInput {
  @Field(() => String, { description: "Note title" })
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @Field(() => String, { description: "Note content" })
  @IsNotEmpty()
  @MinLength(5)
  content: string;

  @Field(() => Int, { description: "User ID this note belongs to" })
  userId: number;
}
