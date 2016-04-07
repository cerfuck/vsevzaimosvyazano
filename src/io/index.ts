import { WebRequest } from './web-request';
import { IRequest, IAbstractRequest, types, IConfig } from './interfaces';
import { utils } from '../utils';
import {IResponse} from "./interfaces/IResponse";
import {queries} from './queries/index';
import { resolveMarket } from './response/get-market';
export * from './request';

export class Io {
  private webRequest: WebRequest = null;
  private config: IConfig = null;

  constructor(config: IConfig) {
    this.config = config;
  }

  /**
   * @param {IRequest} request
   */
  private vkSend(request: IRequest, callback) {
    this.webRequestSend(this.config.server, request, this.handleResponse(request.getName(), callback));
    console.info(
        `send request to ${this.config.server} method: ${request.getName()}`,
        'request data: ', request.getData());
  }


  /**
   * @param {string} server
   * @param {IRequest} request
   * @param {Function} response
   */
  private webRequestSend(server: string, request: IRequest, response: Function) {
    this.webRequest = new WebRequest(server);
    this.webRequest.setData(request.getData());
    this.webRequest.send(response);
    console.info(
        `send request method: ${request.getName()}`,
        'request data: ', request.getData());
  }


  private handleResponse(typeResponse: string, callback: Function) {
    return (data: string) => {
      let response = utils.decodeJsonData('{"response":[2,{"id":156554,"owner_id":-61279456,"title":"Парам","description":"ПАрам парам","price":{"amount":"10000","currency":{"id":643,"name":"RUB"},"text":"100 руб."},"category":{"id":1,"name":"Женская одежда","section":{"id":0,"name":"Гардероб"}},"date":1460046983,"thumb_photo":"http:\/\/cs629100.vk.me\/v629100541\/3d796\/IMMoxxaJKfo.jpg","availability":0},{"id":152953,"owner_id":-61279456,"title":"Шляпа широкополая","description":"Вот такая вот шляпа","price":{"amount":"250000","currency":{"id":643,"name":"RUB"},"text":"2 500 руб."},"category":{"id":1,"name":"Женская одежда","section":{"id":0,"name":"Гардероб"}},"date":1459714627,"thumb_photo":"http:\/\/cs630925.vk.me\/v630925541\/228e2\/0RCz4nrRZLE.jpg","availability":0}]}');
      // let response = utils.decodeJsonData('{"error":{"error_code":113,"error_msg":"Invalid user id","request_params":[{"key":"oauth","value":"1"},{"key":"method","value":"users.get"},{"key":"user_ids","value":"chistokhvalova.viktoriy"}]}}');
      if (response['response']) {
        let lengthResponseArray: number = response['response'].splice(0, 1).join();
        let resultResponse = this.prepareResponse(typeResponse, response['response']);
        callback(resultResponse, lengthResponseArray, data);
      } else if (response['error']) {
        console.error(`response ${typeResponse} error`);
      }
    }
  }

  private prepareResponse(type: string, response: Array<Object>): Array<Object> {
    let result;
    switch (type) {
      case queries.GET_MARKET:
        result = resolveMarket(response);
        break;
      default:
        result = response;
        break;
    }
    return result;
  }

  /**
   * @inheritDoc
   */
  public send(req: IAbstractRequest, callback?: Function) {
    let request = req.getRequest();
    if (request) {
      this.vkSend(request, callback);
    } else {
      console.info(`request wasn't sent`, JSON.stringify(req));
    }
  }
}


// {"response":[1,{"id":152953,"owner_id":-61279456,"title":"Шляпа широкополая","description":"Вот такая вот шляпа","price":{"amount":"250000","currency":{"id":643,"name":"RUB"},"text":"2 500 руб."},"category":{"id":1,"name":"Женская одежда","section":{"id":0,"name":"Гардероб"}},"date":1459714627,"thumb_photo":"http:\/\/cs630925.vk.me\/v630925541\/228e2\/0RCz4nrRZLE.jpg","availability":0}]}

// Load = function () {
//   window['CallbackRegistry'] = {};
// };
//
// Load.prototype.createRequest = function(url, onSuccess, onError) {
//   var scriptOk = false; // флаг, что вызов прошел успешно
//   var callbackName = 'cb' + String(Math.random()).slice(-6);
//   var script = document.createElement('script');
//
//   url += ~url.indexOf('?') ? '&' : '?';
//   url += 'callback=CallbackRegistry.' + callbackName;
//
//   CallbackRegistry[callbackName] = function(data) {
//     scriptOk = true;
//     delete CallbackRegistry[callbackName];
//     script.remove();
//     onSuccess(data.response);
//   };
//
//   function checkCallback() {
//     if (scriptOk) return;
//     delete CallbackRegistry[callbackName];
//     onError(url);
//   }
//
//   script.onreadystatechange = function() {
//     if (this.readyState == 'complete' || this.readyState == 'loaded') {
//       this.onreadystatechange = null;
//       setTimeout(checkCallback, 0); // Вызвать checkCallback - после скрипта
//     }
//   };
//
//   script.onload = script.onerror = checkCallback;
//   script.src = url;
//
//   document.getElementsByTagName('head')[0].appendChild(script);
// };
