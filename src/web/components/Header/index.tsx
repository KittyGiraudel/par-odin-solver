import type React from 'react'
import './styles.css'

export interface HeaderProps {
  onOpenRules: () => void
}

export const Header: React.FC<HeaderProps> = ({ onOpenRules }) => {
  return (
    <header className='Header'>
      <div className='Header__inner'>
        <h1 className='Header__title'>
          🎲 <span className='Header__title-em'>Par Odin!</span> Solver
        </h1>
        <button
          type='button'
          className='Header__rules-button'
          onClick={onOpenRules}
        >
          Learn the rules
        </button>
      </div>
    </header>
  )
}
