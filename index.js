'use strict';

// Operators table
const OPS = {
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '-': (a, b) => a - b,
    '+': (a, b) => a + b
}

// Operator precedence
const PRECEDENCE = ['*', '/'];

// Helpers
let get_precedence_fn = (op) => {
    return PRECEDENCE.indexOf(op) !== -1 ? 'unshift' : 'push';
}

// Parser
let parse_input = (input) => {
    // initialize parsing vars 
    let operands = [];
    let operators = [];
    let op_keys = Object.keys(OPS);
    let operand = '';
    let last_op;

    // remove all whitespace
    input = input.replace(/\s+/, '');

    // tokenize input
    for (let i = 0; i < input.length; i++) {
        if (op_keys.indexOf(input[i]) !== -1) {
            // determine if token is operator
            last_op = input[i];
            // precedence check to determine order of operations
            let fn = get_precedence_fn(last_op);
            operators[fn](last_op);
            let parsed_operand = parseFloat(operand, 10);
            if (isNaN(parsed_operand) || typeof parsed_operand !== 'number') {
                return new Error('invalid operand at character ' + i);
            }
            operands[fn](parsed_operand);
            operand = '';
        } else {
            operand += input[i];
            if (input.length === (i + 1)) {
                // determine if last operand
                let fn = get_precedence_fn(last_op);
                let parsed_operand = parseFloat(operand, 10);
                if (isNaN(parsed_operand) || typeof parsed_operand !== 'number') {
                    return new Error('invalid operand at character ' + i);
                }
                operands[fn](parsed_operand);
            }
        }
    }
    return { operands, operators };
};
    

// NOTE: this isn't quite working, but the idea is that this would recursively
// calculate based on the parsed operators/operands with the proper order
// determined in parse_input
let recursive_calc = (operators, operands) => {
    if (operators.length === 1) {
        return OPS[operators[0]](operands.shift(), operands.shift());
    } else {
        let new_operators = [];
        let new_operands = [];
        for (let i = 0; i < operators.length; i++) {
            if (i % 2 === 1) {
                new_operators.push(operators[i]);
                if (operands.length === 1) {
                    new_operands.push(operands[0]);
                }
            } else {
                let a = operands.shift();
                let b = operands.shift();
                if (b) {
                    new_operands.push(OPS[operators[i]](a, b));
                } else {
                    new_operands.push(a);
                }
            }
        }
        return recursive_calc(new_operators, new_operands);
    }
};

let calculate = (input) => {
    let parsed = parse_input(input);
    if (parsed instanceof Error) {
        console.log(parsed.message);
        return;
    }
    console.log(recursive_calc(parsed.operators, parsed.operands));
};

////////////////////////////////
// CLI                        //
////////////////////////////////

// NOTE: did not have time to do proper CLI validation :(

const input = process.argv.slice(2)[0]
calculate(input);

