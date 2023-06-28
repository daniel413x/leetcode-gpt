// eslint-disable-next-line import/prefer-default-export
export const handleGptJson = (text: string) => {
  // gpt-3.5-turbo avoids most json problems to begin with, but some problem categories can be offenders, particularly "String", thus the utility of this func
  let newText = text.split('\n').join('');
  newText = newText.split('\\n').join('');
  // remove \n lines
  const removeUselessText = /((\{|").*("|\}))/;
  // remove "Here's a unique LeetCode problem blah blah..."
  const match = newText.match(removeUselessText);
  if (match) {
    // eslint-disable-next-line prefer-destructuring
    newText = match[0];
  } else {
    return '';
  }
  const correctMissingBracket = newText.charAt(0) === '"' && newText.charAt(newText.length - 1) !== '"' && newText.charAt(newText.length - 1) !== ']';
  if (correctMissingBracket) {
    newText = `${newText}]`;
  }
  if (newText.charAt(0) !== '{') {
    newText = `{${newText}`;
  }
  if (newText.charAt(newText.length - 1) !== '}') {
    newText = `${newText}}`;
  }
  newText = newText.replace(/\\n/g, '');
  newText = newText.replace(/\\"/g, "'");
  const missingProp = /:\s*,/.test(newText);
  if (missingProp) {
    newText = newText.replace(/":\s*,"\s*/g, '": "",');
  }
  const unevenQuots = newText.match(/"/g).length % 2 > 0;
  // uneven quotes can happen in problems where one of the answers is an empty string
  if (unevenQuots) {
    newText = newText.replace(/":\s*("|([^"]*)"|"([^"]*))\s*(,\s*")/g, '": "$2$3"$4');
    // target invalid json props like { "inputText": ", "inputText": d"...}
  }
  return newText;
};
