Component({
  properties: {
    wd: {
      type: String,
      value: ''
    },
    placeholder: {
      type: String,
      value: 'Search...'
    },
    focus: {
      type: Boolean,
      value: false,
    }
  },
  data: {
    wd: '',
    showClear: false,
  },
  methods: {
    search: function(e) {
      if (e.detail.value != '') {
        this.setData({
          wd: e.detail.value,
          showClear: e.detail.value != ""
        })
        this.triggerEvent('search', { wd: e.detail.value})
      }
    },
    formSubmit: function(e) {
      if (this.data.wd != '') {
        this.triggerEvent('search', { wd: this.data.wd})
      }
    },
    changeValue: function(e) {
      if (this.data.wd != "" && e.detail.value == "") {
        this.triggerEvent('clear')
      }
      this.setData({
        wd: e.detail.value,
        showClear: e.detail.value != ""
      })
    },
    clear: function(e) {
      this.setData({
        wd: "",
        showClear:false,
      })
      this.triggerEvent('clear')
    }
  }
})