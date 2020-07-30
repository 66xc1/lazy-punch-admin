export function trim(str) {
    return str == null ? '' : str.toString().replace(/^(\s|\u00A0)+/, '').replace(/(\s|\u00A0)+$/, '');
}

export function trimObj(obj) {
    let temp_obj = {};
    for (let item in obj) {
        if (typeof(obj[item]) === 'string') {
            temp_obj[item] = trim(obj[item]);
        } else {
            temp_obj[item] = obj[item];
        }
        if (temp_obj[item] === '') {
            temp_obj[item] = null;
        }
    }
    return temp_obj;
}
