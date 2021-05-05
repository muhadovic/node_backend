import { IsNotEmpty, IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class SignInDto {

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
  @ApiModelProperty({ required: false, type: String })
  deviceToken: string;

  @IsOptional()
  @IsNumber()
  @ApiModelProperty({ required: false, type: Number })
  deviceType: number;
}
