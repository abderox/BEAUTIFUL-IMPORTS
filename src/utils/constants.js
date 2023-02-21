
const IMPORT_STATEMENT_REGEX = /^import\s*{\s*((\w+)(\s*,\s*(\w+))*)\s*}\s*from\s*["'](.+)["']\s*;?$/;
const REQUIRE_STATEMENT_REGEX = /^(const|let|var)?\s*{\s*((\w+)(\s*,\s*(\w+))*)\s*}\s*=\s*require\s*\(\s*['"](.+)['"]\s*\)/;

const SUPPORTED_FILE_TYPES = [".js",".jsx",".ts",".tsx"];


module.exports = {
    IMPORT_STATEMENT_REGEX,
    REQUIRE_STATEMENT_REGEX,
    SUPPORTED_FILE_TYPES
}