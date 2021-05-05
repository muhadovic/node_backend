import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  firstName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  lastName: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  address: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  email: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  country: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  state: string;

  @IsOptional()
  @IsString()
  @ApiModelProperty({ required: false, type: String })
  zipCode: String;

  @IsOptional()
  @ApiModelProperty({ required: false, example: {type: 'Point', coordinates: [0,0]} })
  location: any;

  @IsOptional()
  @ApiModelProperty({ required: false })
  advertisements: string[];
}
