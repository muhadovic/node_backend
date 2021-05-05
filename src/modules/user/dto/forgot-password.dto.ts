import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiModelProperty({ required: true, type: String })
  email: string;
}
