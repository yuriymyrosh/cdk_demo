import { Stack } from "aws-cdk-lib";
import { Construct } from "constructs";

export interface Buildable {
  build(): Construct
}