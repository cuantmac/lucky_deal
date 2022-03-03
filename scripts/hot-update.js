const {S3, CloudFront, Config, Credentials} = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');
const mime = require('mime');
const {Command} = require('commander');
(async () => {
  const ENV_CONFIG = {
    RELEASE: {
      BUCKET_PREFIX: 'app-upgrade',
      BUCKET: 'static.luckydeal.vip',
      CLOUDFRONT: {
        CLOUDFRONT_DISTRIBUTION_ID: 'E34HZB0CY1093S',
        CLOUDFRONT_INVALID_PATHS: ['/app-upgrade/*'],
      },
    },
    TEST: {
      BUCKET_PREFIX: 'app-upgrade-test',
      BUCKET: 'static.luckydeal.vip',
      CLOUDFRONT: {
        CLOUDFRONT_DISTRIBUTION_ID: 'E34HZB0CY1093S',
        CLOUDFRONT_INVALID_PATHS: ['/app-upgrade-test/*'],
      },
    },
    DEV: {
      BUCKET_PREFIX: 'app-upgrade-test',
      BUCKET: 'node-example-s3',
      CLOUDFRONT: {
        CLOUDFRONT_DISTRIBUTION_ID: 'E34HZB0CY1093S',
        CLOUDFRONT_INVALID_PATHS: ['/app-upgrade-test/*'],
      },
    },
  };

  const ALC_ENUM = {
    PRIVATE: 'private',
    PUBLIC_READ: 'public-read',
  };

  function isEnv(env) {
    return Object.keys(ENV_CONFIG).includes(env);
  }

  // 接收 cli 参数
  const program = new Command();
  program
    .option(
      '-e, --env <' + Object.keys(ENV_CONFIG).join('|') + '>',
      'add env',
      'DEV',
    )
    .option('-b, --bundle <path>', 'add bundle path')
    .option('-p, --project <path>', 'add project path')
    .option('-t, --type <path>', 'add bundle type')
    .option('-m, --minVersion <string>', 'bundle min app version', '0')
    .option('-v, --maxVersion <string>', 'bundle max app version', '0')
    .option('-c, --bundleCode <string>', 'bundle code', '0')
    .option('--onlyUploadImage', 'only upload image?')
    .parse(process.argv);

  const programOptions = program.opts();
  const env = programOptions.env;
  const workDir = path.resolve(programOptions.project);
  const onlyUploadImage = programOptions.onlyUploadImage;
  const type = programOptions.type;
  const minVersion = programOptions.minVersion;
  const maxVersion = programOptions.maxVersion;
  const bundleCode = programOptions.bundleCode;
  const bundleFile = !onlyUploadImage
    ? path.join(programOptions.bundle.replace(/\\/g, '/'))
    : '';

  // 检查env值
  if (!isEnv(env)) {
    console.error('please add env link ' + Object.keys(ENV_CONFIG).join('|'));
    return;
  }

  const config = ENV_CONFIG[env];
  // s3 将要访问的桶
  const BUCKET = config.BUCKET;
  // 生产和测试在桶中的文件夹名称
  const BUCKET_PREFIX = config.BUCKET_PREFIX;
  // 图片S3桶中文件夹名称
  const BUCKET_IMAGE_PRIFIX = BUCKET_PREFIX + '/assets/src/assets/';
  // 图片在本地的文件夹名称
  const LOCAL_IMAGE_PREFIX = 'src/assets/';
  // cloudFront 配置
  const CLOUDFRONT = config.CLOUDFRONT;

  // 生成S3认证对象
  const s3Credentials = new Credentials({
    accessKeyId: 'AKIAIM54EAM3RWXJV7UQ',
    secretAccessKey: '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',
  });

  // 生成 cloudFront认证对象
  const cloudFrontCredentials = new Credentials({
    accessKeyId: 'AKIAQFJFNIRIXGRO2H2M',
    secretAccessKey: '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',
  });

  // 生成s3对象
  const s3 = new S3({
    region: 'us-west-1',
    credentials: s3Credentials,
    params: {Bucket: BUCKET, Prefix: BUCKET_PREFIX + '/', MaxKeys: 10000},
  });

  // 生成cloudfront对象
  const awsCloudfront = new CloudFront({apiVersion: '2020-05-31'});
  awsCloudfront.config = new Config({
    credentials: cloudFrontCredentials,
  });

  if (!onlyUploadImage) {
    console.log('===== start upload metadata and bundle file =====');
    // 上传metadata文件 和 bundle 文件
    await uploadMetadataAndBundle(bundleFile);
  }

  console.log('===== start upload image =====');
  // 上传新增或修改的图片
  await uploadImage();

  if (!onlyUploadImage) {
    console.log(`
===== start refresh cache =====`);
    // 刷新缓存
    await refreshCloudFrontCache(CLOUDFRONT);
  }

  // 上传图片
  async function uploadImage() {
    const luckdealImagePath = path.join(workDir, LOCAL_IMAGE_PREFIX);
    // 拉取线上和本地的图片文件列表
    const [localFiles, bucketFiles] = await Promise.all([
      getFileList(luckdealImagePath),
      listBucketFiles(s3),
    ]);

    // 将线上文件数据转成 key： 文件地址 value：Etag(md5) 的数据
    const bucketsMap = {};
    (bucketFiles.Contents || []).forEach(({ETag, Key}) => {
      bucketsMap[path.join(Key.replace(BUCKET_IMAGE_PRIFIX, ''))] = ETag;
    });

    // 将本地图片文件列表数据转成 key： 文件地址 value：Etag(md5) 的数据
    const localFilesMap = {};
    localFiles.forEach((fileName) => {
      localFilesMap[
        fileName.replace(
          new RegExp(
            '.*' + path.join('/', LOCAL_IMAGE_PREFIX).replace(/\\/g, '\\\\'),
          ),
          '',
        )
      ] = getMD5(fileName);
    });

    // 检查本地图片文件是否存在于线上
    // 不存在则认为需要上传
    // 如果存在则比较 Etag(md5)值是否一致， 如果不一致则认为需要上传
    // 否则认为图片已经存在且未发生变动不需要上传
    const willUploadImage = filterUploadFile(
      Object.keys(localFilesMap).filter((fileName) => {
        return localFilesMap[fileName] !== bucketsMap[fileName];
      }),
    );

    if (willUploadImage.length === 0) {
      console.log('no image will upload');
    } else {
      // 上传图片
      console.log('image uploading...');
      await Promise.all(
        willUploadImage.map((fileName) => {
          return uploadFile({
            key: path.join(BUCKET_IMAGE_PRIFIX, fileName),
            filePath: path.join(workDir, LOCAL_IMAGE_PREFIX, fileName),
            bucket: BUCKET,
            md5: localFilesMap[fileName],
          });
        }),
      );
    }
  }

  /**
   * 修改 metadata.json 上传 bundle文件
   *
   * @param bundleFile bundleFile 地址
   */
  // eslint-disable-next-line no-shadow
  async function uploadMetadataAndBundle(bundleFile) {
    const metadataKey = path
      .join(BUCKET_PREFIX, 'metadata.json')
      .replace(/\\/g, '/');
    // 获取线上metadata文件
    const medetaRes = await getS3File({Bucket: BUCKET, Key: metadataKey});
    if (!medetaRes.Body) {
      throw new Error('error >> not fund metadata.json');
    }
    // 解析metadata文件
    const metadataContent = JSON.parse(medetaRes.Body.toString());
    // 根据 bundleFile 路径获取 bundleFile 文件名
    const bundleFileName = path.basename(bundleFile);
    // 获取 bundleFile md5值
    const bundleFileMD5 = getMD5(bundleFile);
    // 修改metadata
    // eslint-disable-next-line no-shadow
    const config =
      type === 'android'
        ? metadataContent.bundles[0]
        : metadataContent.iosBundles[0];
    if (type === 'android') {
      const minAppVersion = parseInt(minVersion, 10);
      if (minAppVersion > 0) {
        config.min_app_version = minAppVersion;
      }
      const maxAppVersion = parseInt(maxVersion, 10);
      if (maxAppVersion > 0) {
        config.max_app_version = maxAppVersion;
      }
      const bundleVersionCode = parseInt(bundleCode, 10);
      if (bundleVersionCode > 0) {
        config.version = bundleVersionCode - 1;
      }
    }
    config.version++;
    config.name = bundleFileName;
    config.md5 = bundleFileMD5.replace(/"/g, '');

    // 输出修改后的metadata文件
    console.log(
      `
${metadataKey}
    content: ${JSON.stringify(metadataContent)}
          `,
    );

    // 上传修改完成的metadata文件
    await uploadFile({
      bucket: BUCKET,
      key: metadataKey,
      body: JSON.stringify(metadataContent),
      contentType: mime.getType(metadataKey),
    });

    // 上传bundleFile文件
    await uploadFile({
      bucket: BUCKET,
      filePath: bundleFile,
      key: path.join(BUCKET_PREFIX, bundleFileName),
    });
  }

  /**
   * 刷新缓存
   */
  async function refreshCloudFrontCache(cloudFront) {
    return new Promise((resolve, reject) => {
      awsCloudfront.createInvalidation(
        {
          DistributionId: cloudFront.CLOUDFRONT_DISTRIBUTION_ID,
          InvalidationBatch: {
            Paths: {
              Quantity: 1,
              Items: cloudFront.CLOUDFRONT_INVALID_PATHS,
            },
            CallerReference: Date.now().toString(),
          },
        },
        (err, data) => {
          if (err) {
            reject(err);
            return;
          }
          console.log(
            `
success >> cloudfront:
    Cloudfront ID: ${cloudFront.CLOUDFRONT_DISTRIBUTION_ID}
    Location: ${data.Location}
`,
          );
          console.log('cloudfront: ', data);
          resolve(data);
        },
      );
    });
  }

  /**
   * 生成文件夹中所有文件列表
   */
  async function getFileList(p, arr = []) {
    fs.readdirSync(p).map((fileName) => {
      const filePath = path.join(p, fileName);
      if (fs.statSync(filePath).isFile()) {
        arr.push(filePath);
      } else {
        getFileList(filePath, arr);
      }
    });
    return arr;
  }

  /**
   * 获取S3 bucket内的所有文件
   */
  async function listBucketFiles(
    // eslint-disable-next-line no-shadow
    s3,
    data = {Contents: [], KeyCount: 0},
    nextContinuationToken,
  ) {
    const listParams = {
      Bucket: BUCKET,
      Prefix: BUCKET_PREFIX,
      MaxKeys: 10000,
      ContinuationToken: nextContinuationToken,
    };
    const res = await s3.listObjectsV2(listParams).promise();
    data.Contents = data.Contents.concat(res.Contents || []);
    data.KeyCount = (res.KeyCount || 0) + (data.KeyCount || 0);
    data.Name = res.Name;
    data.Prefix = res.Prefix;
    if (res.IsTruncated) {
      await listBucketFiles(s3, data, res.NextContinuationToken);
    }
    return data;
  }

  /**
   * 上传文件 并打印成功后文件的基本信息
   *
   * @param uploadObject UploadObject
   * @param alc ALC_ENUM
   */
  function uploadFile(uploadObject, alc = ALC_ENUM.PUBLIC_READ) {
    const fileStream =
      uploadObject.body || fs.createReadStream(uploadObject.filePath);
    const key = uploadObject.key;
    const mimeType =
      uploadObject.contentType || mime.getType(uploadObject.filePath);
    const bucket = uploadObject.bucket;
    const parseKey = key.replace(/\\/g, '/');
    return new Promise((resolve, reject) => {
      s3.putObject(
        {
          ACL: alc,
          Bucket: bucket,
          Key: parseKey,
          Body: fileStream,
          ContentType: mimeType,
        },
        (err, data) => {
          if (err) {
            reject(err);
            console.error(
              `
error >> file:
    local_file_path: ${uploadObject.filePath} 
    mime: ${mimeType}
    error: ${err}
`,
            );
            return;
          }

          if (uploadObject.md5 && data.ETag !== uploadObject.md5) {
            console.error(
              `
error >> file: 
    local_file_path: ${uploadObject.filePath}
    key: ${parseKey}
    mime: ${mimeType}
    error: 
        local_md5: ${uploadObject.md5}
        aws_return_md5: ${data.ETag}      
          `,
            );
            reject(new Error('md5 not match'));
            return;
          }

          resolve(uploadObject);
          console.log(
            `
success >> file: 
    local_file_path: ${uploadObject.filePath}
    key: ${parseKey}
    md5: ${data.ETag}
    mime: ${mimeType}
          `,
          );
        },
      );
    });
  }

  /**
   * 获取文件md5值
   * aws 生成的文件 Etag 添加了一层双引号
   *
   * @param p 文件路径
   */
  function getMD5(p) {
    return '"' + md5(fs.readFileSync(p)) + '"';
  }

  /**
   * 对需要上传的文件过滤, 例如 以 . 开头
   */
  function filterUploadFile(arr) {
    return arr.filter((item) => {
      return !/^\./.test(path.basename(item));
    });
  }

  /**
   * 获取S3 文件
   */
  function getS3File(params) {
    return new Promise((resolve, reject) => {
      s3.getObject(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(data);
      });
    });
  }
})().catch((e) => {
  console.log(e);
  process.exit(1);
});
