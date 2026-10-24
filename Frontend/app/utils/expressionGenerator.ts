import type { PracticeSettings } from '~/composables/usePracticeSettings';

export interface GeneratedQuestion {
  id: string;
  expressionStr: string;
  displayStr: string;
  correctAnswer: number;
  operands: number[];
  operators: string[];
}

/**
 * Returns a random integer between min and max (inclusive).
 */
function randomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

/**
 * Maps operation names to mathematical symbols.
 */
const OP_SYMBOLS: Record<string, string> = {
  addition: '+',
  subtraction: '−', // Mathematical minus sign (U+2212)
  multiplication: '×',
  division: '÷',
};

/**
 * Picks a random operation name from a list, weighted by the weights map.
 * Operations with higher weights are chosen more often.
 * Falls back to uniform random if no valid weights are found.
 */
function weightedRandomOp(ops: string[], weights: Record<string, number>): string {
  const totalWeight = ops.reduce((sum, op) => sum + Math.max(0, weights[op] ?? 5), 0);
  if (totalWeight === 0) return ops[randomInt(0, ops.length - 1)];
  let rand = Math.random() * totalWeight;
  for (const op of ops) {
    rand -= Math.max(0, weights[op] ?? 5);
    if (rand <= 0) return op;
  }
  return ops[ops.length - 1];
}

/**
 * Generates a valid mental math expression matching the user's practice settings.
 */
export function generateQuestion(settings: PracticeSettings): GeneratedQuestion {
  const {
    operations = ['addition'],
    operationWeights = {},
    minValue = 1,
    maxValue = 100,
    allowNegative = false,
    operands: operandCount = 3,
  } = settings;

  const validOps = operations.length > 0 ? operations : ['addition'];
  const count = Math.max(2, operandCount);

  // Generate for addition & subtraction (pure Anzan chain)
  const isPureAddSub = validOps.every(op => op === 'addition' || op === 'subtraction');

  if (isPureAddSub) {
    const nums: number[] = [];
    const ops: string[] = [];
    let currentVal = randomInt(minValue, maxValue);
    nums.push(currentVal);

    for (let i = 1; i < count; i++) {
      const selectedOpName = weightedRandomOp(validOps, operationWeights);
      const symbol = OP_SYMBOLS[selectedOpName] || '+';

      if (symbol === '+') {
        const nextNum = randomInt(minValue, maxValue);
        nums.push(nextNum);
        ops.push('+');
        currentVal += nextNum;
      } else {
        const nextNum = randomInt(minValue, maxValue);
        nums.push(nextNum);
        if (!allowNegative && currentVal - nextNum < 0) {
          ops.push('+');
          currentVal += nextNum;
        } else {
          ops.push('−');
          currentVal -= nextNum;
        }
      }
    }

    let expressionStr = `${nums[0] < 0 ? '−' + Math.abs(nums[0]) : nums[0]}`;
    for (let i = 0; i < ops.length; i++) {
      expressionStr += ` ${ops[i]} ${nums[i + 1]}`;
    }

    return {
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      expressionStr,
      displayStr: expressionStr,
      correctAnswer: currentVal,
      operands: nums,
      operators: ops,
    };
  }

  // Generalized generator for mixed operations (including Multiplication and Division)
  const nums: number[] = [];
  const ops: string[] = [];

  let firstNum = randomInt(minValue, Math.min(maxValue, 50));
  nums.push(firstNum);

  for (let i = 1; i < count; i++) {
    const selectedOpName = weightedRandomOp(validOps, operationWeights);
    const symbol = OP_SYMBOLS[selectedOpName] || '+';

    if (symbol === '+') {
      const nextNum = randomInt(minValue, maxValue);
      nums.push(nextNum);
      ops.push('+');
    } else if (symbol === '−' || symbol === '-') {
      let nextNum = randomInt(minValue, maxValue);
      nums.push(nextNum);
      ops.push('−');
    } else if (symbol === '×') {
      // Keep multiplication operands reasonable for mental calculation
      const multMax = Math.min(maxValue, 12);
      const nextNum = randomInt(Math.max(2, minValue), Math.max(2, multMax));
      nums.push(nextNum);
      ops.push('×');
    } else if (symbol === '÷') {
      // Create clean integer division
      const divisor = randomInt(2, Math.min(12, Math.max(2, maxValue)));
      // Adjust previous operand to be a multiple of divisor
      const prev = nums[nums.length - 1];
      const adjustedPrev = Math.max(divisor, Math.floor(prev / divisor) * divisor) || divisor * 2;
      nums[nums.length - 1] = adjustedPrev;
      nums.push(divisor);
      ops.push('÷');
    }
  }

  // Build display expression and calculate true evaluation
  let displayStr = `${nums[0] < 0 ? '−' + Math.abs(nums[0]) : nums[0]}`;
  let evalExpression = `${nums[0]}`;

  for (let i = 0; i < ops.length; i++) {
    const op = ops[i];
    const displayOp = (op === '-' || op === '−') ? '−' : op;
    displayStr += ` ${displayOp} ${nums[i + 1]}`;
    const jsOp = op === '×' ? '*' : op === '÷' ? '/' : (op === '−' || op === '-') ? '-' : op;
    evalExpression += ` ${jsOp} ${nums[i + 1]}`;
  }

  // Calculate answer safely using standard left-to-right or standard precedence
  let calculatedAnswer = 0;
  try {
    // eslint-disable-next-line no-eval
    calculatedAnswer = Function(`"use strict"; return (${evalExpression})`)();
  } catch {
    calculatedAnswer = nums[0];
  }

  // If allowNegative is false and result is negative, adjust first number
  if (!allowNegative && calculatedAnswer < 0) {
    const adjustment = Math.abs(calculatedAnswer) + randomInt(1, 10);
    nums[0] += adjustment;
    displayStr = `${nums[0] < 0 ? '−' + Math.abs(nums[0]) : nums[0]}`;
    evalExpression = `${nums[0]}`;
    for (let i = 0; i < ops.length; i++) {
      const op = ops[i];
      const displayOp = (op === '-' || op === '−') ? '−' : op;
      displayStr += ` ${displayOp} ${nums[i + 1]}`;
      const jsOp = op === '×' ? '*' : op === '÷' ? '/' : (op === '−' || op === '-') ? '-' : op;
      evalExpression += ` ${jsOp} ${nums[i + 1]}`;
    }
    // eslint-disable-next-line no-eval
    calculatedAnswer = Function(`"use strict"; return (${evalExpression})`)();
  }

  return {
    id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    expressionStr: evalExpression,
    displayStr,
    correctAnswer: Math.round(calculatedAnswer * 100) / 100, // round to 2 decimal places if any
    operands: nums,
    operators: ops,
  };
}

/**
 * Generates a batch of questions for a complete practice session.
 */
export function generateQuestionBatch(settings: PracticeSettings, count = 5): GeneratedQuestion[] {
  const batch: GeneratedQuestion[] = [];
  for (let i = 0; i < count; i++) {
    batch.push(generateQuestion(settings));
  }
  return batch;
}

