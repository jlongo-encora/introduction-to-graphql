import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Product } from "src/product/entities/product.entity";

@ObjectType()
export class User {
  @Field(() => Int)
  uid!: number;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Int, { nullable: true })
  age?: number;

  @Field(() => [Product])
  purchases: Product[];
}
