import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CheckCodeDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  code: string;
}
