package com.luckyapp.common.utils;

import java.util.HashSet;
import java.util.Set;

/**
 * Description：.
 * Author：Created by YJ_Song on 2019-06-04.
 * Email:  yuanjin.song@dotcunited.com
 * 不需要弹窗的服务端返回的错误信息对应的error_code
 */
public class HttpErrorCodeUtil {
    public static Set<Integer> ERROR_CODES = new HashSet<Integer>() {{
        add(9006);add(9007);add(9008);add(9009);add(9010);
        add(9011);add(9012);add(9013);add(9014);add(9015);
        add(9016);add(9017);add(9018);add(9019);add(9020);
        add(9021);add(9022);add(9023);add(9024);add(9025);
        add(9026);
    }};
}
