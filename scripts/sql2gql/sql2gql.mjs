#!/usr/bin/env -S npx -s zx

import 'zx/globals';

import assert from "assert"
import 'fs'
import { printSchema } from 'graphql';
import { inspect } from 'util';
import {makeSchema} from '../../postgraphile/postgraphile/dist/index.js'
import { formatSdl } from 'format-graphql';

const [sqlFile, presetFile, gqlFile] = argv._

if (!sqlFile || !presetFile || !gqlFile) {
    console.log("Usage: yarn build && ( cd scripts/sql2gql && ./sql2gql.mjs sql-file ./preset-file gql-file )")
    console.log("\tsql-file: path to a PostgresQL schema input file, relative to sql2gql")
    console.log("\tpreset-file: path to a Postgraphile preset, relative to sql2gql (*must* be a relative path)")
    console.log("\tsql-file: path to a GraphQL schema output file, relative to sql2gql")
    process.exit(1)
}

// Start postgres in docker
const postgresPort = process.env.POSTGRES_PORT ?? '5432';
const dockerPostgres = await $`docker run -d -ePOSTGRES_PASSWORD=postgres -p${postgresPort}:5432 postgres`.stdio('ignore')

var startupComplete = false

try {
    // Wait 10s for the server to finish starting up
    for(var i = 0; i < 5; i += 1) {
        await sleep(2000);
        const dockerPsql = $`docker exec -i -e PGPASSWORD=postgres ${dockerPostgres} psql --host localhost --user postgres -t --command 'select version()'`.stdio('ignore', 'pipe', 'pipe')
        try {
            await dockerPsql
            startupComplete = true
            break
        } catch (err) {
            console.log("Waiting for server…")
        }
    }

    if (!startupComplete) {
        throw new Error("Server failed to start")
    }

    console.log("Postgres server started")
    console.log("Loading Postgres schema")

    await $`docker exec -i -e PGPASSWORD=postgres ${dockerPostgres} psql --host localhost --user postgres -t < ${sqlFile}`.stdio('inherit', 'inherit', 'inherit')
    
    console.log("Postgres schema loaded")
    console.log("Loading Postgraphile preset")

    process.env.DATABASE_URL = `postgres://postgres:postgres@localhost:${postgresPort}/postgres`
    const {default: preset} = await import(presetFile)

    console.log("Postgraphile preset loaded")
    console.log("Generating GraphQL schema")

	const { schema } = await makeSchema(preset);

    fs.writeFileSync(gqlFile, formatSdl(printSchema(schema)))

    console.log("GraphQL schema generated")
} finally {
    await $`docker kill ${dockerPostgres}`
    if (!startupComplete) {
        console.log("Postgres server output:")
        await $`docker logs ${dockerPostgres}`.stdio('inherit', 'inherit', 'inherit')
    }
}