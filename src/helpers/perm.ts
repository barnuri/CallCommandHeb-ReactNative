function getCombinations(chars) {
    var result = [] as any[];
    var f = function(prefix, chars) {
        for (var i = 0; i < chars.length; i++) {
            result.push(prefix + chars[i]);
            f(prefix + chars[i], chars.slice(i + 1));
        }
    };
    f('', chars);
    return result;
}

const permStrJoin = (arr: string[]) => {
    let perms = getCombinations(arr.map(x => ` ${x} `)) as string[];
    return perms.map(perm => (perm || '').trim().replace(/  /g, ' '));
};

export default permStrJoin;
