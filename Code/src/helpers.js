export function checkRenderPermissions(str, permissions) {

    if (permissions) {
        for (var i = 0, j = permissions.length; i < j; i++) {
            for (var key in permissions[i]) {
                if (permissions[i][key] == str) {
                    return true;
                }
            }
        }
    }

    return false;
}