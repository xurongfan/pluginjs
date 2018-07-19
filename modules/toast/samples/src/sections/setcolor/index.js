import { query } from '@pluginjs/dom'
import Toast from '@pluginjs/toast'

const btn = query('#setcolor .setColor')
btn.addEventListener('click', () => {
  Toast.open({
    icon: 'success',
    iconColor: 'red',
    title: 'Inconceivable!',
    titleColor: 'blue',
    content: 'I do not think that word means what you think it means.',
    contentColor: 'red',
    closeBtnColor: 'green'
  })
})