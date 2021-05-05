import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateEmailDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  oldEmail: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  newEmail: string;
}
