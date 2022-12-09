import service_spring from "@/utils/request"
import request from '@/utils/request'
import {FormFields} from "@/components/crudForm/type";
// import qs from 'qs';


export function getSequencePic(data:any) {
  return service_spring({
    url: '/getPicJson',
    method: 'get',
    params:data,
  })
}
// export function getSequenceBySearch(data:any) {
//   return service_spring({
//     url: '/getPicJsonBySearch',
//     method: 'post',
//     params:data,
//   })
// }

export function getAuthorPic(data:any) {

  return request({
    url: '/getAuthJson',
    method: 'get',
    params:data,
  })

}
export function getKeywordPic(data:any) {
  return request({
    url: '/getKeyJsonBySearch',
    method: 'get',
    params:data,
  })
}
export function getInsPic(data:any) {
  return request({
    url: '/getInsJson',
    method: 'get',
    params:data,
  })
}