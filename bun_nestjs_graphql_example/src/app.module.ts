import { Module } from "@nestjs/common";
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig} from '@nestjs/apollo';
import { join } from 'path';

@Module({
    imports: [
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: true,
            sortSchema: true,
            graphiql: true,
            playground: true,
        }),
        UsersModule],
})
export class AppModule {}
