//
//  ApiManager.swift
//  LuckyDeal
//
//  Created by Hinnka on 2020/9/22.
//

import Foundation
import Alamofire
import SwiftyJSON
import InnoAntiSpamSDK
import InnoSecureSDK

let domain = Constants.DEV_MODE ? "http://api.test.luckynow.me:9001/" : "https://api.luckydeal.vip/"
let session = Session(interceptor: Interceptor(retriers: [RetryPolicy(retryLimit: 3)]))//interceptor拦截器


class InnoEncoder: ParameterEncoder {
  static let shared = InnoEncoder()

  func encode<Parameters>(_ parameters: Parameters?, into request: URLRequest) throws -> URLRequest where Parameters : Encodable {
    guard let data = parameters as? Data, request.method == HTTPMethod.post else {
        return request
    }
    let dataStr = String(data: data, encoding: .utf8)
    let encodedData = InnoSecureMain.innoSecureEncode(dataStr!)
    var newReq = try request.asURLRequest()
    newReq.httpBody = encodedData?.base64EncodedData()
    return newReq
  }
}

@objc class Api : NSObject {
  static func request(path: String, method: HTTPMethod = .post, rawString: Bool = false, parameters: [String:Encodable], responseCallback: @escaping (JSON) -> ()) {
    var params = parameters
            params["platform"] = 2
            params["luid"] = InnoMain.getLUID()
            params["tk"] = InnoMain.loadInfo()
            params["bundle_code"] = UpdateManager.shared.activeBundleVersion
            params["version_code"] = AppInfo.buildVersion
            let data = try? JSONSerialization.data(withJSONObject: params, options: [])

            var header = [String:String]()
            header["Authorization"] = LuckyUser.user.token
            header["luid"] = InnoMain.getLUID()
            header["tk"] = InnoMain.loadInfo()
            header["tuid"] = InnoMain.loadTuid()
            header["Content-language"] = Locale.preferredLanguages.first
            header["cid"] = "luckydeal"
            print("request header", header)
            let httpHeaders = HTTPHeaders(header)
            var url = domain + path
            if path.starts(with: "http") {
                url = path
            }

            session.request(url, method: method, parameters: data, encoder: InnoEncoder.shared, headers: httpHeaders, interceptor: nil).responseJSON(queue: .main, options: []) { (res) in
                print(path, String(data: res.data ?? Data(), encoding: .utf8) ?? "")
                switch res.result {
                case .success(let json):
                    let jsonObj = JSON(json)
                    if !rawString && jsonObj["code"].intValue == 0 && !jsonObj["data"].isEmpty {
                        responseCallback(jsonObj["data"])
                    } else {
                        responseCallback(jsonObj)
                    }
                case .failure(let error):
                    print(error)
                    var err = [String:Any]()
                    err["code"] = error.responseCode ?? -1
                    err["error"] = error.errorDescription ?? "Unkown"
                    responseCallback(JSON(err))
                }
            }
  }
  
  @objc static func upload(path: String, uri: [String], callback: @escaping (String) -> ()) {
    var url = domain + path
    if path.starts(with: "http") {
        url = path
    }
    var header = [String:String]()
    header["Authorization"] = LuckyUser.user.token
//    header["luid"] = InnoMain.getLUID()
    header["tk"] = InnoMain.loadInfo()
    header["version_code"] = String(AppInfo.buildVersion)
    header["bundle_code"] = String(UpdateManager.shared.activeBundleVersion)
//    header["tuid"] = InnoMain.loadTuid()
//    header["Content-language"] = Locale.preferredLanguages.first
//    header["cid"] = "luckydeal"
    print("request header", header)
    let httpHeaders = HTTPHeaders(header)
    let multipart = MultipartFormData()
    uri.forEach { (item) in
      multipart.append(URL(string: item)!, withName: "file")
    }
    session.upload(multipartFormData: multipart, to: url, headers: httpHeaders).responseString { (res) in
      print(res)
      switch res.result {
      case .success(let json):
          callback(json)
      case .failure(let error):
        var err = [String:Any]()
        err["code"] = error.responseCode ?? -1
        err["error"] = error.errorDescription ?? "Unkown"
        callback(JSON(err).rawString() ?? "{}")
      }
    }
  }
}
