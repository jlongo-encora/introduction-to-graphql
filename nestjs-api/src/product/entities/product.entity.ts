import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => Int)
  pid!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Float)
  price!: number;
}
