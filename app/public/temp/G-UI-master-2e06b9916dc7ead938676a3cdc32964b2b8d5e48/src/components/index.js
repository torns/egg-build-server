import Navbar from './Navbar.vue'
import Block from './Block.vue'
import Color from './Color.vue'
import ButtonGroup from './ButtonGroup.vue'
import Input from './Input.vue'
import Tabs from './Tabs.vue'
import Catalog from './Catalog.vue'
import Popover from './Popover.vue'
import Dialog from './Dialog.vue'
import Alert from './Alert.vue'
import Infobar from './Infobar.vue'

const components = {
  Navbar,
  Block,
  Color,
  ButtonGroup,
  Input,
  Tabs,
  Catalog,
  Popover,
  Dialog,
  Alert,
  Infobar
}

const install = Vue => {
  if (install.installed) return
  Object.keys(components).forEach(component => {
    Vue.component(components[component].name, components[component])
  })
  install.installed = true
}
install.installed = false
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
  install.installed = true
}

const Vcomp = {
  ...components,
  install
}

export default Vcomp
