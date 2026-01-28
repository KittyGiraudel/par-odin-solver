import type React from 'react'
import './styles.css'

export interface HeaderProps {
  onOpenRules: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenRules }) => {
  return (
    <header className='header'>
      <div className='header-inner'>
        <h1 className='header-title'>
          🎲 <span className='header-title-em'>Par Odin!</span> Solver
        </h1>
        <button
          type='button'
          className='header-rules-button'
          onClick={onOpenRules}
        >
          Learn the rules
        </button>
      </div>
    </header>
  )
}
