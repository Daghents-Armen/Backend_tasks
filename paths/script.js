const path = require('node:path');

const filename_path = path.basename(__filename);

console.log(filename_path);

const normalized_path = path.normalize('/users///admin///comments');
console.log(normalized_path);
const parsed = path.parse(normalized_path);
console.log(parsed);

const reconstructed = path.format(parsed);

console.log(reconstructed);


