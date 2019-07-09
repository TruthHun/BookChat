Component({
  properties: {
    gridLen: {
      type: Number,
      value: 12, //1 ~ 12
    },
    tabs: {
      type: Array,
      value: []
    },
    active: {
      type: String
    },
    showSearch: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    active: '',
    gridLenLeft: 4,
  },
  methods: {
    tabClick: function(e) {
      this.setData({
        active: e.target.dataset.value
      })
      this.triggerEvent('click', e.target.dataset)
    }
  },
  attached: function() {
    let gridLenLeft = 12 - this.data.gridLen

    if (this.data.tabs.length > 0 && this.data.active == '') {
      this.setData({
        active: this.data.tabs[0].value,
        gridLenLeft: gridLenLeft,
      })
    }
  }
})