function moduleInfoParser(source) {
    var declaringCallRegExp = /angular\s*\.\s*module\s*\(\s*.+,\s*\[.*]\s*\)/g;
    var infoParseRegExp = /\(\s*(.+),\s*\[(.*)]\s*\)/;
    var argumentSplitRegExp = /\s*,\s*/;

    var moduleDefs = source.match(declaringCallRegExp) || [];

    return moduleDefs.map(function (moduleDef) {
        var infoMatch = moduleDef.match(infoParseRegExp);
        var name = infoMatch[1].replace(/['"]/g, "");
        var arguments = infoMatch[2].
            split(argumentSplitRegExp).
            filter(function (argument) {
                return argument;
            }).
            map(function (argument) {
            return argument.replace(/['"]/g, "");
        });

        return {
            name: name,
            dependencies: arguments
        };
    });
}
module.exports = moduleInfoParser;

