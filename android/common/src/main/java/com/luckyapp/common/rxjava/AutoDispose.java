package com.luckyapp.common.rxjava;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentActivity;
import androidx.lifecycle.LifecycleOwner;

import java.lang.ref.WeakReference;

import io.reactivex.ObservableConverter;
import io.reactivex.functions.Predicate;

/**
 * Author: zhoubinjia
 * Email: zhoubinjia@innotechx.com
 * Date: 2019-06-20
 * Desc: written for luckyday project.
 */
public class AutoDispose {

    public static <T> ObservableConverter<T, ObservableProxy<T>> from(LifecycleOwner owner) {
        return upstream -> ObservableProxy.create(upstream.takeUntil(DisposePredicate.create(owner)));
    }

    public static <T> ObservableConverter<T, ObservableProxy<T>> create() {
        return ObservableProxy::create;
    }

    public static <T> ObservableConverter<T, ObservableProxy<T>> takeUntil(Predicate<T> predicate) {
        return upstream -> ObservableProxy.create(upstream.takeUntil(predicate));
    }

    public static class DisposePredicate<T> implements Predicate<T> {

        public static <T> DisposePredicate<T> create(LifecycleOwner owner) {
            return new DisposePredicate<>(owner);
        }

        private WeakReference<LifecycleOwner> reference;

        DisposePredicate(LifecycleOwner owner) {
            reference = new WeakReference<>(owner);
        }

        @Override
        public boolean test(T t) throws Exception {
            if (reference.get() == null) return true;
            LifecycleOwner owner = reference.get();
            if (owner instanceof FragmentActivity) {
                return ((FragmentActivity) owner).isFinishing();
            }
            if (owner instanceof Fragment) {
                return ((Fragment) owner).getActivity() == null;
            }
            return false;
        }
    }
}
