function getQueryParam(param) {
    location.search.substr(1)
        .split("&")
        .some(function(item) { 
            return item.split("=")[0] == param && (param = item.split("=")[1])
        })
    return param;
}