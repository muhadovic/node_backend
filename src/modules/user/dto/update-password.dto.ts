import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  newPassword: string;
}
