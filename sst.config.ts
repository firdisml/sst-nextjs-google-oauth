import { SSTConfig } from "sst";
import { NextjsSite, Api, Table, Auth } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "nextinside",
      region: "us-east-1",
    };
  },
  stacks(app) {

    app.stack(function Site({ stack }) {

      const table = new Table(stack, "users", {
        fields: {
          userId: "string",
        },
        primaryIndex: { partitionKey: "userId" },
      });



      // Create Api
      const api = new Api(stack, "api", {
        defaults: {
          function: {
            bind: [table],
          },
        },
        routes: {
          "GET /": "functions/lambda.handler",
          "GET /session": "functions/session.handler",
        },
      });


      const site = new NextjsSite(stack, "site", {
        bind: [api]
      });

      // Create Auth provider
      const auth = new Auth(stack, "auth", {
        authenticator: {
          handler: "functions/lambda.handler",
          bind: [site],
        },
      });
      auth.attach(stack, {
        api,
        prefix: "/auth",
      });

      stack.addOutputs({
        ApiUrl: api.url,
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
