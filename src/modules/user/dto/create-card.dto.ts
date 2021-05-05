import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateCardDto {

  @IsNotEmpty()
  @ApiModelProperty({ required: true })
  card: any;
}
