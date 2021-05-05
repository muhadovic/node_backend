import { IsNotEmpty, IsString, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GetUserPageDto {

  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty({ required: true, type: Number })
  page: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  name: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  nickName: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  email: number;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  phoneNumber: number;
}
