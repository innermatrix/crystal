import { PostGraphileAmberPreset } from "postgraphile/presets/amber";
import { makePgService } from 'postgraphile/adaptors/pg';

export default  {
    extends: [PostGraphileAmberPreset],
    pgServices: [
		makePgService({
			connectionString: process.env.DATABASE_URL,
			schemas: ['public'],
		}),
	],

}