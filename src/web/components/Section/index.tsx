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
  <section {...props} className={`section ${props.className ?? ''}`}>
    <div className='section-header'>
      <div className='section-header-content'>
        {title && <h2 className='section-title'>{title}</h2>}
        {subtitle && <p className='section-subtitle'>{subtitle}</p>}
      </div>
      <div className='section-header-actions'>{actions}</div>
    </div>
    {children}
  </section>
)
