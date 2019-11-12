import {importAll} from 'util'
export default {...importAll(require.context('./',true,/\.*/),/index$/)}