const fs = require('fs');
const mime = require('mime');
const {S3, CloudFront, Config, Credentials, page} = require('aws-sdk');
const path = require('path');
const {Command} = require('commander');
const {execSync} = require('child_process');
const md5 = require('md5');

const WORK_DIR = path.resolve(__dirname, '..');
const SOURCE_DIR = path.join(WORK_DIR, 'build', path.sep);
console.log('WORK_DIR: ', WORK_DIR);
console.log('SOURCE_DIR: ', SOURCE_DIR);

const ENV_CONFIG = {
  PRODUCTION: {
    BUCKET_PREFIX: 'child/main/',
    BUCKET: 'm.gesleben.me',
    IGNORE_PREFIX: [],
    CLOUDFRONT: {
      CLOUDFRONT_DISTRIBUTION_ID: 'E1N16T6QRDHOWJ',
      CLOUDFRONT_INVALID_PATHS: ['/*'],
      EXTRA_PATHS: ['/child/main/'],
    },
  },
  STAGING: {
    BUCKET_PREFIX: 'child/main/',
    BUCKET: 'm-test.gesleben.me',
    IGNORE_PREFIX: [],
    CLOUDFRONT: {
      CLOUDFRONT_DISTRIBUTION_ID: 'E164OGFZ3C1LZF',
      CLOUDFRONT_INVALID_PATHS: ['/*'],
      EXTRA_PATHS: ['/child/main/'],
    },
  },
  DEV: {
    BUCKET_PREFIX: 'child/main/',
    BUCKET: 'node-example-s3',
    IGNORE_PREFIX: [],
    CLOUDFRONT: {
      CLOUDFRONT_DISTRIBUTION_ID: 'E3ADCSGAKQHCN9',
      CLOUDFRONT_INVALID_PATHS: ['/*'],
      EXTRA_PATHS: ['/child/main/'],
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
  .parse(process.argv);

const programOptions = program.opts();
const env = programOptions.env;

// 检查env值
if (!isEnv(env)) {
  throw new Error('please add env like ' + Object.keys(ENV_CONFIG).join('|'));
}

const config = ENV_CONFIG[env];
// s3 将要访问的桶
const BUCKET = config.BUCKET;
// 生产和测试在桶中的文件夹名称
const BUCKET_PREFIX = config.BUCKET_PREFIX;
// cloudFront 配置
const CLOUDFRONT = config.CLOUDFRONT;
// 忽略检查文件
const IGNORE_PREFIX = config.IGNORE_PREFIX;

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
  params: {Bucket: BUCKET, Prefix: BUCKET_PREFIX, MaxKeys: 10000},
});

// 生成cloudfront对象
const awsCloudfront = new CloudFront({apiVersion: '2020-05-31'});
awsCloudfront.config = new Config({
  credentials: cloudFrontCredentials,
});

// 获取所有需要上传的文件列表
const uploadList = filterFile(getFileList(SOURCE_DIR));

(async () => {
  let refreshList = CLOUDFRONT.CLOUDFRONT_INVALID_PATHS;
  const willUploadList = await diffFileList(BUCKET, BUCKET_PREFIX, uploadList);
  refreshList = willUploadList.map(({path: f}) => {
    return '/' + BUCKET_PREFIX + f.replace(SOURCE_DIR, '').replace(/\\/g, '/');
  });
  console.log('will upload >> file:');
  willUploadList.forEach(({path: f}) => {
    console.log(`       ${f}`);
  });
  const versionFile = createVersionFile();
  await Promise.all([
    ...willUploadList.map(({path: f}) => {
      return uploadFile({
        key: BUCKET_PREFIX + f.replace(SOURCE_DIR, ''),
        filePath: f,
        bucket: BUCKET,
      });
    }),
    uploadFile({
      ...versionFile,
      bucket: BUCKET,
    }),
  ]);
  await clearBucket(BUCKET, BUCKET_PREFIX, uploadList);
  console.log('===== start refresh cdn =====');
  await refreshCloudFrontCache(CLOUDFRONT, [
    ...refreshList,
    ...config.CLOUDFRONT.EXTRA_PATHS,
    '/' + BUCKET_PREFIX + 'version.json',
  ]);
})().catch((e) => {
  console.log(e);
  process.exit(1);
});

async function diffFileList(bucket, dir, fileList = []) {
  const listedObjects = await getOriginFileList(bucket, dir);
  return fileList.filter(({path: f, eTag}) => {
    const basename = path.basename(f);

    const fileItem = listedObjects.Contents.find(({Key}) => {
      return path.basename(Key) === basename;
    });
    if (!fileItem) {
      return true;
    }
    const localEtag = eTag;
    return fileItem.ETag !== localEtag;
  });
}

/**
 * 清空bucket中指定文件夹内容
 *
 * @param {*} bucket
 * @param {*} dir
 * @param {*} fileList 本地文件列表
 * @returns
 */
async function clearBucket(bucket, dir, fileList) {
  const listedObjects = await getOriginFileList(bucket, dir);
  const deleteParams = {
    Bucket: bucket,
    Delete: {Objects: []},
  };
  if (listedObjects.Contents.length === 0) {
    return;
  }
  console.log('will delete >> file:');
  if (fileList && fileList.length) {
    listedObjects.Contents.forEach(({Key, LastModified}) => {
      if (Key.endsWith('version.json')) {
        return;
      }
      if (
        fileList.findIndex(
          ({path: filename}) => path.basename(Key) === path.basename(filename),
        ) !== -1
      ) {
        return;
      }
      console.log(`       ${Key}`);
      deleteParams.Delete.Objects.push({Key});
    });
  }
  if (!deleteParams.Delete.Objects.length) {
    return;
  }
  await s3.deleteObjects(deleteParams).promise();
}

/**
 * 上传文件 并打印成功后文件的基本信息
 *
 * @param uploadObject UploadObject
 *  key: string;
    filePath?: string;
    body?: Body;
    contentType?: string;
    bucket: string;
    md5?: string; // must be like '"md5"'

 * @param alc ALC_ENUM
 */
function uploadFile(uploadObject, alc = ALC_ENUM.PUBLIC_READ) {
  let fileStream = uploadObject.body;
  if (!fileStream && uploadObject.filePath) {
    fileStream = fs.createReadStream(uploadObject.filePath);
  }
  const parseKey = uploadObject.key.replace(/\\/g, '/');
  let mimeType = uploadObject.contentType;
  if (!mimeType && uploadObject.filePath) {
    mimeType = mime.getType(uploadObject.filePath) || undefined;
  }
  const bucket = uploadObject.bucket;
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
          console.error(
            `
error >> file:
    local_file_path: ${uploadObject.filePath} 
    mime: ${mimeType}
    error: ${err}
`,
          );
          reject(err);
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
 * 生成文件夹中所有文件列表
 *
 * @param {*} p 文件夹名称
 * @param {*} arr 可不传
 * @returns 所有文件列表
 */
function getFileList(p, arr = []) {
  fs.readdirSync(p).map((fileName) => {
    const filePath = path.join(p, fileName);
    if (fs.statSync(filePath).isFile()) {
      arr.push({path: filePath, eTag: getMD5(filePath)});
    } else {
      getFileList(filePath, arr);
    }
  });
  return arr;
}

/**
 * 过滤需要上传的列表
 * 去除文件名以 . 开头的文件
 *
 * @param {*} list 文件泪飙
 * @returns 过滤完成的列表
 */
function filterFile(list = []) {
  return list.filter(({path: f}) => {
    const basename = path.basename(f);
    return !/^\./.test(basename);
  });
}

/**
 * 刷新缓存
 */
function refreshCloudFrontCache(cloudFront, items = []) {
  return new Promise((resolve, reject) => {
    awsCloudfront.createInvalidation(
      {
        DistributionId: cloudFront.CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          Paths: {
            Quantity:
              items.length || cloudFront.CLOUDFRONT_INVALID_PATHS.length,
            Items: items.length ? items : cloudFront.CLOUDFRONT_INVALID_PATHS,
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
 * 生成版本文件
 */
function createVersionFile() {
  const time = new Date().toLocaleString();
  const lastCommitID = execSync('git rev-parse HEAD').toString().trim();
  const whoami = execSync('git config user.name').toString().trim();
  const filename = 'version.json';
  return {
    body: JSON.stringify({
      createTime: time,
      whoami,
      commitId: lastCommitID,
    }),
    key: BUCKET_PREFIX + filename,
    contentType: mime.getType(filename),
  };
}

/**
 * 获取文件md5
 * @param {*} p 文件路径
 */
function getMD5(p) {
  return '"' + md5(fs.readFileSync(p)) + '"';
}

async function getOriginFileList(
  bucket,
  dir,
  list = {Contents: [], KeyCount: 0},
  nextContinuationToken,
) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir,
    MaxKeys: 10000,
    ContinuationToken: nextContinuationToken,
  };
  const res = await s3.listObjectsV2(listParams).promise();
  list.Contents = list.Contents.concat(res.Contents);
  list.KeyCount += res.KeyCount;
  list.Name = res.Name;
  list.Prefix = res.Prefix;
  if (res.IsTruncated) {
    await getOriginFileList(bucket, dir, list, res.NextContinuationToken);
  }
  list.Contents = list.Contents.filter(({Key}) => {
    return (
      IGNORE_PREFIX.findIndex((prefix) => new RegExp(prefix).test(Key)) === -1
    );
  });
  return list;
}
