import { IsNotEmpty, IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class NotificationDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  id: string;

  @IsNotEmpty()
  @ApiModelProperty({ required: true, type: Boolean })
  notification: boolean;
}
