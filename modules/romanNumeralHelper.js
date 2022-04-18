/**
 * Return the roman numeral version of a given number
 * @param {number} num - Number to convert
 * @return {?string} - Roman numeral
 * @module romanNumeralHelper
 */
module.exports = function romanise(num) {
  if (isNaN(num))
    return null;
  const digits = String(+num).split(""),
    key = ["","C","CC","CCC","CD","D","DC","DCC","DCCC","CM",
      "","X","XX","XXX","XL","L","LX","LXX","LXXX","XC",
      "","I","II","III","IV","V","VI","VII","VIII","IX"];
  let roman = "",
    i = 3;
  while (i--)
    roman = (key[+digits.pop() + (i * 10)] || "") + roman;
  return Array(+digits.join("") + 1).join("M") + roman;
};