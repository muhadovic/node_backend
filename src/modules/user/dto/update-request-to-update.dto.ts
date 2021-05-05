import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RequestToUpdateDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  id: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty({ required: true, type: Number })
  status: number;
}
