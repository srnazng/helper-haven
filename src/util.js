import { URL } from "./constants";

export const requestRegister = async (email, role, password, password2) => {
    let request = { method: "POST" };
    let info = {
        email: email,
        role: role,
        username: email,
        password: password,
        password2: password2
    }
    request.body = JSON.stringify(info);
    let data = await fetch(`${URL}register/`, {
        ...request,
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });

    var response = await data.json();
    return response;
}

export const requestLogin = async (username, password) => {
    let request = { method: "POST" };
    let info = {
        username: username,
        password: password
    }
    request.body = JSON.stringify(info);
    let data = await fetch(`${URL}login/`, {
        ...request,
        headers: new Headers({
            "Content-Type": "application/json",
        }),
    });

    var response = await data.json();
    return response;
}

export const request = async ({ type: reqType, path: url, body: body }) => {
    let type = reqType ? reqType : body ? "POST" : "GET";
    let req = { method: type };
    let data;

    if (reqType === "POST" || reqType === "PATCH") {
        if (body) {
            req.body = JSON.stringify(body);
        }

        data = await fetch(`${URL}/${url}`, {
            ...req,
            headers: new Headers({
                "Content-Type": "application/json",
            }),
        });
    }
    else {
        data = await fetch(`${URL}/${url}`, {
            ...req,
        });
    }

    var response = await data.json();
    return response;
}