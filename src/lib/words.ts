export const hasUnicodeWord = (s: string) =>
	/[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/.test(s);

const rsApos = "['\u2019]";

const rsMathOpRange = '\\xac\\xb1\\xd7\\xf7';
const rsNonCharRange = '\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf';
const rsPunctuationRange = '\\u2000-\\u206f';
const rsSpaceRange =
	' \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000';
const rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;

const rsBreak = '[' + rsBreakRange + ']';

const rsDigits = '\\d+';

const rsUpperRange = 'A-Z\\xc0-\\xd6\\xd8-\\xde';
const rsUpper = '[' + rsUpperRange + ']';

const rsLowerRange = 'a-z\\xdf-\\xf6\\xf8-\\xff';
const rsLower = '[' + rsLowerRange + ']';

const rsAstralRange = '\\ud800-\\udfff';
const rsDingbatRange = '\\u2700-\\u27bf';
const rsMisc =
	'[^' +
	rsAstralRange +
	rsBreakRange +
	rsDigits +
	rsDingbatRange +
	rsLowerRange +
	rsUpperRange +
	']';

const rsDingbat = '[' + rsDingbatRange + ']';

const rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}';

const rsMiscUpper = '(?:' + rsUpper + '|' + rsMisc + ')';

const rsMiscLower = '(?:' + rsLower + '|' + rsMisc + ')';

const rsOptContrUpper = '(?:' + rsApos + '(?:D|LL|M|RE|S|T|VE))?';

const rsOptContrLower = '(?:' + rsApos + '(?:d|ll|m|re|s|t|ve))?';

const rsOrdLower = '\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])';
const rsOrdUpper = '\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])';

const rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]';

const rsVarRange = '\\ufe0e\\ufe0f';
const rsOptVar = '[' + rsVarRange + ']?';
const rsComboMarksRange = '\\u0300-\\u036f';
const reComboHalfMarksRange = '\\ufe20-\\ufe2f';
const rsComboSymbolsRange = '\\u20d0-\\u20ff';
const rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
const rsCombo = '[' + rsComboRange + ']';
const rsFitz = '\\ud83c[\\udffb-\\udfff]';
const rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')';
const reOptMod = rsModifier + '?';
const rsZWJ = '\\u200d';
const rsNonAstral = '[^' + rsAstralRange + ']';
const rsOptJoin =
	'(?:' +
	rsZWJ +
	'(?:' +
	[rsNonAstral, rsRegional, rsSurrPair].join('|') +
	')' +
	rsOptVar +
	reOptMod +
	')*';
const rsSeq = rsOptVar + reOptMod + rsOptJoin;

const rsEmoji = '(?:' + [rsDingbat, rsRegional, rsSurrPair].join('|') + ')' + rsSeq;

const reUnicodeWords = RegExp(
	[
		rsUpper +
			'?' +
			rsLower +
			'+' +
			rsOptContrLower +
			'(?=' +
			[rsBreak, rsUpper, '$'].join('|') +
			')',
		rsMiscUpper +
			'+' +
			rsOptContrUpper +
			'(?=' +
			[rsBreak, rsUpper + rsMiscLower, '$'].join('|') +
			')',
		rsUpper + '?' + rsMiscLower + '+' + rsOptContrLower,
		rsUpper + '+' + rsOptContrUpper,
		rsOrdUpper,
		rsOrdLower,
		rsDigits,
		rsEmoji
	].join('|'),
	'g'
);

export const unicodeWords = (s: string) => s.match(reUnicodeWords) || [];

const reAsciiWords = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
export const asciiWords = (s: string) => s.match(reAsciiWords) || [];

export const words = (s: string) => (hasUnicodeWord(s) ? unicodeWords(s) : asciiWords(s));
