import type React from 'react'
import type { useA11yDialog } from 'react-a11y-dialog'
import './styles.css'

type A11yDialogAttrs = ReturnType<typeof useA11yDialog>[1]

type DialogProps = React.PropsWithChildren<{
  attrs: A11yDialogAttrs
  title: React.ReactNode
}>

export const Dialog: React.FC<DialogProps> = ({ attrs, title, children }) => {
  return (
    <div {...attrs.container} className='Dialog__container'>
      <div {...attrs.overlay} className='Dialog__overlay' />
      <div {...attrs.dialog} className='Dialog__dialog'>
        <h1 {...attrs.title} className='Dialog__title'>
          {title}
        </h1>
        <button
          {...attrs.closeButton}
          className='Dialog__close'
          aria-label='Close'
        >
          ×
        </button>
        <div className='Dialog__body'>{children}</div>
      </div>
    </div>
  )
}
