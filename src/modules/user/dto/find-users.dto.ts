import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class FindByRadiusDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty({ required: true, type: Number })
  radius: number;

  @IsOptional()
  @ApiModelProperty({ required: true, example: [0, 0] })
  coordinates: any;
}
