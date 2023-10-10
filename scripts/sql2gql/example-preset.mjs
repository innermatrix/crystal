import { PgSimplifyInflectionPreset } from '@graphile/simplify-inflection';
import { PostGraphileConnectionFilterPreset } from 'postgraphile-plugin-connection-filter';
import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from 'postgraphile/adaptors/pg';

export default  {
    extends: [PostGraphileAmberPreset, PgSimplifyInflectionPreset, PostGraphileConnectionFilterPreset],
    pgServices: [
		makePgService({
			connectionString: process.env.DATABASE_URL,
			schemas: ['public'],
		}),
	],

}