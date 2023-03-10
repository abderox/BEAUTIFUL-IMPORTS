
const IMPORT_STATEMENT_REGEX = /^import\s*((\w+\s*),\s*)?{\s*((\w+\s*as\s*\w+|\w+)(\s*,\s*(\w+\s*as\s*\w+|\w+))*)\s*}\s*from\s*["'](.+)["']\s*;?$/;
const REQUIRE_STATEMENT_REGEX = /^(const|let|var)?\s*{\s*((\w+)(\s*,\s*(\w+))*)\s*}\s*=\s*require\s*\(\s*['"](.+)['"]\s*\)/;
const EXPORT_STATEMENT_REGEX = /^export\s*((const|let|var)\s+(\w+)\s*=)?\s*{\s*((\w+\s*:\s*\w+|\w+)(\s*,\s*(\w+\s*:\s*\w+|\w+))*)\s*}\s*;?$/;
const MODULE_EXPORT_REGEX =/^module\.exports\s*=?\s*{\s*((\w+\s*:\s*\w+|\w+)(\s*,\s*(\w+\s*:\s*\w+|\w+))*)\s*}\s*;?$/;
const TAG_REGEX = /^(\s*)<\s*(\w+)\s*((?:\w+\s*=.*?(?=[\s/]>))*)\s*(\/?>?)/;
const TAG_ATTRIBUTES =  /((\w+)\s*=\s*("[^"]*"|'[^']*'|\{.*?\}|\d+)|\w+\s*)/g;

const SUPPORTED_FILE_TYPES = [".js",".jsx",".ts",".tsx"];


module.exports = {
    IMPORT_STATEMENT_REGEX,
    REQUIRE_STATEMENT_REGEX,
    EXPORT_STATEMENT_REGEX,
    MODULE_EXPORT_REGEX,
    TAG_REGEX,
    TAG_ATTRIBUTES,
    SUPPORTED_FILE_TYPES,
}