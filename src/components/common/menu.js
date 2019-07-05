// components/common/menu.js
Component({
  properties: {
    book: {
      type: Object,
    },
    menu: {
      type: Array,
      value: []
    },
    result: {
      type: Array
    },
    wd: {
      type: String
    },
    result: {
      type: Array,
      value: []
    },
    currentDocId: {
      type: Number,
      Value: 0,
    },
    token: {
      type: String
    }
  },
  data: {
    pid: 0
  },
  methods: {
    tabClick: function(e) {
      if (e.target.dataset.tab != this.data.activeTab) {
        this.triggerEvent('tabClick', e.target.dataset)
      }
    },
    delBookmark: function(e) {
      this.triggerEvent('delBookmark', e.target.dateset)
    },
    search: function(e) {
      this.triggerEvent('search', e.detail)
    },
    itemClick: function(e) {
      this.triggerEvent('itemClick', e.detail)
    },
    clear: function(e) {
      this.triggerEvent('clear')
    }
  }
})