package com.luckyapp.common.rxjava;

import com.luckyapp.common.utils.LogUtil;

import io.reactivex.Observable;
import io.reactivex.Observer;
import io.reactivex.disposables.Disposable;
import io.reactivex.functions.Action;
import io.reactivex.functions.Consumer;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-06-20
 * Desc: written for luckyday project.
 */
public class ObservableProxy<T> {

    private Observable<T> upstream;

    public static <T> ObservableProxy<T> create(Observable<T> upstream) {
        return new ObservableProxy<>(upstream);
    }

    public ObservableProxy(Observable<T> upstream) {
        this.upstream = upstream;
    }

    public ObservableProxy<T> doOnSubscribe(Consumer<Disposable> doOnSubscribe) {
        upstream = upstream.doOnSubscribe(doOnSubscribe);
        return this;
    }

    public ObservableProxy<T> doFinally(Action doFinally) {
        upstream = upstream.doFinally(doFinally);
        return this;
    }

    public ObservableProxy<T> doOnNext(Consumer<T> consumer) {
        upstream = upstream.doOnNext(consumer);
        return this;
    }

    public ObservableProxy<T> doOnError(Consumer<Throwable> consumer) {
        upstream = upstream.doOnError(consumer);
        return this;
    }

    public void subscribe() {
        subscribe(null);
    }

    public void subscribe(Consumer<T> onNext) {
        subscribe(onNext, null, null);
    }

    public void subscribe(Consumer<T> onNext, Consumer<Throwable> onError) {
        subscribe(onNext, onError, null);
    }

    public void subscribe(Consumer<T> onNext, Consumer<Throwable> onError, Action onComplete) {
        upstream.subscribe(new Observer<T>() {
            @Override
            public void onSubscribe(Disposable d) {
            }

            @Override
            public void onNext(T t) {
                if (onNext != null) {
                    try {
                        onNext.accept(t);
                    } catch (Exception e) {
                        LogUtil.e("Observe onNext error", e);
                    }
                }
            }

            @Override
            public void onError(Throwable e) {
                if (onError != null) {
                    try {
                        onError.accept(e);
                    } catch (Exception e1) {
                        LogUtil.e("Observe onError error", e1);
                    }
                }
            }

            @Override
            public void onComplete() {
                if (onComplete != null) {
                    try {
                        onComplete.run();
                    } catch (Exception e) {
                        LogUtil.e("Observe onComplete error", e);
                    }
                }
            }
        });
    }
}
