import { defineStore } from 'pinia'
import { PaperResult, PaperNoAbs } from '@/views/search/result'
import { da } from 'element-plus/es/locale';

interface ResultInterface {
  data: PaperResult[];
  noAbs: PaperNoAbs[];
  rid: number;
  pages: number;
  total: number;
  noAbsExist: boolean;
}

export const useSearchResult = defineStore('searchResult', {
  state: (): ResultInterface => ({
    data: [],
    rid: 1,
    pages: 1,
    noAbs: [],
    total: 0,
    noAbsExist: false,
  }),
  getters: {
    getData(state) {
      // 自动完成! ✨
      return this.data;
    },

    getNoAbs(state) {
      // 自动完成! ✨
      return this.noAbs;
    },
  },
  actions: {
    // 任何数量的参数，返回一个 Promise 或者不返回
    setResult(text: PaperResult[]) {
      // 你可以直接改变状态
      this.data = text
      // console.log(this.data)
    },

    setNoAbs() {
      // 你可以直接改变状态
      if (!this.noAbsExist) {
        var r: any;
        this.data.every((r, index, array) => {
          var noAbs: PaperNoAbs = {
            author: "",
            institution: "",
            title: "",
            source: "",
            time: 0,
            keywords: "",
            database: "",
          };
          noAbs.institution = r.institution;
          noAbs.title = r.title;
          noAbs.keywords = r.keywords;
          noAbs.author = r.author;
          noAbs.time = r.time;
          this.noAbs.push(noAbs);
          return true;
        })
        this.noAbsExist = true;
      }
    },
    sortByYear(method: string|null) {
      if (method === 'ascending') {
        this.data.sort((a:PaperResult, b:PaperResult) => {
          return a.time-b.time;
        });
      } else if (method === 'descending') {
        this.data.sort((a:PaperResult, b:PaperResult) => {
          return b.time-a.time;
        });
      }
    }

  },
})