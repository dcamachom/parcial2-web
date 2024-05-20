import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class SocioDto {
    @IsString()
    @IsNotEmpty()
    readonly usuario:string;

    @IsString()
    @IsNotEmpty()
    readonly correo:string;

    @IsDate()
    @IsNotEmpty()
    readonly fechaNacimiento:string;
}
