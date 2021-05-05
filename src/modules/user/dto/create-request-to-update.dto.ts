import { IsNotEmpty, IsString, IsNumber } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CreateRequestToUpdateDto {

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  country: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  city: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  state: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  country_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  state_code: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  address: string;

  @IsNotEmpty()
  @IsString()
  @ApiModelProperty({ required: true, type: String })
  zipCode: string;
}
