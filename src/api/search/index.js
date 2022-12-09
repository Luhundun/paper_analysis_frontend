
import request from '@/utils/request'
import request2 from '@/utils/request2'
import qs from 'qs';

export function search(array,len,date,isCore) {
  date = qs.parse(date, { arrayFormat: 'brackets' }); //将URL解析成对象的形式
  array = qs.parse(array, { arrayFormat: 'brackets' });

  return request2({
    url: '/api1/searchResultR/',
    method: 'get',
	// array, date, isCore
	params: { array, len, date, isCore },
	// paramsSerializer: params => {
	//   return qs.stringify(params, { indices: false })
	// },
	
  })
}

export function getSequenceBySearch(beginYear,endYear,minValue,paper) {
  paper = qs.parse(paper); //将URL解析成对象的形式
  
  // paper = JSON.stringify(paper)
  // paper = "["+paper.slice(1,-1)+"]"

  return request({
    url: '/getPicJsonBySearch',
    method: 'post',
	params: { beginYear, endYear, minValue, paper },	
  })
}

export function getAuthorBySearch(data) {
  data.paper = qs.parse(data.paper); //将URL解析成对象的形式

  return request({
    url: '/getAuthBySearch',
    method: 'post',
	params: data,	
  })
}


