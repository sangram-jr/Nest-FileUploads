import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCollectionDto {
    @IsNotEmpty()
    name!: string;

    @IsOptional()
    description?: string;
}
