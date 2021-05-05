import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateWalletPasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  newPassword: string;
}
