package com.luckyapp.common.utils;

import java.io.Serializable;
import java.util.HashMap;

/**
 * Created by KevinLiu on 2018/1/11.
 */

public class SLHashMap implements Serializable{
    private HashMap<String,Object> map;

    public HashMap<String, Object> getMap() {
        return map;
    }

    public void setMap(HashMap<String, Object> map) {
        this.map = map;
    }
}
