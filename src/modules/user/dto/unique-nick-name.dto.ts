import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UniqueNickNameDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  nickName: string;
}
