import ErrorStackParser from 'error-stack-parser';

export function ErrorStackParserFunction(exseption: any) {
  let stack: string[] = [];
  ErrorStackParser.parse(exseption).forEach((item) => {
    if (!item.fileName?.includes('node_modules') && item.functionName) {
      stack.push(item.functionName);
    }
  });
  return stack;
}
