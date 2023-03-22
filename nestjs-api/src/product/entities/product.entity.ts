import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Product {
  @Field(() => Int)
  pid!: number;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  price!: number;
}
