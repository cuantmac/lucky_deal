package com.luckyapp.common.utils;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import io.reactivex.functions.Function;
import io.reactivex.functions.Predicate;
import io.reactivex.plugins.RxJavaPlugins;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-11-18
 * Desc: written for luckyday project.
 */
public class CollectionUtil {

    /**
     * 筛选符合条件的Item
     * @param source
     * @param predicate
     * @param <T>
     * @return
     */
    public static <T> List<T> filter(List<T> source, Predicate<T> predicate) {
        List<T> res = new ArrayList<>();
        if (source == null) return res;
        for (T t : source) {
            try {
                if (predicate.test(t)) {
                    res.add(t);
                }
            } catch (Exception e) {
                RxJavaPlugins.onError(e);
            }
        }
        return res;
    }

    /**
     * 筛选符合条件的首个Item
     * @param source
     * @param predicate
     * @param <T>
     * @return
     */
    public static <T> T first(List<T> source, Predicate<T> predicate) {
        List<T> filter = filter(source, predicate);
        if (filter.isEmpty()) {
            return null;
        }
        return filter.get(0);
    }

    /**
     * List映射
     * @param source
     * @param function
     * @param <T>
     * @param <R>
     * @return
     */
    public static <T, R> List<R> map(List<T> source, Function<T, R> function) {
        List<R> res = new ArrayList<>();
        for (T t : source) {
            try {
                res.add(function.apply(t));
            } catch (Exception e) {
                RxJavaPlugins.onError(e);
            }
        }
        return res;
    }

    /**
     * 移除符合条件的Item
     * @param source
     * @param predicate
     * @param <T>
     */
    public static <T> void removeIf(List<T> source, Predicate<T> predicate) {
        Iterator<T> iterator = source.iterator();
        while (iterator.hasNext()) {
            T t = iterator.next();
            try {
                if (predicate.test(t)) {
                    iterator.remove();
                }
            } catch (Exception e) {
                RxJavaPlugins.onError(e);
            }
        }
    }

    /**
     * List中是否存在符合条件的Item
     * @param source
     * @param function
     * @param <T>
     * @return
     */
    public static <T> boolean contains(List<T> source, Function<T, Boolean> function) {
        for (T t : source) {
            try {
                if (function.apply(t)) {
                    return true;
                }
            } catch (Exception e) {
                RxJavaPlugins.onError(e);
            }
        }
        return false;
    }
}
