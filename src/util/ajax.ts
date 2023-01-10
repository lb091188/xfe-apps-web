import type { LooseObject } from "@/moduleType";
import { Ajax, type AjaxErrorObject, type AjaxResopnse } from "xfe-ajax-ts";
import { useRoute } from "vue-router";
import { ElMessage } from "element-plus";

interface ownConfig {
  /** 请求路径 */
  url: string;
  /** 放置于请求体的参数 */
  data?: Record<string, any> | XMLHttpRequestBodyInit | Document;
  /** 放置于URL中的参数 */
  params?: Record<string, Date | object | string>;
  method?: "GET" | "DELETE" | "HEAD" | "OPTIONS" | "POST" | "PUT" | "PATCH";
}

interface resData<T> {
  message: string;
  data: T;
}

export const ajaxObj: LooseObject = {};

export async function createAjax<T>({ url = "", method = "GET", data = {}, params = {} }: ownConfig) {
  let ajax: XMLHttpRequest | false;
  let promise = new Promise<resData<T>>((resolve, reject) => {
    ajax = Ajax({
      baseURL: "/api",
      url,
      method,
      data,
      params,
      before(config) {
        return config;
      },
      success(res: AjaxResopnse) {
        resolve(res.data as resData<T>);
      },
      error(err: AjaxErrorObject) {
        let {
          // @ts-ignore
          response: { status, data: resData },
        } = err;
        switch (status) {
          case 401:
            window.location.href = "/login/";
            break;
          case 403:
            window.location.href = "/403/";
            break;
          default:
            resData = JSON.parse(resData);
            ElMessage({
              type: "error",
              message: resData.message,
            });
            break;
        }
        reject(err);
      },
    });
    if (!ajax) {
      reject(new Error("createAjax Error"));
    } else {
      let abort = ajax.abort;
      ajax.abort = function () {
        let a: resData<T> = {
          message: "请求已取消",
          // @ts-ignore
          data: null,
        };
        resolve(a);
        abort();
      };
    }
  });
  const route = useRoute();
  if (route) {
    if (!ajaxObj[route.path]) {
      ajaxObj[route.path] = [];
    }
    //  @ts-ignore
    ajaxObj[route.path].push(ajax);
  }
  //  @ts-ignore
  return { promise, ajax };
}
