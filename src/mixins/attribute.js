/* eslint-disable one-var */
export default {
  methods: {
    formatAttribute (attributes, values) {
      let result = []
      values = values || {}
      this._.map(attributes, (attribute) => {
        let attributeCode = attribute['attribute_code'],
          value = values[attributeCode]
        attribute['value'] = attribute['is_collection'] ? [] : ''
        attribute['rules'] = []
        attribute['error'] = ''

        if (attribute['is_required']) {
          attribute['rules'].push({required: true, message: '请输入' + attribute['frontend_label']})
        }
        if (attribute['frontend_input'] === 'number') {
          attribute['rules'].push({type: 'number', message: '请输入数字'})
        }

        if (value) {
          attribute['value'] = value
          if (attribute['frontend_input'] === 'datetime') {
            attribute['value'] = new Date(value)
          }
        }
        result.push(this._.clone(attribute, true))
      })
      return result
    },
    getAttributeValue (attributes) {
      let result = {}

      for (let i = 0; i < attributes.length; i++) {
        let attribute = attributes[i], attributeCode = attribute['attribute_code']
        result[attributeCode] = attribute['value']
        if (attribute['frontend_input'] === 'datetime') {
          if (attribute['value']) {
            result[attributeCode] = this.$moment(attribute['value']).utcOffset(0).format('YYYY-MM-DDTHH:mm:ssZ')
          } else {
            result[attributeCode] = ''
          }
        }
      }
      return result
    }
  }
}
