Component({
  properties: {
    menu: {
      type: Array
    },
    pid: {
      type: Number,
      value: 0
    },
    currentDocId: {
      type: Number,
      value: 0,
    }
  },
  methods: {
    itemClick: function(e) {
      this.triggerEvent('itemClick', e.currentTarget.dataset)
    },
    menuClick:function(e){
      this.triggerEvent('itemClick', e.detail)
    }
  }
})