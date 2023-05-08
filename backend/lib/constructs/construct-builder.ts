import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface ConstructBuilder {
  build(): Construct
}