import type { ComponentProps } from 'react'
import './styles.css'

export const Section: React.FC<
  React.PropsWithChildren<{
    title?: React.ReactNode
    subtitle?: React.ReactNode
  }> &
    ComponentProps<'section'>
> = ({ children, title, subtitle, ...props }) => (
  <section {...props} className={`section ${props.className ?? ''}`}>
    {title && <h2 className='section-title'>{title}</h2>}
    {subtitle && <p className='section-subtitle'>{subtitle}</p>}
    {children}
  </section>
)
