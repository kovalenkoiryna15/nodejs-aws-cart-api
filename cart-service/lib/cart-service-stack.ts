import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as lambdaNodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { join } from 'path';
import { config } from 'dotenv';

config();

export class CartServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const cartHandler = new lambdaNodejs.NodejsFunction(
      this,
      "CartHandler",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        entry: join(__dirname, "./lambda/cart-handler.ts"),
        handler: "cartHandler",
        environment: {
          NODE_ENV: 'production'
        },
      }
    );

    const restApi = new apigw.RestApi(this, "Cart API", {
      restApiName: "Cart",
      defaultCorsPreflightOptions: {
        allowHeaders: ["*"],
        allowOrigins: ["*"],
        allowMethods: apigw.Cors.ALL_METHODS,
      },
      defaultIntegration: new apigw.LambdaIntegration(cartHandler)
    });

    const ping = restApi.root.addResource("ping");
    ping.addMethod(lambda.HttpMethod.GET);

    const api = restApi.root.addResource("api");

    const profile = api.addResource("profile");
    profile.addMethod(lambda.HttpMethod.GET);

    const cart = profile.addResource("cart");
    cart.addMethod(lambda.HttpMethod.GET);
    cart.addMethod(lambda.HttpMethod.PUT);
    cart.addMethod(lambda.HttpMethod.DELETE);

    const checkout = cart.addResource("checkout");
    checkout.addMethod(lambda.HttpMethod.POST);
  }
}
