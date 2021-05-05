import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SendCodeDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  phoneNumber: string;
}
