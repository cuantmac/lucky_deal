package com.luckyapp.common.utils;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.OutputStream;

/**
 * Created by Wang on 2015/12/1.
 */
public class FileUtils {

    /**
     * create folder
     * @param dir
     * @return
     */
    static public boolean createDir(String dir){
        File desDir = new File(dir);
        if(!desDir.exists()){
            boolean mkStatus = desDir.mkdir();
            if(mkStatus){
                return true;
            }
            LogUtil.d("create dir failed!");
            return false;
        }
        return true;
    }


    /**
     * create new file
     * @param filePath
     * @return
     */
    static public boolean createFile(String filePath){
        File file = new File(filePath);
        if(!file.getParentFile().exists()){
            boolean status = file.getParentFile().mkdir();
            if(!status){
                LogUtil.d("create file failed!");
                return false;
            }
        }
        if(file.exists()){
            file.delete();
        }
        try {
            file.createNewFile();
            LogUtil.d("create new file:"+filePath);
            return true;
        } catch (Throwable e) {
            e.printStackTrace();
            LogUtil.d("create file failed!");
        }
        return false;
    }


    /**
     * 删除文件夹以及目录下的文件
     * @param   filePath 被删除目录的文件路径
     * @return  目录删除成功返回true，否则返回false
     */
    public static boolean deleteFolder(String filePath) {
        boolean flag = false;
        //如果filePath不以文件分隔符结尾，自动添加文件分隔符
        if (!filePath.endsWith(File.separator)) {
            filePath = filePath + File.separator;
        }
        File dirFile = new File(filePath);
        if (!dirFile.exists() || !dirFile.isDirectory()) {
            return false;
        }
        flag = true;
        File[] files = dirFile.listFiles();
        //遍历删除文件夹下的所有文件(包括子目录)
        for (int i = 0; i < files.length; i++) {
            if (files[i].isFile()) {
                //删除子文件
                flag = deleteFile(files[i].getAbsolutePath());
                if (!flag) break;
            } else {
                //删除子目录
                flag = deleteFolder(files[i].getAbsolutePath());
                if (!flag) break;
            }
        }
        if (!flag) return false;
        //删除当前空目录
        return dirFile.delete();
    }
    /**
     * 删除文件
     *
     * @param fileName 全路径名称
     * @return 删除成功与否
     */
    public static boolean deleteFile(String fileName) {
        LogUtil.d("delete file: " + fileName);
        boolean status = false;
        SecurityManager checker = new SecurityManager();
        if (fileName != null && !fileName.equals("")) {
            File newPath = new File(fileName);
            checker.checkDelete(newPath.toString());
            if (newPath.isFile()) {
                try {
                    LogUtil.i("DirectoryManager deleteFile", fileName);
                    status = newPath.delete();
                } catch (Throwable se) {
                    se.printStackTrace();
                }
            }
        }
        return status;
    }

    /**
     * 判断文件是否存在
     * @param filePath
     * @return
     */
    static public boolean isFileExist(String filePath){
        LogUtil.d("file path:"+filePath);
        File file = new File(filePath);
        return file.exists();
    }
    //文件拷贝
    //要复制的目录下的所有非子目录(文件夹)文件拷贝
    static public int CopyFile(String fromFile, String toFile)
    {
        if(!isFileExist(toFile))
            createFile(toFile);

        LogUtil.d("from:"+fromFile);
        LogUtil.d("to:"+toFile);
        try
        {
            InputStream fosfrom = new FileInputStream(fromFile);
            OutputStream fosto = new FileOutputStream(toFile);
            byte bt[] = new byte[1024];
            int c;
            while ((c = fosfrom.read(bt)) > 0)
            {
                fosto.write(bt, 0, c);
            }
            fosfrom.close();
            fosto.close();
            return 0;

        } catch (Throwable ex)
        {
            return -1;
        }
    }

    /**
     * 获取指定文件大小(单位：字节)
     *
     * @param file
     * @return
     * @throws Exception
     */
    public static long getFileSize(File file) throws Exception {
        if (file == null) {
            return 0;
        }
        long size = 0;
        if (file.exists()) {
            FileInputStream fis = null;
            fis = new FileInputStream(file);
            size = fis.available();
        }
        return size;
    }
}
