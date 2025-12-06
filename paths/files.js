const path = require("node:path");


console.log(path.basename(__dirname));
const base_name = path.basename(__filename);
console.log(base_name);
const ext_name = path.extname(__filename);
console.log(ext_name);

const path_segment = path.resolve('src', 'utils', 'data.json');
console.log(path_segment);




