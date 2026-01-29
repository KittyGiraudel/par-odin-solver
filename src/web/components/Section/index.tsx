import type { ComponentProps } from 'react'
import './styles.css'

export const Section: React.FC<
  React.PropsWithChildren<{
    title?: React.ReactNode
    subtitle?: React.ReactNode
    actions?: React.ReactNode
  }> &
    ComponentProps<'section'>
> = ({ children, title, subtitle, actions, ...props }) => (
  <section {...props} className={`Section ${props.className ?? ''}`}>
    <div className='Section__header'>
      <div className='Section__header-content'>
        {title && <h2 className='Section__title'>{title}</h2>}
        {subtitle && <p className='Section__subtitle'>{subtitle}</p>}
      </div>
      <div className='Section__header-actions'>{actions}</div>
    </div>
    {children}
  </section>
)
