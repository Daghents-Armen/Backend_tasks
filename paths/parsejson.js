const parsed_json = require('./person.json');

console.log(parsed_json);
parsed_json.skills.push('painter');
parsed_json.name = 'alice';
console.log(parsed_json);

const updated_json = JSON.stringify(parsed_json);
console.log(updated_json);


const bf = Buffer.from('hello');

console.log(bf.toString('utf8'));

const hex = bf.toString('hex');
console.log(hex);

console.log(bf.toString('base64'));
const hex_to_buffer = Buffer.from(hex, 'hex');
const string = hex_to_buffer.toString('utf8')
console.log(string);

let buf = Buffer.alloc(5);
console.log(buf);
buf[0] = 76;
buf[1] = 77;

console.log(buf);











