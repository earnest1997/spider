import {importAll} from 'util'
export const img={...importAll(require.context('./',false,/.*/))}