import { Module, Logger } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      graphiql: true,
      playground: true,
      formatError: (error) => {
        const logger = new Logger("GraphQL");
        logger.error(
          `GraphQL Error: ${error.message}`,
          error.extensions?.exception?.stacktrace,
        );
        return error;
      },
    }),
  ],
  exports: [GraphQLModule],
})
export class GraphqlModule {}
