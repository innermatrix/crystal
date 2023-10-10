import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection';
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from 'postgraphile/adaptors/pg';

export default  {
    extends: [PostGraphileAmberPreset, PgSimplifyInflectionPreset],
    pgServices: [
		makePgService({
			connectionString: process.env.DATABASE_URL,
			schemas: ['public'],
		}),
	],

}