export function format(string:string, args:{[key:string]: string}, start = '{{', end = '}}') {
    for (let key in args) {

        let val = args[key]
        string = string.replace(new RegExp(`\\${start}${key}\\${end}`, 'g'), val)
    }

    return string
}