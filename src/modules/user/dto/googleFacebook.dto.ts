import { IsNotEmpty, IsString, IsEmail, IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class GoogleFacebookDto {

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiModelProperty({ required: true, type: String })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  image: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiModelProperty({ required: true, type: Number })
  type: number;
}
