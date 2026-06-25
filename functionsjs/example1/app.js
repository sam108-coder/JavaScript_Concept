import subtract, { PI, add } from './math.js'; // Named imports
import subtractAlias from './math.js'; // Default import (can be renamed)

console.log(PI);
console.log(add(5, 9));
console.log(subtractAlias(14, 9));

// Import all as an object
import * as MathFunction from './math.js';
console.log(MathFunction.PI);
console.log(add(8,0));
console.log(subtract(6,7));

