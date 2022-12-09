import {ref} from "vue";
import Storage from "good-storage" ;
import {useRoute} from "vue-router";
import { TableColumns } from "@/components/crudForm/type"



// export default function () {
//   const tableFields = ref<TableColumns[]>([])
//   const routePath = useRoute().path
//   let userSetCol:TableColumns[] = Storage.get("userSetTableColumn:" + routePath, [])
//   console.log("stroage:",userSetCol)
//   //TODO 对接你们的展示字段
//   tableFields.value = userSetCol.length > 0 ? userSetCol :
//       [
//         {"field":"title","title":"标题","show":true},
//         {"field":"author","title":"作者","show":true},
//         {"field":"institution","title":"机构","show":true},
//         {"field":"source","title":"刊物","show":true},
//         {"field":"time","title":"发表时间","show":true},
//         {"field":"keywords","title":"关键字","show":true},

//       ]
//   return {tableFields}

export default function () {
  const tableFields = ref<TableColumns[]>([])
  const routePath = useRoute().path
  // let userSetCol:TableColumns[] = Storage.get("userSetTableColumn:" + routePath, [])
  //TODO 对接你们的展示字段
  tableFields.value = 
      [
        {"field":"title","title":"标题","show":true},
        {"field":"author","title":"作者","show":true},
        {"field":"institution","title":"机构","show":true},
        {"field":"source","title":"刊物","show":true},
        {"field":"keywords","title":"关键字","show":true},
        {"field":"time","title":"发表时间","show":true,"colAttrs":{"sortable":'custom',':sort-orders':"['ascending', 'descending']","width":"105px"}},
      ]
  Storage.set("userSetTableColumn:" + routePath,tableFields.value) 
  return {tableFields}
}
