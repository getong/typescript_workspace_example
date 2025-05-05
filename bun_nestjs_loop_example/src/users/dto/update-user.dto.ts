import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "./create-user.dto.js"; // Note the .js extension for ESM compatibility

export class UpdateUserDto extends PartialType(CreateUserDto) {}
