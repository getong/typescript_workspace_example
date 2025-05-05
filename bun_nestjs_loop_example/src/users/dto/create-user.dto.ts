// Define the class once and export it properly
export class CreateUserDto {
  email: string;
  name: string;
  password?: string;
}

// Also export as default for maximum compatibility
export default CreateUserDto;
