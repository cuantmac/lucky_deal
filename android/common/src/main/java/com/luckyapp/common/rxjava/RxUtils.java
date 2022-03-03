package com.luckyapp.common.rxjava;

import java.util.concurrent.TimeUnit;

import io.reactivex.Completable;
import io.reactivex.Observable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.disposables.Disposable;
import io.reactivex.schedulers.Schedulers;

public class RxUtils {

    public static Disposable interval(final Runnable runnable, long timeInMills) {
        return interval(runnable, timeInMills, 0);
    }

    public static Disposable interval(final Runnable runnable, long timeInMills, long initialDelay) {
        return Observable.interval(initialDelay, timeInMills, TimeUnit.MILLISECONDS)
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(aLong -> runnable.run());
    }

    public static void run(Runnable runnable) {
        Completable.fromRunnable(runnable).subscribeOn(Schedulers.io()).subscribe();
    }

    public static void post(Runnable runnable) {
        Completable.fromRunnable(runnable).subscribeOn(AndroidSchedulers.mainThread()).subscribe();
    }
}
