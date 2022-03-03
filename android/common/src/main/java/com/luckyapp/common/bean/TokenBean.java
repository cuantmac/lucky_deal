package com.luckyapp.common.bean;

public class TokenBean {
    //    {
//    "code": 0,
//    "data":{"token": "Bearer eyJhbGciOiJIUzI1NiIsImtpZCI6ImtpZCIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJhdWQiOiJhbmRyb2lkQXBwIiwiZXhwIjoxNTUzNjcwNzg1LCJpYXQiOjE1NTEwNzg3ODUsImlzcyI6Imx1Y2t5RGF5QXBpIn0.nDzTC7Yjw5FWeSRc7NXfOQd8lDfQUj-GjtZCBWSt5wI"
//}
//}
    String token;
    String user_id;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUser_id() {
        return user_id;
    }

    public void setUser_id(String user_id) {
        this.user_id = user_id;
    }

    @Override
    public String toString() {
        return "TokenBean{" +
                "token='" + token + '\'' +
                ", user_id='" + user_id + '\'' +
                '}';
    }
}
