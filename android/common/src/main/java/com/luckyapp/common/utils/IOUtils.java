//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by Fernflower decompiler)
//

package com.luckyapp.common.utils;

import androidx.annotation.Nullable;

import java.io.BufferedInputStream;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public final class IOUtils {
    private IOUtils() {
    }

    public static void closeQuietly(@Nullable Closeable closeable) {
        if (closeable != null) {
            try {
                closeable.close();
            } catch (IOException ignored) {
            }
        }
    }

    public static long copyStream(InputStream input, OutputStream output) throws IOException {
        return copyStream(input, output, false, 1024);
    }

    public static long copyStream(InputStream input, OutputStream output, boolean autoClose, int bufferSize) throws IOException {
        byte[] buffer = new byte[bufferSize];
        long total = 0L;

        int size;
        try {
            while((size = input.read(buffer, 0, bufferSize)) != -1) {
                total += (long)size;
                output.write(buffer, 0, size);
            }
        } finally {
            if (autoClose) {
                closeQuietly(input);
                closeQuietly(output);
            }

        }
        return total;
    }

    public static byte[] readInputStreamFully(InputStream input) throws IOException {
        return readInputStreamFully(input, true);
    }

    public static byte[] readInputStreamFully(InputStream input, boolean autoClose) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        copyStream(input, out, autoClose, 1024);
        return out.toByteArray();
    }

    public static byte[] toByteArray(InputStream input) throws IOException {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        byte[] buffer = new byte[4096];

        int size;
        while((size = input.read(buffer)) != -1) {
            output.write(buffer, 0, size);
        }
        return output.toByteArray();
    }

    public static void unzip(byte[] bytes, File targetDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(new ByteArrayInputStream(bytes));
        try {
            FileUtils.deleteFolder(targetDirectory.getAbsolutePath());
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " +
                            dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            /* if time should be restored as well
            long time = ze.getTime();
            if (time > 0)
                file.setLastModified(time);
            */
            }
        } finally {
            zis.close();
        }
    }

    public static void unzip(InputStream zipFile, File targetDirectory) throws IOException {
        ZipInputStream zis = new ZipInputStream(new BufferedInputStream(zipFile));
        try {
            FileUtils.deleteFolder(targetDirectory.getAbsolutePath());
            ZipEntry ze;
            int count;
            byte[] buffer = new byte[8192];
            while ((ze = zis.getNextEntry()) != null) {
                File file = new File(targetDirectory, ze.getName());
                File dir = ze.isDirectory() ? file : file.getParentFile();
                if (!dir.isDirectory() && !dir.mkdirs())
                    throw new FileNotFoundException("Failed to ensure directory: " +
                            dir.getAbsolutePath());
                if (ze.isDirectory())
                    continue;
                FileOutputStream fout = new FileOutputStream(file);
                try {
                    while ((count = zis.read(buffer)) != -1)
                        fout.write(buffer, 0, count);
                } finally {
                    fout.close();
                }
            /* if time should be restored as well
            long time = ze.getTime();
            if (time > 0)
                file.setLastModified(time);
            */
            }
        } finally {
            zis.close();
        }
    }
}
