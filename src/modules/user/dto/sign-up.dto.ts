import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignUpDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiModelProperty({ required: true, type: String })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  password: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  deviceToken: string;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty({ required: true, type: Number })
  deviceType: number;
}
