
export const compressJson = (obj) => {
        for (var key in obj) {
            if (obj[key] === null || obj[key]=== "" || obj[key]===false) {
                delete obj[key];
            } else if (typeof obj[key] === "object") {
                compressJson(obj[key]);
                if (Object.keys(obj[key]).length === 0) {
                    delete obj[key];
                }
            }
        }
        return obj;
    
    //     if (file[p] === false || file[p] === " " || file[p] === [] || file[p] === {} || file[p] === null) {
    //         console.log(file[p] + " " + p)
    //         delete file[p]
    //     } else {
    //         console.log(file[p])
    //         if (Object.keys(file[p]) || Array.isArray(file[p])) {
    //             shrink(file[p])
    //         }
    //     }
    // }
}
