function moduleInfoParser(source) {
    source = source.replace(/\s/g, "");
    var declaringCallRegExp = /angular\.module\([^)]+?,\[[^)]*?]\)/g;
    var infoParseRegExp = /\(([^)]+?),\[([^)]*?)]\)/;
    var argumentSplitRegExp = /,/;

    var moduleDefs = source.match(declaringCallRegExp) || [];
    console.log(moduleDefs)

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

